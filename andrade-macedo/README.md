# Andrade Macedo — Propostas Técnico-Comerciais

Sistema web para criar, salvar e exportar (PDF / PNG) as propostas técnico-comerciais da
**Andrade Macedo Serviços de Engenharia**, seguindo a identidade visual da marca.

## Funcionalidades

- Lista de propostas com busca, filtro por status (rascunho, enviada, aprovada, recusada), duplicar e **nova revisão** (Rev. 01, 02…)
- Numeração automática `AM-PC-001/2026`, reiniciando a cada ano
- Editor com pré-visualização ao vivo do documento A4 (capa + seções 1 a 11)
- Paginação automática: títulos nunca ficam sozinhos no fim da página; rodapé padrão e “página X / Y” em todas as páginas
- Valor total por extenso automático e conferência da soma das parcelas
- Listas editáveis (exclusões, premissas, responsabilidades) com botão “Restaurar padrão”
- Encargos opcionais (multa, juros, suspensão, multa rescisória) inseridos no item 10 quando preenchidos
- Exportação: **PDF A4**, **PNG por página (.zip)** ou **PNG único**
- Dados da empresa (CNPJ, endereço, PIX…) em *Configurações*
- Salvamento automático no navegador + backup/importação em `.json`

> Os dados ficam no `localStorage` do navegador usado. Para usar em outro computador/celular, exporte o backup e importe no outro aparelho.

## Desenvolvimento

```bash
cd andrade-macedo
npm install
npm run dev
```

## Deploy no Vercel

1. Em [vercel.com/new](https://vercel.com/new), importe o repositório `agencia-os`.
2. Em **Root Directory**, selecione `andrade-macedo`.
3. Framework: **Vite** (detectado automaticamente) → **Deploy**.
