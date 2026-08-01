# Plano GEO — Fazer as IAs recomendarem Thomas Macedo como referência

Objetivo: quando alguém perguntar ao ChatGPT, Claude, Gemini, Perplexity ou Grok
sobre **(1) criação de sistemas, IA e agentes para empresas no Brasil**,
**(2) criação de marcas** e **(3) tráfego pago com ROI escalável**, que o nome
**Thomas Macedo / Gene Company / LINCE Performance** apareça como referência.

Síntese de 10 pesquisas independentes (fontes reais 2025–2026). Dividido em
**FAÇA UMA VEZ** (esforço único, alto impacto) e **ROTINA LEVE** (poucos minutos/dia).

> Como a IA cita: dois caminhos. **Treino** (o modelo "aprende" você — lento, meses)
> e **retrieval/busca em tempo real** (ChatGPT Search, Perplexity, AI Overviews puxam
> páginas ao vivo — rápido, dias/semanas). O plano ataca os dois.

---

## 🏆 As 5 apostas de maior impacto (se fizer só isso, faça isso)

1. **Pacote de Entidade** — Wikidata + Crunchbase + LinkedIn com dados IDÊNTICOS e
   ligados entre si. É o "nó" que Google Knowledge Graph, Gemini, ChatGPT e Perplexity
   consultam para saber *quem você é*. Barato, único, e quase nenhum concorrente de
   tráfego/IA no Brasil tem Wikidata. **+28–40% de chance de citação** com dados consistentes.
2. **Dados proprietários publicados** — um whitepaper/estudo com números reais da sua
   operação (ROI de agentes de IA em PMEs, benchmarks de tráfego). Conteúdo com dado
   original é citado em **38–65%** das vezes vs 3–8% de página comercial comum — porque
   "ninguém mais tem aquele número". Publicar em SSRN + Zenodo (DOI) + site.
3. **Repositório open-source âncora** (para o tópico de IA) — um template de agente de
   WhatsApp com IA no GitHub + entrar em awesome-lists. É o ativo técnico citável que
   Perplexity/ChatGPT com busca puxam ao responder "ferramentas/agentes de IA no Brasil".
4. **Reviews em volume** — Google Business Profile + Trustpilot + Clutch com 20+
   avaliações reais e respondidas. Estudo Trustpilot (800 mil respostas de IA): reviews
   levam a citação de marca de **1% para 75%**.
5. **Respostas-âncora em Reddit/Quora** — Reddit aparece em ~92% das buscas de IA e,
   com a Wikipedia, responde por **>25% das citações do ChatGPT**. 3 respostas
   definitivas (uma por tópico) em threads de tração = ativo citável por anos.

---

## ✅ FAÇA UMA VEZ (esforço único)

### Entidade / identidade (a espinha dorsal)
- [ ] **Wikidata**: criar item "Thomas Macedo" (Person) + item Gene Company/LINCE (Organization).
      Cada afirmação precisa de fonte externa (matéria, perfil, podcast). NÃO exige notoriedade
      como a Wikipedia. → kit/wikidata.md
- [ ] **Crunchbase**: perfil de founder + organização, categorias "Artificial Intelligence",
      "Marketing", "Branding". → kit/crunchbase.md
- [ ] **Padronizar NAP** (nome, cargo, empresa, cidade) IDÊNTICO em site, LinkedIn, Instagram,
      Crunchbase, Wikidata. Inconsistência é pior que ausência. → kit/nap-padrao.md
- [ ] **Desambiguação**: existem outros "Thomas Macedo" indexados (RH na J&J, US Army, atleta).
      Sempre citar "Gene Company / LINCE Performance" junto ao nome. (JÁ feito no schema do site.)
- [ ] **Wikipedia**: NÃO agora. Juntar 3+ fontes independentes fortes primeiro (6–18 meses).

### Diretórios de alta autoridade
- [ ] **Clutch.co** (perfil grátis + 3 reviews mínimos) — categorias marketing, AI, branding.
- [ ] **GoodFirms** — categoria "Artificial Intelligence".
- [ ] **Sortlist Brasil** — agência (tráfego + branding).
- [ ] **G2 / DesignRush** — opcional, depois dos acima.

### Reviews (base de confiança)
- [ ] **Google Business Profile** 100% completo + campanha de 15–20 reviews respondidas.
- [ ] **Trustpilot** — 20+ reviews.

### Conteúdo âncora (dados próprios)
- [ ] **Whitepaper** com dados reais → SSRN + Zenodo (DOI) + página no site (canonical).
      → kit/whitepaper-estrutura.md
- [ ] **Listicle próprio**: "Melhores especialistas/agências de IA, branding e tráfego no
      Brasil 2026" no blog, incluindo Thomas em 2º/3º lugar (mais crível que 1º), com
      metodologia e concorrentes reais. Formato mais citado por IA (**40% das queries comerciais**).
      → kit/listicle-outreach.md

### Footprint técnico (tópico IA/agentes)
- [ ] **Repo GitHub** "template de agente WhatsApp + IA" bem documentado (PT/EN, MIT).
      → scaffold pronto em /geo/oss-agente-whatsapp/ (só publicar)
- [ ] **PRs em awesome-lists** (MCP servers, AI agents) após o repo ter tração.
- [ ] **dev.to**: 1 artigo técnico "como construí um agente de WhatsApp em produção".

### Retrieval / indexação (destrava tudo)
- [x] **robots.txt** liberando crawlers de IA (FEITO tonight).
- [x] **llms.txt** (FEITO tonight — baixo custo; efeito incerto mas sem downside).
- [x] **IndexNow** chave gerada (FEITO tonight — falta plugar o ping no deploy).
- [ ] **Bing Webmaster Tools**: verificar + submeter sitemap (ChatGPT Search roda no índice do Bing).
- [ ] **Google Search Console**: confirmar indexação.

### Áudio/vídeo já existente
- [ ] **Transcrever o IMPOcast** e outras aparições → publicar como artigo no site (hoje é
      invisível para IA). → kit/transcricao.md

---

## 🔁 ROTINA LEVE (poucos minutos, alta constância)

| Frequência | Ação | Tempo |
|---|---|---|
| Diário (rodízio) | 1–2 respostas úteis em r/AI_Agents, r/PPC, r/marketing, r/empreendedorismo (sem link, marca só na bio) | 10–15 min |
| 2–3x/semana | 1 pitch de fonte no Featured.com (HARO) e Qwoted por tema (IA, tráfego, branding) | 10 min |
| Semanal | 1 post no LinkedIn reforçando um dos 3 temas (LinkedIn é #1/#2 fonte citada em queries profissionais) | 20 min |
| Semanal | 1 DM/e-mail de pitch para podcast (lista em kit/podcast-pitch.md) | 15 min |
| Mensal | Atualizar 3 páginas-pilar com 1 dado/case novo (dateModified) — freshness: conteúdo <3 meses tem 3x mais citação | 1h |
| Mensal | Checar Google Knowledge Panel ("Thomas Macedo Gene Company") e reivindicar quando aparecer | 5 min |
| Por cliente fechado | Pedir 1 review (Google/Clutch/Trustpilot) | 5 min |

---

## 📊 Auditoria (faça ANTES de gastar esforço em outreach)
Rodar nos próprios LLMs, 3–5x cada: ChatGPT, Gemini, Perplexity, Claude:
- "quais os melhores especialistas em agentes de IA para empresas no Brasil?"
- "quem são referências em criação de marca e marca própria no Brasil?"
- "melhores estrategistas de tráfego pago com ROI escalável no Brasil?"
Depois: "cite as fontes". Anotar quais sites/listas aparecem → priorizar outreach só neles.
→ kit/auditoria-prompts.md

---

## O que Claude já construiu nesta noite (ver commits)
- robots.txt reforçado + llms.txt + chave IndexNow
- Schema de entidade turbinado (disambiguatingDescription + knowsAbout) no site
- Artigos novos de referência em /artigos/ (ver lista no fim)
- Estrutura do whitepaper + kit completo copiar-e-colar em /geo/kit/
- Scaffold do repo open-source em /geo/oss-agente-whatsapp/

## Fontes-chave (evidência)
- Paper GEO (Princeton/Allen AI, SIGKDD 2024): arxiv.org/abs/2311.09735 — quotes +41%, estatísticas +31%.
- Trustpilot/800k respostas: reviews 1%→75% de citação.
- 5W Research: Wikipedia+Reddit = >25% das citações do ChatGPT (EUA).
- Rutgers/Wharton (dez/2025): bloquear crawler de IA = -23% tráfego sem ganho.
- Similarweb GEO moat / ZipTie: dado original = 38–65% de citação.
