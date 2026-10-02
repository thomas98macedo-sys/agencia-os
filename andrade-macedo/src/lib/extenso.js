// Valor monetário por extenso em português (pt-BR)
const UNIDADES = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove',
  'dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove']
const DEZENAS = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa']
const CENTENAS = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos',
  'setecentos', 'oitocentos', 'novecentos']

function ate999(n) {
  if (n === 100) return 'cem'
  const c = Math.floor(n / 100)
  const r = n % 100
  const partes = []
  if (c) partes.push(CENTENAS[c])
  if (r) {
    if (r < 20) partes.push(UNIDADES[r])
    else {
      const d = Math.floor(r / 10)
      const u = r % 10
      partes.push(u ? `${DEZENAS[d]} e ${UNIDADES[u]}` : DEZENAS[d])
    }
  }
  return partes.join(' e ')
}

const ESCALAS = [
  ['', ''],
  ['mil', 'mil'],
  ['milhão', 'milhões'],
  ['bilhão', 'bilhões'],
]

function inteiroPorExtenso(n) {
  if (n === 0) return 'zero'
  const grupos = []
  while (n > 0) {
    grupos.push(n % 1000)
    n = Math.floor(n / 1000)
  }
  const partes = []
  for (let i = grupos.length - 1; i >= 0; i--) {
    const g = grupos[i]
    if (!g) continue
    let txt
    if (i === 1 && g === 1) txt = 'mil'
    else {
      txt = ate999(g)
      if (i > 0) txt += ' ' + (g === 1 ? ESCALAS[i][0] : ESCALAS[i][1])
    }
    partes.push({ txt, g, i })
  }
  // Conector "e" antes do último grupo quando ele é < 100 ou centena redonda
  return partes
    .map((p, idx) => {
      if (idx === 0) return p.txt
      const ultimo = idx === partes.length - 1
      const usaE = ultimo && (p.g < 100 || p.g % 100 === 0)
      return (usaE ? ' e ' : ' ') + p.txt
    })
    .join('')
}

export function valorPorExtenso(valor) {
  const v = Math.round((Number(valor) || 0) * 100)
  const reais = Math.floor(v / 100)
  const centavos = v % 100
  const partes = []
  if (reais > 0) {
    let t = inteiroPorExtenso(reais)
    // "um milhão de reais", "dois milhões de reais"
    const de = reais >= 1e6 && reais % 1e6 === 0 ? ' de' : ''
    partes.push(`${t}${de} ${reais === 1 ? 'real' : 'reais'}`)
  }
  if (centavos > 0) partes.push(`${inteiroPorExtenso(centavos)} ${centavos === 1 ? 'centavo' : 'centavos'}`)
  if (!partes.length) return 'zero real'
  return partes.join(' e ')
}
