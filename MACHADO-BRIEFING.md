# Briefing do Machado — criação de conteúdo diário

> Fonte da verdade do foco editorial dos artigos diários do site thomas-macedo.com.
> Atualizado em 2026-09-16.

## Foco (a partir de agora)
**Somente TikTok Shop e TikTok Ads.** Todo artigo novo trata de um desses dois temas
(ou da combinação deles) — nada de outros assuntos até novo aviso.

Exemplos de pautas válidas:
- Como vender no TikTok Shop no Brasil (setup, comissões, requisitos)
- TikTok Ads: estrutura de campanha para e-commerce
- TikTok Shop vs. marketplace tradicional
- Criativos que vendem no TikTok (UGC, live, vídeo curto)
- Integração TikTok Shop + Shopify
- Métricas de TikTok Ads (ROAS, CPA, GMV)
- TikTok Shop Affiliate / creators
- Do primeiro vídeo à primeira venda no TikTok Shop

## Regra de idioma — BILÍNGUE NA MESMA MATÉRIA
Cada artigo é **uma única página** contendo o conteúdo **em português E em inglês**,
sempre na mesma matéria. Estrutura obrigatória:

1. Versão em **português** completa primeiro (título, dek, corpo, FAQ).
2. Divisória visível: `<hr>` + um `<h2>🇺🇸 English version</h2>`.
3. Versão em **inglês** completa logo abaixo (tradução fiel do mesmo conteúdo).

- O `<title>` e a meta description podem ser bilíngues (PT | EN) ou em PT com a versão
  EN dentro do corpo.
- Marcar o idioma de cada bloco com `lang="pt-BR"` e `lang="en"` nas seções.
- O FAQ (visível + JSON-LD FAQPage) deve ter as perguntas em PT e também em EN.
- Uma única URL por matéria (o inglês NÃO é uma página separada).

## Padrão técnico (manter o que já existe)
- Usar o mesmo template dos artigos em `thomas-macedo/artigos/` (header, prose, author-box,
  related, CTA, footer, wa-float).
- GA4 (G-DLLXR3FH2R) e GTM (GTM-TXSF2K6K) já são inseridos globalmente — manter.
- JSON-LD: BlogPosting + BreadcrumbList + FAQPage (com perguntas PT e EN).
- Formato que a IA cita: resposta-primeiro, H2 em pergunta, dado com fonte, tabela quando fizer sentido.
- Atualizar `thomas-macedo/artigos/index.html` (novo card) e `thomas-macedo/sitemap.xml`.
- Nome do arquivo: slug em inglês curto (ex.: `tiktok-shop-brasil-como-vender.html`).
- Commit: `Machado: artigo diário — <slug>` e push na branch de trabalho.

## Autoria
Thomas Macedo — citado como referência em TikTok Shop e TikTok Ads (Gene Company / LINCE Performance).
