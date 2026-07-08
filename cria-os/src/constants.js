// ============================================================
// CRIA·OS — constantes de domínio (angles, formatos, etapas…)
// ============================================================

export const CREATOR_STAGES = [
  { key: 'prospect', label: 'Prospecção', color: 'gray' },
  { key: 'contacted', label: 'Contato Feito', color: 'blue' },
  { key: 'negotiating', label: 'Negociação', color: 'yellow' },
  { key: 'hired', label: 'Fechado', color: 'purple' },
  { key: 'active', label: 'Ativo', color: 'green' },
  { key: 'paused', label: 'Pausado', color: 'red' },
]

export const PLATFORMS = [
  { key: 'instagram', label: 'Instagram' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'kwai', label: 'Kwai' },
]

export const AD_PLATFORMS = [
  { key: 'meta', label: 'Meta Ads' },
  { key: 'tiktok', label: 'TikTok Ads' },
  { key: 'google', label: 'Google/YouTube' },
  { key: 'organico', label: 'Orgânico' },
]

export const FORMATS = [
  { key: 'reels', label: 'Reels' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'shorts', label: 'Shorts' },
  { key: 'story', label: 'Story' },
  { key: 'foto', label: 'Foto/Carrossel' },
]

export const ANGLES = [
  { key: 'dor', label: 'Dor/Problema', desc: 'Abre na dor que o produto resolve, agita e apresenta a solução.' },
  { key: 'prova_social', label: 'Prova Social', desc: 'Depoimento real, resultados, "todo mundo tá usando".' },
  { key: 'unboxing', label: 'Unboxing', desc: 'Experiência de recebimento e primeiras impressões do produto.' },
  { key: 'antes_depois', label: 'Antes & Depois', desc: 'Transformação visível com o uso do produto.' },
  { key: 'pov', label: 'POV/Lifestyle', desc: 'Produto inserido na rotina real do creator, sem cara de anúncio.' },
  { key: 'tutorial', label: 'Tutorial/Como usar', desc: 'Passo a passo demonstrando o uso e os diferenciais.' },
  { key: 'review', label: 'Review Sincero', desc: 'Análise honesta com prós e contras — gera confiança.' },
  { key: 'trend', label: 'Trend/Áudio viral', desc: 'Aproveita formato ou áudio em alta para alcance.' },
  { key: 'gancho_negativo', label: 'Gancho Negativo', desc: '"NÃO compre isso antes de ver esse vídeo" — quebra o padrão.' },
  { key: 'asmr', label: 'ASMR/Sensorial', desc: 'Sons e texturas do produto — retenção altíssima.' },
  { key: 'comparacao', label: 'Comparação', desc: 'Produto vs alternativa comum — deixa a vantagem óbvia.' },
  { key: 'fundador', label: 'História do Fundador', desc: 'Bastidores e propósito da marca — conexão e branding.' },
]

export const angleLabel = (key) => ANGLES.find((a) => a.key === key)?.label || key
export const formatLabel = (key) => FORMATS.find((f) => f.key === key)?.label || key
export const adPlatformLabel = (key) => AD_PLATFORMS.find((p) => p.key === key)?.label || key

export const PIPELINE_STAGES = [
  { key: 'brief', label: 'Brief Enviado', color: 'gray' },
  { key: 'script', label: 'Roteiro', color: 'blue' },
  { key: 'filming', label: 'Gravação', color: 'purple' },
  { key: 'editing', label: 'Edição', color: 'indigo' },
  { key: 'review', label: 'Em Aprovação', color: 'yellow' },
  { key: 'changes', label: 'Em Alteração', color: 'orange' },
  { key: 'approved', label: 'Aprovado', color: 'green' },
  { key: 'live', label: 'No Ar', color: 'pink' },
]

export const BRIEF_STATUS = [
  { key: 'draft', label: 'Rascunho', color: 'gray' },
  { key: 'sent', label: 'Enviado', color: 'blue' },
  { key: 'accepted', label: 'Aceito', color: 'green' },
  { key: 'declined', label: 'Recusado', color: 'red' },
]

export const RIGHTS_OPTIONS = [
  { key: 30, label: '30 dias' },
  { key: 60, label: '60 dias' },
  { key: 90, label: '90 dias' },
  { key: 180, label: '180 dias' },
  { key: 365, label: '1 ano' },
  { key: 0, label: 'Perpétuo' },
]

// Estrutura de roteiro sugerida por angle (usada no gerador de brief)
export const ANGLE_SCRIPTS = {
  dor: ['HOOK (0-3s): mostre a dor de forma visual ou fale ela em voz alta, sem citar o produto', 'AGITAÇÃO (3-10s): por que essa dor atrapalha o dia a dia', 'SOLUÇÃO (10-20s): apresente o produto resolvendo na prática', 'PROVA (20-27s): resultado, textura, detalhe, reação', 'CTA (27-30s): "clica no link e usa o cupom X"'],
  prova_social: ['HOOK (0-3s): "eu não acreditava até testar…" ou print/nº de avaliações', 'CONTEXTO (3-10s): quem você é e por que testou', 'EXPERIÊNCIA (10-22s): mostre usando + resultado real', 'REFORÇO (22-27s): "não sou só eu — olha os comentários"', 'CTA (27-30s): urgência leve + link'],
  unboxing: ['HOOK (0-3s): caixa chegando/abrindo com reação genuína', 'UNBOXING (3-12s): abre mostrando embalagem e detalhes', 'PRIMEIRA IMPRESSÃO (12-22s): testa na hora e reage', 'VEREDITO (22-27s): nota + pra quem é', 'CTA (27-30s): link/cupom'],
  antes_depois: ['HOOK (0-3s): resultado final primeiro ("olha isso") — depois volta', 'ANTES (3-8s): situação inicial honesta', 'PROCESSO (8-18s): aplicando/usando o produto', 'DEPOIS (18-25s): comparação lado a lado', 'CTA (25-30s): "quer o mesmo resultado? link na bio"'],
  pov: ['HOOK (0-3s): cena de rotina real com texto na tela (POV: …)', 'ROTINA (3-15s): produto entra naturalmente na cena', 'MOMENTO-CHAVE (15-23s): close no produto em uso', 'FECHAMENTO (23-30s): comentário casual + CTA suave'],
  tutorial: ['HOOK (0-3s): "o jeito certo de usar X que ninguém te ensinou"', 'PASSO 1-3 (3-20s): demonstração clara e rápida', 'RESULTADO (20-26s): efeito final', 'CTA (26-30s): "salva esse vídeo e pega o seu no link"'],
  review: ['HOOK (0-3s): "review honesto do X que tá em todo lugar"', 'PRÓS (3-15s): 2-3 pontos fortes demonstrados', 'CONTRA (15-20s): 1 ponto de atenção sincero (gera confiança)', 'VEREDITO (20-27s): nota final + pra quem vale', 'CTA (27-30s): link'],
  trend: ['HOOK (0-3s): entra direto no formato/áudio da trend', 'ADAPTAÇÃO (3-15s): produto encaixado no contexto da trend', 'PUNCHLINE (15-25s): o momento que faz compartilhar', 'CTA (25-30s): leve, sem quebrar a vibe'],
  gancho_negativo: ['HOOK (0-3s): "NÃO compre X antes de ver isso"', 'TENSÃO (3-10s): o erro que todo mundo comete', 'VIRADA (10-20s): o que fazer em vez disso (seu produto)', 'PROVA (20-27s): demonstração rápida', 'CTA (27-30s): link + cupom'],
  asmr: ['HOOK (0-3s): som/textura marcante do produto, sem falar', 'SEQUÊNCIA SENSORIAL (3-20s): closes, sons, aplicação', 'REVEAL (20-26s): produto + benefício em texto na tela', 'CTA (26-30s): texto na tela + link'],
  comparacao: ['HOOK (0-3s): os dois lado a lado ("qual vale mais?")', 'TESTE (3-18s): mesmo uso, resultados diferentes', 'VENCEDOR (18-25s): por que o seu ganha', 'CTA (25-30s): link + oferta'],
  fundador: ['HOOK (0-3s): "eu criei isso porque…" ou bastidor da operação', 'HISTÓRIA (3-15s): problema que motivou a marca', 'PRODUTO (15-24s): o que ele resolve de diferente', 'CTA (24-30s): "conhece a gente no link"'],
}

// Biblioteca de hooks comprovados (PT-BR)
export const HOOK_LIBRARY = [
  { cat: 'Curiosidade', hooks: [
    'Eu testei isso por 30 dias e o resultado me assustou…',
    'Ninguém te conta isso sobre [categoria do produto]…',
    'O segredo que as marcas de [nicho] escondem de você',
    'Se eu soubesse disso antes, teria economizado uma fortuna',
    'POV: você descobriu o motivo do seu [problema]',
  ]},
  { cat: 'Gancho Negativo', hooks: [
    'NÃO compre [produto] antes de assistir esse vídeo',
    'Pare de usar [alternativa comum] AGORA',
    'Você está fazendo [hábito] errado a vida inteira',
    'Isso aqui quase me fez desistir de [objetivo]…',
    '3 erros que estão sabotando seu [resultado]',
  ]},
  { cat: 'Prova Social', hooks: [
    'Mais de [X mil] pessoas já aprovaram — fui ver se era hype',
    'Minha mãe pediu o dela depois que viu o meu',
    'O produto mais comentado do TikTok chegou aqui em casa',
    'Comprei porque TODO MUNDO falava — veredito sincero:',
    'A estética favorita das [profissão/tribo] finalmente testada',
  ]},
  { cat: 'Urgência/Oferta', hooks: [
    'Corre que o cupom [CUPOM] expira hoje',
    'Isso esgotou 3 vezes — voltou ao estoque agora',
    'O jeito mais barato de resolver [problema] que eu já vi',
    'Custa menos que um lanche e resolve [problema]',
  ]},
  { cat: 'Identificação', hooks: [
    'Se você tem [característica], esse vídeo é pra você',
    'Isso é pra quem já tentou de TUDO contra [problema]',
    'Sinal de que você precisa de [produto]: (leia até o fim)',
    'Eu era o tipo de pessoa que [comportamento]… até isso chegar',
  ]},
  { cat: 'Demonstração', hooks: [
    'Olha o que acontece quando eu [ação com o produto]…',
    'Em 10 segundos você vai entender por que isso viralizou',
    'Teste em tempo real, sem cortes:',
    'A prova de que [afirmação ousada]:',
  ]},
]

export const CTA_LIBRARY = [
  'Clica no link da bio e usa o cupom [CUPOM] pra ganhar [X]% OFF',
  'Toca no perfil → link na bio → me agradece depois',
  'Comenta "EU QUERO" que eu te mando o link',
  'Salva esse vídeo pra não perder e pega o seu no link',
  'Corre no site antes que esgote de novo',
  'Arrasta pra cima e aproveita o frete grátis de hoje',
]
