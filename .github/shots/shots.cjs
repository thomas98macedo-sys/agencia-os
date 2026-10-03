// Tira print da primeira dobra de cada site (1440x900) e grava img/marcas/<slug>.png + resolved.json
const { chromium } = require('playwright');
const fs = require('fs');
const sites = JSON.parse(fs.readFileSync(__dirname + '/sites.json', 'utf8'));
const OUT = 'thomas-macedo/img/marcas';
fs.mkdirSync(OUT, { recursive: true });
const HIDE = `
  [class*="popup" i],[id*="popup" i],[class*="modal" i]:not(body):not(html),[id*="modal" i],
  [class*="newsletter" i][class*="pop" i],[class*="klaviyo" i],[id*="klaviyo" i],
  [class*="cookie" i],[id*="cookie" i],[class*="lgpd" i],[id*="lgpd" i],[class*="consent" i],
  [class*="overlay" i]:not(header *),.needsclick,[aria-modal="true"],
  iframe[src*="chat" i],[class*="whatsapp" i],[id*="whatsapp" i],[class*="wa-" i]
  { display:none !important; visibility:hidden !important }
  html,body{ overflow:auto !important }`;
process.on('unhandledRejection', e => { console.log('UNHANDLED', e && e.stack || e); });
(async () => {
  const browser = await chromium.launch();
  const resolved = {};
  for (const s of sites) {
    for (const url of s.urls) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, locale: 'pt-BR',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36' });
      const p = await ctx.newPage();
      try {
        const r = await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
        const st = r ? r.status() : 0;
        console.log(s.slug, url, '->', st, p.url());
        if (st >= 400 || st === 0) { await ctx.close(); continue; }
        try { await p.waitForLoadState('networkidle', { timeout: 15000 }); } catch (e) {}
        await p.addStyleTag({ content: HIDE });
        await p.waitForTimeout(2500);
        await p.addStyleTag({ content: HIDE });
        await p.screenshot({ path: `${OUT}/${s.slug}.png` });
        resolved[s.slug] = p.url();
        await ctx.close();
        break;
      } catch (e) { console.log(s.slug, url, 'ERRO', e.message); await ctx.close(); }
    }
  }
  fs.writeFileSync(`${OUT}/resolved.json`, JSON.stringify(resolved, null, 2));
  console.log(resolved);
  await browser.close();
})().catch(e => { console.log('FATAL', e && e.stack || e); });
