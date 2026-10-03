// Abre a página oficial do programa (link de parceiro), tira prints e baixa as imagens grandes
const { chromium } = require('playwright');
const fs = require('fs');
const OUT = 'thomas-macedo/img/tiktok/raw';
fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: 'pt-BR',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36' });
  const p = await ctx.newPage();
  for (const url of ['https://getstartedtiktok.partnerlinks.io/6x6ko7wz5c2m', 'https://ads.tiktok.com/business/pt-BR', 'https://seller-br.tiktok.com/']) {
    const tag = new URL(url).hostname.split('.')[0];
    try {
      await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
      try { await p.waitForLoadState('networkidle', { timeout: 20000 }); } catch (e) {}
      await p.waitForTimeout(4000);
      for (const t of ['Aceitar todos', 'Aceitar todos os cookies', 'Accept all', 'Permitir todos', 'Aceitar']) {
        try { const b = p.getByRole('button', { name: t }).first(); if (await b.isVisible({ timeout: 500 })) { await b.click(); await p.waitForTimeout(800); } } catch (e) {}
      }
      console.log(tag, '->', p.url(), '| título:', await p.title());
      await p.screenshot({ path: `${OUT}/${tag}-dobra.png` });
      await p.evaluate(async () => { for (let y = 0; y < 6000; y += 500) { scrollTo(0, y); await new Promise(r => setTimeout(r, 300)); } scrollTo(0, 0); });
      await p.waitForTimeout(2000);
      await p.screenshot({ path: `${OUT}/${tag}-inteira.png`, fullPage: true });
      const imgs = await p.evaluate(() => [...document.querySelectorAll('img')].filter(i => i.naturalWidth >= 400).map(i => ({ src: i.currentSrc || i.src, w: i.naturalWidth, h: i.naturalHeight, alt: i.alt })));
      console.log(tag, 'imagens grandes:', imgs.length);
      let n = 0;
      for (const im of imgs.slice(0, 20)) {
        if (!im.src || im.src.startsWith('data:')) continue;
        try {
          const r = await ctx.request.get(im.src, { headers: { referer: p.url() } });
          if (!r.ok()) continue;
          const ct = (r.headers()['content-type'] || '');
          const ext = ct.includes('png') ? 'png' : ct.includes('webp') ? 'webp' : ct.includes('svg') ? 'svg' : ct.includes('avif') ? 'avif' : 'jpg';
          n++; fs.writeFileSync(`${OUT}/${tag}-img-${String(n).padStart(2, '0')}.${ext}`, await r.body());
          console.log('  ', n, im.w + 'x' + im.h, im.alt || '', im.src.slice(0, 140));
        } catch (e) {}
      }
    } catch (e) { console.log(tag, 'ERRO', e.message.split('\n')[0]); }
  }
  await browser.close();
})().catch(e => console.log('FATAL', e && e.stack || e));
