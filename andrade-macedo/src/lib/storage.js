import { EMPRESA_PADRAO } from './defaults.js'

const K_PROPOSTAS = 'am:propostas:v1'
const K_EMPRESA = 'am:empresa:v1'

function ler(chave, padrao) {
  try {
    const raw = localStorage.getItem(chave)
    return raw ? JSON.parse(raw) : padrao
  } catch {
    return padrao
  }
}
function gravar(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor))
    return true
  } catch {
    return false
  }
}

export const carregarPropostas = () => ler(K_PROPOSTAS, [])
export const salvarPropostas = (lista) => gravar(K_PROPOSTAS, lista)
export const carregarEmpresa = () => ({ ...EMPRESA_PADRAO, ...ler(K_EMPRESA, {}) })
export const salvarEmpresa = (e) => gravar(K_EMPRESA, e)

export function proximoSeq(lista, ano) {
  const doAno = lista.filter((p) => p.ano === ano).map((p) => p.seq)
  return doAno.length ? Math.max(...doAno) + 1 : 1
}

export function exportarBackup(lista, empresa) {
  const blob = new Blob([JSON.stringify({ versao: 1, empresa, propostas: lista }, null, 2)], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `backup-propostas-andrade-macedo-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  setTimeout(() => URL.revokeObjectURL(a.href), 1000)
}
