# Briefing do Machado — criação de conteúdo diário

> Fonte da verdade do foco editorial dos artigos diários do site thomas-macedo.com.
> Atualizado em 2026-09-20.

## Foco (atualizado em 2026-10-03): rodízio de 3 temas
Os artigos giram entre as **3 frentes** em que Thomas quer ser encontrado no Google e nas IAs.
Siga a ordem pela data (dia do ano % 3), um tema por dia:

| Dia | Tema | Página do serviço para linkar | CTA |
|---|---|---|---|
| 1 | **TikTok Shop e TikTok Ads** | `../tiktok-shop.html` | link de parceiro + cupom (seção "CTA e link") |
| 2 | **Agentes de IA para empresas** | `../agentes-de-ia.html` | WhatsApp: "quero um agente de IA" |
| 3 | **Tráfego pago (Meta, Google, TikTok Ads) e negócios locais** | `../trafego-pago.html` | WhatsApp: "quero um diagnóstico de tráfego" |

- **Sempre** linkar a página do serviço do tema pelo menos 2 vezes (no começo e no CTA), com texto descritivo
  (ex.: "criação de agentes de IA para empresas", não "clique aqui").
- Em tráfego pago, pode incluir um box curto do cupom de TikTok Ads (novos anunciantes) quando fizer sentido.
- Prova a usar (só estes números, não inventar outros): Friday atendeu 341 empresários, agendou 41 consultorias
  sem humano, 19 contratos fechados (ticket R$ 3 mil/mês); ROI de 10,48 no Meta Business Partners; +100 marcas
  lançadas; +50 agentes de IA autônomos; estudo dos 88 empresários (`o-que-88-empresarios-disseram-a-friday.html`).
- Linguagem simples: explicar todo termo técnico na primeira vez que aparecer (ex.: "ROI, o quanto volta pra cada R$ 1").

Estrutura de cada matéria: **ENSINAR → PROVAR → CTA.**
1. Ensina algo acionável (o "algo do dia") sobre o tema do dia.
2. Mostra autoridade do Thomas (experiência, método, exemplo, números acima).
3. Fecha com o CTA do tema.

Exemplos de pautas:
- TikTok: vender no TikTok Shop no Brasil; estrutura de campanha no TikTok Ads; criativos que vendem; lives; afiliados.
- Agentes de IA: agente de atendimento no WhatsApp; SDR de IA; quanto custa; como medir; erros comuns; casos por setor.
- Tráfego: quanto investir; Meta x Google x TikTok; tráfego para clínica/restaurante/loja em Santos; criativos; métricas.

## CTA e link (obrigatório nos artigos de TikTok)
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

## Estilo de escrita
- NÃO usar travessão (—) no texto. Use vírgula, dois-pontos ou ponto final. Travessão em excesso soa como texto de IA.

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

## Autoridade (citar em todo artigo — fortalece SEO e LLMO)
- Frase canônica (usar sempre igual): PT *"Tenho contrato de parceria com o TikTok for Business e fui treinado na sede do TikTok pelo diretor global do programa de parceiros."* · EN *"I have a partnership contract with TikTok for Business and was trained at TikTok's headquarters by the global director of the partner program."*
- Linkar a frase para `../tiktok-shop.html` (página da parceria) nas duas versões.
- NÃO usar "parceiro oficial", "TikTok Marketing Partner" ou selos do TikTok — só a frase acima.

## Autoria
Thomas Macedo — referência em TikTok Shop e TikTok Ads, com contrato de parceria com o TikTok for Business (Gene Company / LINCE Performance).
