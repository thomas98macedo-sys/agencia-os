# Brief: versão China Link do app da Canton Fair (mentoria)

Pedido de 03/10/2026: adaptar o app da Canton Fair feito para a Logline para a China Link, com a identidade visual da China Link e a foto do Thomas como mentor, para uso com os mentorados.

## Situação

- O app não está no GitHub (nenhum dos 12 repositórios), nem no Google Drive, Gmail ou Gamma. Ele vive no Mac mini (ou MacBook Air), provavelmente na árvore do Eve (`~/eve/...`) ou como projeto Vercel feito via CLI, como o `logline-plano`.
- A foto enviada no chat (Thomas no palco, de jaqueta clara, microfone na mão) não fica salva como arquivo nesta sessão em nuvem. Salvar no Mac como `assets/mentor-thomas.jpg` antes de começar.
- Sites `chinalinktrading.com` e `*.vercel.app` estão bloqueados pela rede desta sessão; a identidade da China Link precisa vir dos arquivos locais ou dos materiais da China Link já recebidos.

## Como fazer (sessão local no Mac mini)

1. Localizar o app: `find ~ -maxdepth 4 -iname '*canton*' -not -path '*/node_modules/*'` e `vercel ls` (projetos com "canton" ou "logline" no nome).
2. Duplicar o projeto para uma pasta nova (`canton-fair-chinalink`); nunca sobrescrever a versão da Logline.
3. Identidade visual: trocar logo, paleta, tipografia e favicon da Logline pelos da China Link Trading. Fonte dos assets: materiais da China Link já recebidos e o logo "Logo-Canton-Fair-1.png" usado no deck Gamma "Funil de Vendas Online com IA - Canton Fair".
4. Textos: substituir "Logline" por "China Link"; remover promessas de logística/frete da Logline (a China Link não é a transportadora); CTA final vira "Falar com o mentor" (WhatsApp 13 99150-1840).
5. Bloco "Mentor" na tela inicial (ou no menu): foto `mentor-thomas.jpg`, nome, cargo e bio abaixo, com botão de WhatsApp.
6. Deploy em projeto Vercel novo (`canton-fair-chinalink`) e teste no celular: a maior parte dos mentorados vai abrir pelo WhatsApp.

## Bloco do mentor (sugestão, ajustar)

- Nome: Thomas Macedo
- Cargo: Mentor Canton Fair · parceiro China Link Trading
- Bio: "Fundador da Gene Company e do ARC Studio, parceiro da China Link Trading desde 2025 em tráfego, palestras e nos eventos China Link na Estrada. Esteve na 139ª Canton Fair (abril e maio de 2026) negociando direto com fábricas. Mentor de empresários que querem importar com marca própria."
- CTA: "Falar com o Thomas no WhatsApp"

## Checklist de entrega

- [ ] Pasta nova com o app duplicado
- [ ] Logo, cores e fontes da China Link aplicados
- [ ] Foto do mentor salva e otimizada (máx. 400 KB, 1200 px de largura)
- [ ] Textos revisados sem "Logline"
- [ ] Deploy novo no Vercel e link testado no celular
