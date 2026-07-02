# CRIA·OS — O Sistema Operacional de Criativos & UGC para E-commerce

> **A maior dor de quem escala e-commerce com tráfego pago não é a campanha — é o criativo.**
> Encontrar creator, mandar brief, cobrar entrega, aprovar vídeo, subir o anúncio, saber qual escalar e qual matar, renovar direito de uso e pagar em dia. Hoje isso vive espalhado em WhatsApp + planilha + gerenciador de anúncios. O CRIA·OS coloca tudo em um só lugar.

## O que ele faz

| Módulo | Dor que resolve |
|---|---|
| **Dashboard (Central de Comando)** | "O que eu faço agora?" — alertas automáticos: o que escalar, o que pausar, quem cobrar, o que renovar |
| **CRM de Creators** | Kanban da prospecção ao creator ativo, com preço, nicho, avaliação, WhatsApp em 1 clique e ROAS por creator |
| **Campanhas** | Orçamento vs investido vs receita por produto/oferta, em tempo real |
| **Gerador de Briefings** | Brief profissional em 2 minutos: escolha o angle, o sistema monta o roteiro (hook → estrutura → CTA → direitos de uso) e gera o texto pronto pra colar no WhatsApp |
| **Pipeline de Produção** | Kanban do brief ao "no ar", com prazo, atraso automático e feedback de aprovação por versão |
| **Inteligência de Criativos** | Cole as métricas do gerenciador → score 0-100 + veredito automático: 🏆 Escalar · 🔁 Iterar · ⚠️ Fadiga · ❌ Pausar |
| **Insights por Angle** | "Antes & Depois tem ROAS 3.2x vs 0.9x de Trend — peça mais 3 variações" — leituras automáticas por angle, creator e plataforma |
| **Direitos & Pagamentos** | Alerta de direito de uso vencendo (risco jurídico) e pagamentos a creators (creator sem receber = creator que some) |
| **Biblioteca de Hooks** | 27+ hooks validados em PT-BR, CTAs e 12 angles com estrutura de roteiro — munição infinita pra briefs |

## Rodando localmente

```bash
npm install
npm run dev
```

O app abre com **dados de demonstração** para você sentir o produto na primeira tela.
Em **Configurações → Zerar tudo** você começa do zero com a sua operação.

## Deploy na Vercel (2 minutos)

1. Acesse [vercel.com/new](https://vercel.com/new) e importe este repositório
2. Em **Root Directory**, selecione `cria-os`
3. A Vercel detecta Vite automaticamente → **Deploy**

## Dados & privacidade

Os dados ficam no `localStorage` do navegador — zero backend, zero custo de servidor, funciona offline.
Backup/restauração via export/import de JSON em **Configurações**.

## Como monetizar (sugestão de go-to-market)

- **Preço de tabela:** R$ 97–197/mês por marca (compare: 1 criativo ruim queima mais que isso em 1 dia de tráfego).
- **Público:** marcas próprias e e-commerces que investem R$ 3k+/mês em tráfego e usam UGC/influencers.
- **Gancho de venda:** "Quanto você queimou no último criativo que deveria ter pausado 2 semanas antes?"
- **Onboarding:** dados demo já contam a história do produto sozinhos na primeira sessão.

## Stack

Vite + React 18 + lucide-react. Sem backend, sem banco, sem variável de ambiente.
