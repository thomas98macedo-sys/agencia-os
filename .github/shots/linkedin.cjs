// Prints do site no ar (fontes reais, 2x) para os posts do LinkedIn
const { chromium } = require('playwright');
const fs = require('fs');
const OUT = 'geo/linkedin/img'; fs.mkdirSync(OUT, { recursive: true });
const SITE = 'https://www.thomas-macedo.com/';
const SHOTS = [
  ['01-hero', '.hero'], ['02-numeros', '.band'], ['03-frentes', '#frentes'], ['04-tiktok', '#parceria-tiktok'],
  ['05-friday', '#friday'], ['06-marcas', '#marcas'], ['07-apps', '#apps'], ['08-lince', '#lince'],
];
(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  for (const [theme, suf] of [['claro', ''], ['escuro', '-noite']]) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
    await ctx.addInitScript(t => { try { localStorage.setItem('tema', t); } catch (e) {} }, theme);
    const p = await ctx.newPage();
    await p.goto(SITE + '?v=' + Date.now(), { waitUntil: 'networkidle', timeout: 90000 });
    await p.addStyleTag({ content: '.reveal,.img-reveal img,[data-split] .wi{opacity:1!important;transform:none!important}.img-reveal::after{display:none!important}body>header,.wa-float{display:none!important}' });
    await p.evaluate(async () => { await document.fonts.ready; for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } scrollTo(0, 0); });
    await p.waitForTimeout(2500);
    for (const [n, sel] of SHOTS) {
      if (suf && !['01-hero', '03-frentes', '05-friday'].includes(n)) continue;
      const el = await p.$(sel); if (!el) { console.log('sem', sel); continue; }
      await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(900);
      await el.screenshot({ path: `${OUT}/${n}${suf}.png` }); console.log('ok', n + suf);
    }
    await ctx.close();
  }
  // site da LINCE: espera a animação de abertura
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.goto('https://linceperformance.com/', { waitUntil: 'networkidle', timeout: 90000 });
  for (const [i, wait] of [[1, 6000], [2, 6000]]) { await p.waitForTimeout(wait); await p.screenshot({ path: `${OUT}/lince-site-${i}.png` }); console.log('ok lince', i); await p.mouse.wheel(0, 900); }
  await p.evaluate(async () => { for (let y = 0; y < 3000; y += 300) { scrollTo(0, y); await new Promise(r => setTimeout(r, 300)); } });
  await p.waitForTimeout(2500); await p.screenshot({ path: `${OUT}/lince-site-3.png` }); console.log('ok lince 3');
  await browser.close();
})().catch(e => console.log('FATAL', e && e.stack || e));
