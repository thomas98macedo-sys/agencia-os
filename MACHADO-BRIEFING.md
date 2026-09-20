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
- Incentivo (usar SEM prometer valor fixo como garantia): novos anunciantes podem receber
  **crédito de boas-vindas do TikTok que pode dobrar o primeiro investimento em anúncios,
  conforme a oferta vigente na página.** Enquadrar sempre como oferta DO TIKTOK e condicional
  ("pode", "conforme a oferta atual"), nunca como promessa garantida do Thomas.
- Texto-modelo do CTA (PT): *"Crie sua loja no TikTok Shop e comece a anunciar por aqui —
  novos anunciantes podem receber crédito do TikTok que pode dobrar o primeiro investimento
  em Ads (conforme a oferta vigente): [Começar agora](https://getstartedtiktok.partnerlinks.io/6x6ko7wz5c2m)."*
- Texto-modelo do CTA (EN): *"Start your TikTok Shop and launch your first ads here — new
  advertisers may get TikTok ad credit that can double your first ad investment (subject to
  the current offer): [Get started](https://getstartedtiktok.partnerlinks.io/6x6ko7wz5c2m)."*

## Divulgação (OBRIGATÓRIA — protege a conta e a autoridade)
- Incluir uma linha discreta de divulgação junto ao CTA, em PT e EN. Ex.:
  PT: *"Conteúdo com link de parceiro."* · EN: *"Contains a partner link."*
- Motivo: os termos do programa do TikTok exigem divulgação; CONAR/CDC (BR) e FTC (EUA)
  também. Sem isso há risco de banimento da conta de afiliado e de publicidade enganosa.
  A divulgação é curta e não atrapalha a conversão.
- Nunca afirmar valores/promoções que não sejam a oferta real e vigente do TikTok.

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
