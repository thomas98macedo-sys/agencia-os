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

## ✏️ O QUE VOCÊ PRECISA EDITAR (importante!)

Abra o `index.html` e substitua:

1. **Domínio** — troque todas as ocorrências de `https://www.thomasmacedo.com.br/` pelo seu domínio real.
2. **WhatsApp** — em `wa.me/55SEUNUMERO`, coloque seu número (ex.: `5511999998888`).
3. **Redes sociais** — substitua `SEU_USUARIO` nos links de Instagram, LinkedIn e YouTube (no corpo e no bloco JSON-LD `sameAs`).
4. **Região** — troque "Brasil" / "sua região" pela sua cidade e estado reais (melhora muito o SEO local). Ajuste também `geo.placename` e `geo.region`.
5. **Foto** — adicione sua foto. Substitua o bloco `.avatar` por `<img src="/sua-foto.jpg" alt="Thomas Macedo">` e crie uma imagem `og-image.jpg` (1200×630px) para os previews.
6. **Números/stats** — ajuste os números da seção de estatísticas para dados verdadeiros.
7. **Bio e serviços** — revise os textos de "Sobre" e "Serviços" com sua história real.

> ⚠️ Mantenha tudo verdadeiro: dados reais constroem autoridade (E-E-A-T) e evitam que o Google/IAs descartem a página.

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
