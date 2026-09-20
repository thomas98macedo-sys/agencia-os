# Briefing do Machado — criação de conteúdo diário

> Fonte da verdade do foco editorial dos artigos diários do site thomas-macedo.com.
> Atualizado em 2026-09-20.

## Foco (a partir de agora)
**Somente TikTok Shop e TikTok Ads.** Todo artigo novo posiciona Thomas Macedo como
**referência em TikTok Shop e TikTok Ads**, ensina algo prático de verdade e termina
com um CTA para a pessoa criar a loja e começar a anunciar.

Estrutura de cada matéria: **ENSINAR → PROVAR → CTA.**
1. Ensina algo acionável (o "algo do dia") sobre TikTok Shop e/ou TikTok Ads.
2. Mostra autoridade do Thomas (experiência, método, exemplo).
3. Fecha com o CTA (ver seção "CTA e link" abaixo).

Exemplos de pautas: vender no TikTok Shop no Brasil; estrutura de campanha no TikTok Ads;
criativos que vendem (UGC/live/vídeo curto); TikTok Shop + Shopify; métricas (ROAS/CPA/GMV);
afiliados/creators; do primeiro vídeo à primeira venda.

## CTA e link (obrigatório em todo artigo)
- Link oficial a usar no CTA: **https://getstartedtiktok.partnerlinks.io/6x6ko7wz5c2m**
- O CTA leva a pessoa a **criar a loja no TikTok Shop e começar a anunciar** por esse link.
- Incentivo REAL (oferta oficial do TikTok for Business — "New Advertiser Coupon",
  **somente para novos anunciantes**): o TikTok dá crédito de anúncio **igual ao valor gasto**
  — ou seja, **dobra o primeiro investimento em Ads**. Tabela oficial:
  | Você gasta | Ganha em crédito de Ads |
  |---|---|
  | US$ 200 | US$ 200 |
  | US$ 500 | US$ 500 |
  | US$ 1.000 | US$ 1.000 |
  | US$ 4.000 | US$ 4.000 |
  | US$ 6.000 | US$ 6.000 |
- Enquadrar SEMPRE como benefício do LEITOR ("você gasta X e ganha +X em créditos") e como
  oferta DO TIKTOK. Sempre citar a condição "somente para novos anunciantes".
- NUNCA mencionar comissão/ganho do Thomas. O foco é o benefício de quem cria a loja.
- Texto-modelo do CTA (PT): *"Crie sua loja no TikTok Shop e comece a anunciar por aqui: como
  novo anunciante, o TikTok dá um crédito de Ads igual ao que você investe — você gasta e o
  TikTok dobra (ex.: gaste US$ 500 e ganhe US$ 500 em créditos). [Começar agora](https://getstartedtiktok.partnerlinks.io/6x6ko7wz5c2m)"*
- Texto-modelo do CTA (EN): *"Start your TikTok Shop and run your first ads here: as a new
  advertiser, TikTok matches your ad spend with ad credit — spend and TikTok doubles it
  (e.g., spend US$500 and get US$500 in credits). [Get started](https://getstartedtiktok.partnerlinks.io/6x6ko7wz5c2m)"*

## Divulgação (OBRIGATÓRIA — protege a conta e a autoridade)
- Incluir uma linha discreta de divulgação junto ao CTA, em PT e EN. Ex.:
  PT: *"Conteúdo com link de parceiro."* · EN: *"Contains a partner link."*
- Essa linha apenas sinaliza a relação de parceria (exigido pelo programa do TikTok e por
  CONAR/CDC e FTC). NÃO menciona comissão nem quanto o Thomas ganha — o foco é sempre o
  benefício do leitor. Sem essa linha há risco de banimento da conta de afiliado.
- Só afirmar a oferta do cupom nos valores oficiais da tabela acima (crédito = valor gasto,
  novos anunciantes). Não inventar outros valores/promoções.

## Regra de idioma — BILÍNGUE NA MESMA MATÉRIA
Cada artigo é **uma única página** com o conteúdo em **português E em inglês**:
1. Versão em **português** completa (título, dek, corpo, CTA, FAQ).
2. Divisória `<hr>` + `<h2 lang="en">🇺🇸 English version</h2>`.
3. Versão em **inglês** completa logo abaixo (tradução fiel, com o mesmo CTA + disclosure).
- Marcar blocos com `lang="pt-BR"` e `lang="en"`. Uma única URL por matéria.

## Padrão técnico (manter o que já existe)
- Mesmo template dos artigos em `thomas-macedo/artigos/` (header, prose, author-box, related, CTA, footer, wa-float).
- GA4 (G-DLLXR3FH2R) e GTM (GTM-TXSF2K6K) já são globais — manter.
- JSON-LD: BlogPosting + BreadcrumbList + FAQPage (perguntas em PT e EN).
- Todo link de afiliado com `rel="sponsored nofollow noopener" target="_blank"`.
- Formato que a IA cita: resposta-primeiro, H2 em pergunta, dado com fonte, tabela quando fizer sentido.
- Atualizar `thomas-macedo/artigos/index.html` (novo card) e `thomas-macedo/sitemap.xml`.
- Slug em inglês curto (ex.: `tiktok-shop-brasil-como-vender.html`). Não repetir tema já publicado.
- Commit: `Machado: artigo diário — <slug>` e push na branch de trabalho.

## Autoria
Thomas Macedo — referência em TikTok Shop e TikTok Ads (Gene Company / LINCE Performance).
