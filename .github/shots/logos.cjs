// Acha o logo no cabeçalho de cada site, baixa o arquivo original (svg/png/webp/jpg) e tira um print só do logo
const { chromium } = require('playwright');
const fs = require('fs');
const sites = JSON.parse(fs.readFileSync(__dirname + '/logos.json', 'utf8'));
const OUT = 'thomas-macedo/img/logos/raw';
fs.mkdirSync(OUT, { recursive: true });
const info = {};
(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  for (const s of sites) {
    if (fs.readdirSync(OUT).some(f => f.startsWith(s.slug + '.'))) continue;
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: 'pt-BR',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36' });
    const p = await ctx.newPage();
    try {
      await p.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      try { await p.waitForLoadState('networkidle', { timeout: 20000 }); } catch (e) {}
      await p.waitForTimeout(3000);
      const found = await p.evaluate(() => {
        const sels = ['header a[href="/"] img','header a[href="/"] svg','header [class*="logo" i] img','header [class*="logo" i] svg',
          'a[href="/"] img','[class*="logo" i] img','[id*="logo" i] img','[class*="logo" i] svg','img[alt*="logo" i]',
          '.navbar-brand img','header img','header svg','nav img'];
        for (const sel of sels) {
          for (const el of document.querySelectorAll(sel)) {
            const r = el.getBoundingClientRect();
            if (r.width < 30 || r.height < 12 || r.top > 260 || r.top < -5) continue;
            const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue;
            el.setAttribute('data-logo-pick', '1');
            // cor de fundo efetiva por trás do logo
            let n = el, bg = '';
            while (n && n !== document.documentElement) { const b = getComputedStyle(n).backgroundColor; if (b && b !== 'rgba(0, 0, 0, 0)' && b !== 'transparent') { bg = b; break; } n = n.parentElement; }
            if (el.tagName.toLowerCase() === 'svg') {
              const c = el.cloneNode(true); if (!c.getAttribute('xmlns')) c.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
              if (!c.getAttribute('width')) c.setAttribute('width', Math.round(r.width)); if (!c.getAttribute('height')) c.setAttribute('height', Math.round(r.height));
              return { sel, type: 'svg', svg: c.outerHTML, color: getComputedStyle(el).color, bg, w: r.width, h: r.height };
            }
            return { sel, type: 'img', src: el.currentSrc || el.src, bg, w: r.width, h: r.height };
          }
        }
        for (const el of document.querySelectorAll('img')) {
          const k = ((el.currentSrc || el.src || '') + ' ' + (el.alt || '') + ' ' + (el.className || '')).toLowerCase();
          const r = el.getBoundingClientRect();
          if (k.includes('logo') && r.width >= 30) { el.setAttribute('data-logo-pick', '1'); return { sel: 'img[*logo*]', type: 'img', src: el.currentSrc || el.src, bg: '', w: r.width, h: r.height }; }
        }
        return null;
      });
      info[s.slug] = found ? { ...found, svg: found.svg ? '(svg)' : undefined } : null;
      console.log(s.slug, found ? found.sel + ' ' + found.type + ' ' + (found.src || '') + ' bg=' + found.bg : 'NAO ACHOU');
      if (!found) { await ctx.close(); continue; }
      if (found.type === 'svg') fs.writeFileSync(`${OUT}/${s.slug}.svg`, found.svg);
      else if (found.src && !found.src.startsWith('data:')) {
        let big = found.src; try { const u = new URL(found.src); u.searchParams.delete('width'); u.searchParams.delete('height'); big = u.toString().replace(/_(\d+x\d*|x\d+)(@2x)?(?=\.(png|jpe?g|webp))/i, ''); } catch (e) {}
        info[s.slug].big = big;
        const r = await ctx.request.get(big, { headers: { referer: s.url } });
        if (r.ok()) {
          const ct = (r.headers()['content-type'] || '').toLowerCase();
          const ext = ct.includes('svg') ? 'svg' : ct.includes('png') ? 'png' : ct.includes('webp') ? 'webp' : ct.includes('avif') ? 'avif' : ct.includes('gif') ? 'gif' : 'jpg';
          fs.writeFileSync(`${OUT}/${s.slug}.${ext}`, await r.body()); info[s.slug].file = `${s.slug}.${ext}`;
        }
      }
      const el = await p.$('[data-logo-pick="1"]');
      if (el) await el.screenshot({ path: `${OUT}/${s.slug}-shot.png`, omitBackground: true });
    } catch (e) { console.log(s.slug, 'ERRO', e.message); }
    await ctx.close();
  }
  fs.writeFileSync(`${OUT}/info.json`, JSON.stringify(info, null, 1));
  await browser.close();
})().catch(e => console.log('FATAL', e && e.stack || e));
