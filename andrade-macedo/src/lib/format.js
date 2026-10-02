const BRL = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export const moeda = (v) => BRL.format(Number(v) || 0)

// "12.345,67" | "12345.67" | "12345,6" -> number
export function parseMoeda(str) {
  if (typeof str === 'number') return str
  if (!str) return 0
  let s = String(str).replace(/[^\d,.-]/g, '')
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.')
  const n = parseFloat(s)
  return Number.isFinite(n) ? n : 0
}

export function dataBR(iso) {
  if (!iso) return '___/___/______'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export function hojeISO() {
  const d = new Date()
  const off = d.getTimezoneOffset()
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10)
}

export function somarDias(iso, dias) {
  if (!iso) return ''
  const d = new Date(iso + 'T12:00:00')
  d.setDate(d.getDate() + Number(dias || 0))
  return d.toISOString().slice(0, 10)
}

export const NUM_EXTENSO = ['zero', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove', 'dez',
  'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove', 'vinte',
  'vinte e um', 'vinte e dois', 'vinte e três', 'vinte e quatro', 'vinte e cinco', 'vinte e seis', 'vinte e sete',
  'vinte e oito', 'vinte e nove', 'trinta']

export const pad2 = (n) => String(n).padStart(2, '0')
