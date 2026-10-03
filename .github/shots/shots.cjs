// Print da 1ª dobra (1440x900) de cada site -> thomas-macedo/img/marcas/<slug>.png
const { chromium } = require('playwright');
const fs = require('fs');
const sites = JSON.parse(fs.readFileSync(__dirname + '/sites.json', 'utf8'));
const OUT = 'thomas-macedo/img/marcas';
fs.mkdirSync(OUT, { recursive: true });
process.on('unhandledRejection', e => console.log('UNHANDLED', e && e.stack || e));

async function clean(p) {
  // 1) aceita cookies / fecha pop-ups por texto
  for (const t of ['Aceitar todos', 'Aceitar', 'Accept all', 'Accept', 'Concordo', 'Entendi', 'Ok, entendi', 'OK', 'Fechar', 'Não, obrigado', 'Agora não']) {
    try { const b = p.getByRole('button', { name: t, exact: true }).first(); if (await b.isVisible({ timeout: 300 })) { await b.click({ timeout: 1000 }); await p.waitForTimeout(400); } } catch (e) {}
  }
  try { await p.keyboard.press('Escape'); } catch (e) {}
  // 2) esconde só camadas flutuantes que cobrem a tela (pop-up, cookie, chat), nunca o header/conteúdo
  await p.evaluate(() => {
    const W = innerWidth, H = innerHeight;
    for (const el of document.querySelectorAll('body *')) {
      const cs = getComputedStyle(el);
      if (cs.position !== 'fixed' && cs.position !== 'sticky') continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const txt = (el.innerText || '').toLowerCase();
      const isHeaderish = r.top <= 2 && r.height < 200 && r.width > W * 0.9;
      const covers = (r.width * r.height) > W * H * 0.25;
      const isCookie = /cookie|privacidade|lgpd|consent/.test(txt) && r.height < H * 0.6;
      const isChat = r.width < 140 && r.height < 140 && r.right > W - 160 && r.bottom > H - 200;
      const isModal = el.getAttribute('aria-modal') === 'true' || el.getAttribute('role') === 'dialog';
      if (!isHeaderish && (covers || isCookie || isChat || isModal)) el.style.setProperty('display', 'none', 'important');
    }
    document.documentElement.style.overflow = 'auto'; document.body.style.overflow = 'auto';
  });
}

(async () => {
  const browser = await chromium.launch(process.env.SHOT_CHANNEL ? { channel: process.env.SHOT_CHANNEL } : {});
  for (const s of sites) {
    for (const url of s.urls) {
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, locale: 'pt-BR',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Safari/537.36' });
      const p = await ctx.newPage();
      try {
        const r = await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        const st = r ? r.status() : 0;
        console.log(s.slug, url, '->', st);
        if (st >= 400 || st === 0) { await ctx.close(); continue; }
        try { await p.waitForLoadState('networkidle', { timeout: 30000 }); } catch (e) {}
        // rola pra disparar lazy-load e volta ao topo
        await p.evaluate(async () => { for (let y = 0; y < 2400; y += 400) { scrollTo(0, y); await new Promise(r => setTimeout(r, 250)); } scrollTo(0, 0); });
        await p.waitForTimeout(6000);
        // garante que vídeos de fundo estejam tocando
        await p.evaluate(() => document.querySelectorAll('video').forEach(v => { v.muted = true; v.play().catch(() => {}); }));
        await p.waitForTimeout(3000);
        await clean(p);
        await p.waitForTimeout(1500);
        await clean(p);
        await p.screenshot({ path: `${OUT}/${s.slug}.png` });
        console.log(s.slug, 'OK');
        await ctx.close();
        break;
      } catch (e) { console.log(s.slug, url, 'ERRO', e.message); await ctx.close(); }
    }
  }
  await browser.close();
})().catch(e => console.log('FATAL', e && e.stack || e));
