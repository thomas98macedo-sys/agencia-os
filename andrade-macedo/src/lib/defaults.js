import { hojeISO } from './format.js'

export const EMPRESA_PADRAO = {
  razaoSocial: 'Andrade Macedo Serviços de Engenharia',
  responsavel: 'Eng. Civil Matheus de Andrade Macedo',
  crea: '5071224352',
  cnpj: '',
  endereco: '',
  telefone: '(11) 91374-5116',
  email: 'andrademacedo.engenharia@outlook.com',
  instagram: '@andrademacedo.engenharia',
  slogan: 'Engenharia com confiança, eficiência e transparência.',
  formaPagamento: 'PIX / transferência bancária',
  dadosBancarios: '',
}

export const MODALIDADES = [
  { id: 'mo', label: 'Mão de obra' },
  { id: 'mo_mat', label: 'Mão de obra + materiais' },
  { id: 'global', label: 'Preço global' },
  { id: 'unitario', label: 'Preço unitário' },
  { id: 'tecnico', label: 'Serviço técnico de engenharia' },
]

export const RESP_MATERIAL = ['Andrade Macedo', 'Cliente', 'Andrade Macedo / Cliente', 'Não se aplica']

export const STATUS = {
  rascunho: { label: 'Rascunho', cor: '#6B7280' },
  enviada: { label: 'Enviada', cor: '#0A3F73' },
  aprovada: { label: 'Aprovada', cor: '#15803D' },
  recusada: { label: 'Recusada', cor: '#B91C1C' },
}

export const EXCLUSOES_PADRAO = [
  'serviços não relacionados nesta proposta;',
  'taxas, licenças ou despesas condominiais;',
  'fornecimentos de terceiros não especificados;',
  'correções decorrentes de patologias ou condições preexistentes não identificáveis durante a elaboração da proposta;',
  'alterações solicitadas pelo cliente após a aprovação;',
  'serviços necessários em decorrência de condições ocultas identificadas durante a execução.',
]

export const PREMISSAS_PADRAO = [
  'disponibilidade de acesso ao local nos períodos acordados;',
  'disponibilidade de água e energia necessárias à execução, quando aplicável;',
  'autorização de acesso da equipe e fornecedores;',
  'condições existentes compatíveis com aquelas observadas durante a vistoria;',
  'inexistência de interferências ocultas não identificáveis previamente;',
  'cumprimento das regras do condomínio ou empreendimento previamente informadas à Andrade Macedo.',
]

export const RESP_AM = [
  'executar os serviços conforme o escopo contratado;',
  'disponibilizar mão de obra compatível com os serviços sob sua responsabilidade;',
  'observar as boas práticas técnicas e requisitos aplicáveis à execução;',
  'utilizar os equipamentos de proteção necessários às atividades sob sua responsabilidade;',
  'manter organização compatível com a natureza dos serviços;',
  'comunicar ao cliente ocorrências relevantes identificadas durante a execução;',
  'realizar o acompanhamento técnico dentro dos limites do escopo contratado;',
  'emitir ART quando sua emissão fizer parte do serviço contratado ou for tecnicamente/legalmente aplicável.',
]

export const RESP_CLIENTE = [
  'efetuar os pagamentos nos prazos acordados;',
  'disponibilizar acesso ao local;',
  'informar previamente regras e restrições do condomínio ou empreendimento;',
  'fornecer materiais que estejam expressamente sob sua responsabilidade;',
  'fornecer projetos, informações e documentos necessários à execução, quando aplicável;',
  'realizar as decisões e aprovações necessárias ao andamento dos serviços;',
  'não solicitar diretamente à equipe operacional alterações de escopo sem comunicação ao responsável pela Andrade Macedo.',
]

export const DIFERENCIAIS = [
  { titulo: 'Acompanhamento técnico', texto: 'Execução acompanhada por profissional de engenharia.', icone: 'eng' },
  { titulo: 'Orçamento transparente', texto: 'Definição prévia do escopo, inclusões e exclusões.', icone: 'doc' },
  { titulo: 'Planejamento e organização', texto: 'Controle dos serviços, materiais e prazos acordados.', icone: 'cal' },
  { titulo: 'Comunicação próxima', texto: 'Atualizações sobre andamento e decisões necessárias durante a execução.', icone: 'chat' },
  { titulo: 'Controle de alterações', texto: 'Serviços adicionais são previamente apresentados e aprovados pelo cliente.', icone: 'swap' },
  { titulo: 'Qualidade na entrega', texto: 'Verificação dos serviços executados e organização do ambiente ao término da intervenção.', icone: 'check' },
]

const uid = () => Math.random().toString(36).slice(2, 10)
export { uid }

export function novaProposta(numeroSeq, ano = new Date().getFullYear()) {
  return {
    id: uid(),
    status: 'rascunho',
    criadoEm: new Date().toISOString(),
    atualizadoEm: new Date().toISOString(),
    seq: numeroSeq,
    ano,
    revisao: 0,
    dataEmissao: hojeISO(),
    validadeDias: 15,
    tituloServico: '',
    cliente: { nome: '', documento: '', telefone: '', email: '' },
    local: { endereco: '', condominio: '' },
    objeto: {
      descricaoPrincipal: '',
      resumo: '',
      modalidades: [],
      outraModalidade: '',
    },
    escopo: [
      { id: uid(), descricao: '', material: 'Andrade Macedo' },
    ],
    planilhaAnexa: false,
    exclusoes: [...EXCLUSOES_PADRAO],
    premissas: [...PREMISSAS_PADRAO],
    respAM: [...RESP_AM],
    respCliente: [...RESP_CLIENTE],
    valorTotal: '',
    pagamentos: [
      { id: uid(), etapa: 'Entrada', condicao: 'Na aprovação da proposta', valor: '' },
      { id: uid(), etapa: 'Saldo', condicao: 'Na conclusão/entrega', valor: '' },
    ],
    formaPagamento: '',
    dadosBancarios: '',
    prazo: { quantidade: '', unidade: 'dias úteis', inicio: '', conclusao: '' },
    condicoes: { multa: '', juros: '', diasSuspensao: '', multaRescisoria: '' },
    observacoes: '',
  }
}

export function numeroProposta(p) {
  return `AM-PC-${String(p.seq).padStart(3, '0')}/${p.ano}`
}
export const revisaoTxt = (p) => String(p.revisao ?? 0).padStart(2, '0')
