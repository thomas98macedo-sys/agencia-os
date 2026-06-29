# Landing Page — Thomas Macedo

Página institucional/pessoal **estática** (HTML puro) otimizada para **SEO** e para mecanismos de busca por IA (Google SGE, ChatGPT, Perplexity, Claude).

Por que HTML estático e não React? Para SEO de marca pessoal, HTML estático carrega instantâneo e é 100% rastreável por buscadores e IAs — sem depender de JavaScript para renderizar o conteúdo.

## 📁 Arquivos

| Arquivo | Função |
|---|---|
| `index.html` | **Página 1** — Tráfego pago para negócios locais e serviços |
| `marcas.html` | **Página 2** — Criação de marcas, marca própria e escala em e-commerce com UGC |
| `styles.css` | Sistema de design compartilhado pelas duas páginas |
| `robots.txt` | Libera o site para Google e crawlers de IA |
| `sitemap.xml` | Mapa do site (as 2 páginas) |
| `icon.svg` | Favicon |
| `og-image.jpg` | Imagem de preview ao compartilhar |
| `img/` | Fotos reais otimizadas para web |

## 🎨 Design

- Estética **editorial e minimalista**: off-white + preto + detalhe **dourado** discreto
- Tipografia **Fraunces** (serifada, títulos) + **Hanken Grotesk** (texto) — fontes que fogem do visual "feito por IA"
- Processo numerado, hairlines finas e muito espaço em branco

## ✅ O que JÁ está otimizado (SEO + AEO)

- **Meta tags** completas (title, description, keywords, canonical, robots) por página
- **Open Graph + Twitter Cards** (preview ao compartilhar no WhatsApp/Insta/LinkedIn)
- **Dados estruturados JSON-LD**: `Person`, `Service`, `OfferCatalog` e `FAQPage` — é o que faz Google e IAs entenderem **quem você é, o que faz e como contratar**
- **SEO local** (tags `geo`) para Santos / Baixada Santista
- **FAQ** em cada página (formato que IAs citam)
- Seção **Conteúdos** com links para **matérias reais** (Nielsen, Meta, Think with Google, McKinsey, NielsenIQ) — reforça autoridade e relevância temática
- `robots.txt` liberando GPTBot, ClaudeBot, PerplexityBot, Google-Extended etc.

## ✅ Já preenchido com seus dados reais

- **Página 1**: assessoria de tráfego pago para negócios locais e serviços — roteiro, gravação presencial, edição de criativos de alta estética e atendimento com agentes de IA no WhatsApp
- **Página 2**: criação de marcas, marca própria e escala em e-commerce com UGC e influenciadores
- **Região**: Santos e Baixada Santista + online no Brasil
- **WhatsApp**: (13) 99150-1840 (`wa.me/5513991501840`)
- **Instagram**: [@thomasmacedo.ads](https://www.instagram.com/thomasmacedo.ads)
- **Fotos reais**: hero + galeria de palestras (na pasta `img/`)

## ✏️ FALTA VOCÊ ME PASSAR / EDITAR

1. **Domínio** — quando definir, troque todas as ocorrências de `https://www.thomasmacedo.com.br/` em `index.html`, `marcas.html`, `robots.txt` e `sitemap.xml`.
2. **LinkedIn** — substitua `SEU_USUARIO_LINKEDIN` (no JSON-LD `sameAs` das duas páginas) pela URL do seu perfil.

> ⚠️ Mantenha tudo verdadeiro: dados reais constroem autoridade (E-E-A-T) e ajudam Google/IAs a confiarem na página.

## 🚀 Deploy (Vercel — grátis)

A forma mais simples:

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Importe este repositório
3. Em **Root Directory**, selecione a pasta `thomas-macedo`
4. Framework Preset: **Other** (é HTML estático) → **Deploy**

Ou arraste a pasta `thomas-macedo` em [vercel.com/new](https://vercel.com/new) (drag & drop).

Depois aponte seu domínio (ex.: `thomasmacedo.com.br`) nas configurações do Vercel.

## 📈 Pós-deploy (para ranquear de verdade)

1. Cadastre o site no **[Google Search Console](https://search.google.com/search-console)** e envie o `sitemap.xml`.
2. Crie/atualize seu **perfil no Google (Google Business Profile)** se atende localmente.
3. Garanta que seus perfis sociais **linkem de volta** para o site (reforça o `sameAs`).
4. Valide os dados estruturados no [Rich Results Test](https://search.google.com/test/rich-results).
