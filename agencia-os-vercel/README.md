# AgênciaOS — Sistema Operacional para Agências de Marketing

Plataforma completa de gestão operacional com Kanban, SLA 48h, checklists, Google Calendar, Lince Dashboard e autenticação por email.

## Deploy no Vercel (3 passos)

### Opção 1 — Via GitHub (recomendado)

1. Crie um repositório no GitHub e suba estes arquivos:
```bash
git init
git add .
git commit -m "AgênciaOS v1.0"
git branch -M main
git remote add origin https://github.com/SEU_USER/agencia-os.git
git push -u origin main
```

2. Acesse [vercel.com/new](https://vercel.com/new)
3. Importe o repositório → Vercel detecta Vite automaticamente → **Deploy**

### Opção 2 — Via Vercel CLI

```bash
npm install
npx vercel --prod
```

### Opção 3 — Drag & Drop

1. Rode `npm install && npm run build` localmente
2. Arraste a pasta `dist/` para [vercel.com/new](https://vercel.com/new)

## Configuração do Google Auth (opcional)

Para ativar login real com Google:

1. Acesse [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
2. Crie um projeto → OAuth consent screen → External
3. Crie credencial OAuth 2.0 → Web application
4. Adicione seu domínio Vercel como Authorized JavaScript origin
5. No arquivo `src/App.jsx`, substitua `YOUR_GOOGLE_CLIENT_ID` pelo Client ID gerado

## Stack

- React 18 + Vite
- Lucide React (ícones)
- LocalStorage (persistência)
- Google Identity Services (auth)
