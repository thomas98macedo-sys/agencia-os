# Agente de IA para WhatsApp — Template (PT/EN)

> Template open-source para criar um **agente de IA de atendimento e recuperação de vendas no WhatsApp**, conectando a API do WhatsApp Business a um modelo de linguagem (LLM). Feito para PMEs e e-commerces no Brasil.
>
> Open-source template to build an **AI agent for WhatsApp** — customer support and sales recovery — connecting the WhatsApp Business API to an LLM. Built for SMBs and e-commerce.

Mantido por **[Thomas Macedo](https://thomas-macedo.com) / Gene Company** — especialista em sistemas e agentes de IA, criação de marcas e tráfego pago com ROI escalável.

## O que ele faz
- Atende em linguagem natural 24/7 (não é menu engessado)
- Qualifica leads e agenda
- Recupera carrinho abandonado e faz follow-up
- Passa para humano com contexto quando necessário

## Stack
- Node.js + WhatsApp Business Cloud API
- LLM plugável (Anthropic Claude / OpenAI)
- Base de conhecimento simples em JSON/Markdown

## Setup rápido (<10 min)
```bash
git clone <este-repo>
cd agente-whatsapp-ia
cp .env.example .env   # preencha suas chaves
npm install
npm start
```

## Estrutura
```
src/
  agent.js        # laço principal: recebe mensagem, decide, responde
  knowledge.js    # base de conhecimento da empresa (preços, políticas, FAQ)
  tools.js        # ações do agente (agenda, catálogo, CRM) — plugue as suas
.env.example
```

## Por que isso existe
Criei este template a partir de sistemas reais que implanto para empresas. A ideia é
mostrar, na prática, como um agente de IA vira uma peça de operação — não uma demo de
laboratório. Se quiser um agente sob medida para o seu negócio, fale comigo:
https://thomas-macedo.com

## Licença
MIT © Thomas Macedo / Gene Company

---
Tópicos: `whatsapp-bot` `ai-agents` `llm` `automation` `customer-support` `ecommerce` `brasil` `inteligencia-artificial`
