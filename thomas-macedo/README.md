# Landing Page — Thomas Macedo

Página institucional/pessoal **estática** (HTML puro) otimizada para **SEO** e para mecanismos de busca por IA (Google SGE, ChatGPT, Perplexity, Claude).

Por que HTML estático e não React? Para SEO de marca pessoal, HTML estático carrega instantâneo e é 100% rastreável por buscadores e IAs — sem depender de JavaScript para renderizar o conteúdo.

## 📁 Arquivos

| Arquivo | Função |
|---|---|
| `index.html` | A página completa (conteúdo + estilo + dados estruturados) |
| `robots.txt` | Libera o site para Google e crawlers de IA |
| `sitemap.xml` | Mapa do site para indexação |
| `icon.svg` | Favicon |

## ✅ O que JÁ está otimizado

- **Meta tags** completas (title, description, keywords, canonical, robots)
- **Open Graph + Twitter Cards** (preview bonito ao compartilhar no WhatsApp/Insta/LinkedIn)
- **Dados estruturados JSON-LD**: `Person`, `ProfessionalService` e `FAQPage` — é isso que faz o Google e as IAs entenderem **quem você é, o que faz e como te contratar**
- **SEO local** (tags `geo`) e seção de região
- **FAQ** (formato que IAs adoram citar)
- `robots.txt` liberando GPTBot, ClaudeBot, PerplexityBot, Google-Extended etc.

## ✅ Já preenchido com seus dados reais

- **Posicionamento**: tráfego pago, e-commerce, criação de marcas com UGC/influencers e IA (recuperação de vendas, atendimento no WhatsApp, automação de processos)
- **Região**: Santos e Baixada Santista (São Vicente, Guarujá, Praia Grande, Cubatão...) + online no Brasil
- **WhatsApp**: (13) 99150-1840 (`wa.me/5513991501840`)
- **Instagram**: [@thomasmacedo.ads](https://www.instagram.com/thomasmacedo.ads)
- **Fotos reais**: hero + galeria de palestras (otimizadas para web na pasta `img/`)

## ✏️ FALTA VOCÊ ME PASSAR / EDITAR

1. **Domínio** — quando definir, troque todas as ocorrências de `https://www.thomasmacedo.com.br/` no `index.html`, `robots.txt` e `sitemap.xml`.
2. **LinkedIn** — substitua `SEU_USUARIO_LINKEDIN` (no corpo e no JSON-LD `sameAs`) pela URL do seu perfil.
3. (Opcional) **Stats** — os blocos de números no hero estão genéricos; se quiser, troque por métricas reais (ex.: "+R$ X em vendas geradas").

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
