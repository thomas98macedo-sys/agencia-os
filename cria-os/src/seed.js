// ============================================================
// CRIA·OS — dados demo (datas relativas a hoje, sempre atuais)
// ============================================================

const d = (offsetDays) => {
  const dt = new Date()
  dt.setDate(dt.getDate() + offsetDays)
  return dt.toISOString().slice(0, 10)
}

export function seedData() {
  const creators = [
    { id: 'cre_demo1', name: 'Marina Lopes', handle: '@marinalopes.of', platforms: ['instagram', 'tiktok'], niche: 'Skincare & Beleza', followers: 84000, whatsapp: '11988887777', email: 'marina@exemplo.com', city: 'São Paulo/SP', price: 450, status: 'active', rating: 5, notes: 'Entrega rápido, ótima iluminação. Melhor hook rate do squad.', createdAt: d(-90) },
    { id: 'cre_demo2', name: 'João Pedro Reis', handle: '@jpreis', platforms: ['tiktok'], niche: 'Lifestyle Masculino', followers: 152000, whatsapp: '21977776666', email: 'jp@exemplo.com', city: 'Rio de Janeiro/RJ', price: 700, status: 'active', rating: 4, notes: 'Bom com trends. Precisa de brief bem detalhado.', createdAt: d(-75) },
    { id: 'cre_demo3', name: 'Ana Beatriz', handle: '@anabia.rotina', platforms: ['instagram'], niche: 'Maternidade', followers: 43000, whatsapp: '31966665555', email: '', city: 'Belo Horizonte/MG', price: 300, status: 'hired', rating: 4, notes: 'Fechou pacote de 4 vídeos. Primeiro brief enviado.', createdAt: d(-20) },
    { id: 'cre_demo4', name: 'Lucas Ferraz', handle: '@lucasferraz.fit', platforms: ['tiktok', 'youtube'], niche: 'Fitness', followers: 210000, whatsapp: '', email: 'contato@lucasferraz.com', city: 'Curitiba/PR', price: 1200, status: 'negotiating', rating: 0, notes: 'Pediu 1.5k, oferecemos 1.2k + cupom de afiliado.', createdAt: d(-10) },
    { id: 'cre_demo5', name: 'Carol Mendes', handle: '@carolmendes', platforms: ['instagram', 'tiktok'], niche: 'Casa & Organização', followers: 67000, whatsapp: '41955554444', email: '', city: 'Florianópolis/SC', price: 380, status: 'contacted', rating: 0, notes: 'Respondeu story, aguardando retorno da proposta.', createdAt: d(-6) },
    { id: 'cre_demo6', name: 'Rafa Costa', handle: '@rafacosta.tips', platforms: ['tiktok'], niche: 'Tech & Gadgets', followers: 95000, whatsapp: '', email: 'rafa@exemplo.com', city: 'Recife/PE', price: 500, status: 'prospect', rating: 0, notes: 'Indicação da Marina. Conteúdo com cara de UGC nativo.', createdAt: d(-3) },
  ]

  const campaigns = [
    { id: 'cam_demo1', name: 'Lançamento Sérum Vitamina C', product: 'Sérum Facial Vitamina C 30ml', objective: 'Escalar produto herói com UGC de prova social e antes/depois', budget: 15000, startDate: d(-45), endDate: d(30), status: 'active', notes: 'Oferta: 20% OFF primeiro pedido, cupom por creator.', createdAt: d(-50) },
    { id: 'cam_demo2', name: 'Kit Verão — Frete Grátis', product: 'Kit Protetor + Hidratante Corporal', objective: 'Testar 3 angles novos para achar o próximo criativo campeão', budget: 8000, startDate: d(-15), endDate: d(45), status: 'active', notes: 'Foco TikTok. Meta: CPA abaixo de R$ 55.', createdAt: d(-18) },
  ]

  const briefs = [
    { id: 'bri_demo1', campaignId: 'cam_demo1', creatorId: 'cre_demo1', format: 'reels', duration: 30, angle: 'antes_depois', hook: 'Olha o que 21 dias de vitamina C fizeram com a minha pele…', dos: 'Luz natural, mostrar textura do sérum, close no rosto sem filtro', donts: 'Não prometer cura de melasma, não usar filtro de pele, não falar "o melhor do Brasil"', references: 'https://exemplo.com/ref1', deadline: d(-25), payment: 450, rightsDays: 90, status: 'accepted', createdAt: d(-40) },
    { id: 'bri_demo2', campaignId: 'cam_demo1', creatorId: 'cre_demo2', format: 'tiktok', duration: 30, angle: 'gancho_negativo', hook: 'NÃO compre sérum de vitamina C antes de ver isso', dos: 'Tom de alerta no início, virada rápida pra solução', donts: 'Não citar marcas concorrentes pelo nome', references: '', deadline: d(-18), payment: 700, rightsDays: 90, status: 'accepted', createdAt: d(-30) },
    { id: 'bri_demo3', campaignId: 'cam_demo2', creatorId: 'cre_demo1', format: 'tiktok', duration: 25, angle: 'pov', hook: 'POV: você achou o kit que salva sua pele no verão', dos: 'Cena de praia/piscina, aplicação real, vibe leve', donts: 'Nada de estúdio, tem que parecer conteúdo nativo', references: '', deadline: d(5), payment: 450, rightsDays: 60, status: 'sent', createdAt: d(-4) },
    { id: 'bri_demo4', campaignId: 'cam_demo2', creatorId: 'cre_demo3', format: 'reels', duration: 40, angle: 'tutorial', hook: 'A rotina de 2 minutos que protege a pele das crianças (e a sua)', dos: 'Mostrar rotina com filhos, reforçar praticidade', donts: 'Não aplicar no rosto de bebê em vídeo', references: '', deadline: d(8), payment: 300, rightsDays: 60, status: 'draft', createdAt: d(-2) },
  ]

  const deliverables = [
    { id: 'del_demo1', briefId: 'bri_demo3', campaignId: 'cam_demo2', creatorId: 'cre_demo1', title: 'POV Kit Verão — Marina', format: 'tiktok', stage: 'filming', deadline: d(5), feedback: [], createdAt: d(-4) },
    { id: 'del_demo2', briefId: 'bri_demo4', campaignId: 'cam_demo2', creatorId: 'cre_demo3', title: 'Tutorial rotina família — Ana', format: 'reels', stage: 'brief', deadline: d(8), feedback: [], createdAt: d(-2) },
    { id: 'del_demo3', briefId: null, campaignId: 'cam_demo1', creatorId: 'cre_demo2', title: 'Variação 2 do gancho negativo — JP', format: 'tiktok', stage: 'review', deadline: d(-1), feedback: [{ date: d(-2), text: 'Cortar os 2 primeiros segundos, hook demora a entrar. CTA ficou ótimo.' }], createdAt: d(-9) },
    { id: 'del_demo4', briefId: null, campaignId: 'cam_demo1', creatorId: 'cre_demo1', title: 'Depoimento textura + resultado — Marina', format: 'reels', stage: 'approved', deadline: d(-6), feedback: [], createdAt: d(-14) },
  ]

  const creatives = [
    { id: 'crv_demo1', name: 'Marina — Antes/Depois 21 dias', campaignId: 'cam_demo1', creatorId: 'cre_demo1', platform: 'meta', angle: 'antes_depois', format: 'reels', url: '', startDate: d(-24), active: true, rightsExpiry: d(66), metrics: { spend: 4200, impressions: 610000, clicks: 12800, purchases: 96, revenue: 13440, hookRate: 34, holdRate: 16 }, notes: 'Criativo campeão atual. Escalado em 3 conjuntos.', createdAt: d(-24) },
    { id: 'crv_demo2', name: 'JP — Não compre antes de ver', campaignId: 'cam_demo1', creatorId: 'cre_demo2', platform: 'tiktok', angle: 'gancho_negativo', format: 'tiktok', url: '', startDate: d(-16), active: true, rightsExpiry: d(74), metrics: { spend: 2100, impressions: 380000, clicks: 8900, purchases: 41, revenue: 5330, hookRate: 29, holdRate: 11 }, notes: 'Hook forte, queda no meio. Pedida variação com demo mais cedo.', createdAt: d(-16) },
    { id: 'crv_demo3', name: 'Marina — Depoimento textura', campaignId: 'cam_demo1', creatorId: 'cre_demo1', platform: 'meta', angle: 'prova_social', format: 'reels', url: '', startDate: d(-30), active: true, rightsExpiry: d(10), metrics: { spend: 3100, impressions: 420000, clicks: 7100, purchases: 52, revenue: 7280, hookRate: 24, holdRate: 13 }, notes: 'Direitos de uso expirando — renovar com a Marina.', createdAt: d(-30) },
    { id: 'crv_demo4', name: 'JP — Trend áudio viral', campaignId: 'cam_demo2', creatorId: 'cre_demo2', platform: 'tiktok', angle: 'trend', format: 'tiktok', url: '', startDate: d(-10), active: true, rightsExpiry: d(50), metrics: { spend: 900, impressions: 240000, clicks: 3100, purchases: 8, revenue: 880, hookRate: 21, holdRate: 7 }, notes: 'Alcance ok, conversão fraca. Provável pausa.', createdAt: d(-10) },
    { id: 'crv_demo5', name: 'Marina — Unboxing kit verão', campaignId: 'cam_demo2', creatorId: 'cre_demo1', platform: 'meta', angle: 'unboxing', format: 'reels', url: '', startDate: d(-7), active: true, rightsExpiry: d(53), metrics: { spend: 380, impressions: 52000, clicks: 1200, purchases: 7, revenue: 980, hookRate: 27, holdRate: 12 }, notes: 'Em teste, primeiros sinais bons.', createdAt: d(-7) },
    { id: 'crv_demo6', name: 'Estático — Oferta 20% OFF', campaignId: 'cam_demo1', creatorId: null, platform: 'meta', angle: 'dor', format: 'foto', url: '', startDate: d(-40), active: false, rightsExpiry: null, metrics: { spend: 1800, impressions: 300000, clicks: 4000, purchases: 22, revenue: 3080, hookRate: 0, holdRate: 0 }, notes: 'Pausado — UGC performa 2x melhor.', createdAt: d(-40) },
  ]

  const payments = [
    { id: 'pay_demo1', creatorId: 'cre_demo1', description: 'Vídeo antes/depois — Sérum (brief #1)', amount: 450, dueDate: d(-20), paid: true, paidDate: d(-20), createdAt: d(-25) },
    { id: 'pay_demo2', creatorId: 'cre_demo2', description: 'Vídeo gancho negativo — Sérum (brief #2)', amount: 700, dueDate: d(-12), paid: true, paidDate: d(-11), createdAt: d(-16) },
    { id: 'pay_demo3', creatorId: 'cre_demo1', description: 'POV Kit Verão (brief #3)', amount: 450, dueDate: d(7), paid: false, paidDate: null, createdAt: d(-4) },
    { id: 'pay_demo4', creatorId: 'cre_demo3', description: 'Pacote 4 vídeos — 1ª parcela', amount: 600, dueDate: d(-2), paid: false, paidDate: null, createdAt: d(-10) },
  ]

  return { creators, campaigns, briefs, deliverables, creatives, payments }
}
