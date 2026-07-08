// ============================================================
// CRIA·OS — utilitários de formatação, datas e métricas
// ============================================================

export const fmtMoney = (v, currency = 'R$') => {
  if (v == null || isNaN(v)) return '—'
  return `${currency} ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export const fmtMoneyShort = (v, currency = 'R$') => {
  if (v == null || isNaN(v)) return '—'
  const n = Number(v)
  if (Math.abs(n) >= 1000000) return `${currency} ${(n / 1000000).toFixed(1)}M`
  if (Math.abs(n) >= 1000) return `${currency} ${(n / 1000).toFixed(1)}k`
  return `${currency} ${n.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`
}

export const fmtNum = (v) => {
  if (v == null || isNaN(v)) return '—'
  const n = Number(v)
  if (Math.abs(n) >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(1)}k`
  return n.toLocaleString('pt-BR')
}

export const fmtPct = (v, digits = 1) => (v == null || isNaN(v) ? '—' : `${Number(v).toFixed(digits)}%`)

export const fmtDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso.length === 10 ? iso + 'T12:00:00' : iso)
  if (isNaN(d)) return '—'
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

export const todayIso = () => new Date().toISOString().slice(0, 10)

export const addDaysIso = (iso, days) => {
  const d = new Date((iso || todayIso()) + 'T12:00:00')
  d.setDate(d.getDate() + Number(days || 0))
  return d.toISOString().slice(0, 10)
}

export const daysBetween = (fromIso, toIso = todayIso()) => {
  if (!fromIso) return null
  const a = new Date(fromIso.slice(0, 10) + 'T12:00:00')
  const b = new Date(toIso.slice(0, 10) + 'T12:00:00')
  return Math.round((b - a) / 86400000)
}

// dias até uma data (negativo = já passou)
export const daysUntil = (iso) => (iso ? daysBetween(todayIso(), iso) : null)

export const isOverdue = (iso) => iso && daysBetween(iso) > 0

// ---------- métricas de criativos ----------
export function computeMetrics(creative, settings) {
  const m = creative.metrics || {}
  const spend = Number(m.spend) || 0
  const impressions = Number(m.impressions) || 0
  const clicks = Number(m.clicks) || 0
  const purchases = Number(m.purchases) || 0
  const revenue = Number(m.revenue) || 0
  const hookRate = Number(m.hookRate) || 0
  const holdRate = Number(m.holdRate) || 0

  const ctr = impressions > 0 ? (clicks / impressions) * 100 : null
  const cpm = impressions > 0 ? (spend / impressions) * 1000 : null
  const cpa = purchases > 0 ? spend / purchases : null
  const roas = spend > 0 ? revenue / spend : null
  const daysLive = creative.startDate ? Math.max(0, daysBetween(creative.startDate)) : 0

  return { spend, impressions, clicks, purchases, revenue, hookRate, holdRate, ctr, cpm, cpa, roas, daysLive }
}

// Score 0-100 ponderado: ROAS pesa mais, depois hook, hold, CTR e volume.
export function computeScore(c, settings) {
  const m = computeMetrics(c, settings)
  const tRoas = Number(settings.targetRoas) || 2
  const minSpend = Number(settings.minSpendToScale) || 500
  if (m.spend <= 0) return null
  const roasScore = Math.min((m.roas || 0) / tRoas, 1) * 40         // até 40 (meta batida = nota cheia)
  const hookScore = Math.min((m.hookRate || 0) / 30, 1) * 20        // até 20 (30% = teto)
  const holdScore = Math.min((m.holdRate || 0) / 15, 1) * 15        // até 15 (15% = teto)
  const ctrScore = Math.min((m.ctr || 0) / 2, 1) * 15               // até 15 (2% = teto)
  const volScore = Math.min(m.spend / minSpend, 1) * 10             // até 10
  return Math.min(100, Math.round(roasScore + hookScore + holdScore + ctrScore + volScore))
}

// Veredito automático do criativo
export const VERDICTS = {
  testing: { key: 'testing', label: 'Testando', emoji: '🧪', color: 'blue' },
  scale: { key: 'scale', label: 'Escalar', emoji: '🏆', color: 'green' },
  iterate: { key: 'iterate', label: 'Iterar', emoji: '🔁', color: 'yellow' },
  fatigue: { key: 'fatigue', label: 'Fadiga', emoji: '⚠️', color: 'orange' },
  kill: { key: 'kill', label: 'Pausar', emoji: '❌', color: 'red' },
  paused: { key: 'paused', label: 'Pausado', emoji: '⏸️', color: 'gray' },
}

export function computeVerdict(c, settings) {
  if (c.active === false) return VERDICTS.paused
  const m = computeMetrics(c, settings)
  const tRoas = Number(settings.targetRoas) || 2
  const minSpend = Number(settings.minSpendToScale) || 500
  const fatigueDays = Number(settings.fatigueDays) || 21

  if (m.spend < minSpend * 0.4) return VERDICTS.testing
  const goodRoas = (m.roas || 0) >= tRoas
  const okRoas = (m.roas || 0) >= tRoas * 0.75
  if (goodRoas && m.daysLive > fatigueDays) return VERDICTS.fatigue
  if (goodRoas) return VERDICTS.scale
  if (okRoas || (m.hookRate || 0) >= 25) return VERDICTS.iterate
  return VERDICTS.kill
}

// ---------- agregações para insights ----------
export function groupStats(creatives, settings, keyFn, labelFn = (k) => k) {
  const groups = {}
  for (const c of creatives) {
    const key = keyFn(c) || 'outro'
    if (!groups[key]) groups[key] = { key, label: labelFn(key), spend: 0, revenue: 0, purchases: 0, count: 0, hookSum: 0, hookN: 0 }
    const m = computeMetrics(c, settings)
    groups[key].spend += m.spend
    groups[key].revenue += m.revenue
    groups[key].purchases += m.purchases
    groups[key].count += 1
    if (m.hookRate) { groups[key].hookSum += m.hookRate; groups[key].hookN += 1 }
  }
  return Object.values(groups)
    .map((g) => ({
      ...g,
      roas: g.spend > 0 ? g.revenue / g.spend : null,
      cpa: g.purchases > 0 ? g.spend / g.purchases : null,
      hookRate: g.hookN > 0 ? g.hookSum / g.hookN : null,
    }))
    .filter((g) => g.spend > 0)
    .sort((a, b) => (b.roas || 0) - (a.roas || 0))
}

export const cx = (...parts) => parts.filter(Boolean).join(' ')
