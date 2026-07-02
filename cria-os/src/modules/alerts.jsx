// ============================================================
// CRIA·OS — motor de alertas (o "cérebro" do dashboard)
// Varre o estado e devolve alertas acionáveis, ordenados por gravidade.
// ============================================================
import React from 'react'
import { computeMetrics, computeVerdict, daysBetween, fmtMoney, isOverdue } from '../util.js'
import { PIPELINE_STAGES } from '../constants.js'

// severidade: 0 = crítico (red), 1 = importante (orange/yellow), 2 = info (blue/green)
export function computeAlerts(state) {
  const { settings, creatives, deliverables, payments, creators, briefs } = state
  const alerts = []
  const creatorName = (id) => creators.find((c) => c.id === id)?.name || 'Creator'

  // 1. Criativos vencedores prontos para escalar
  for (const c of creatives) {
    const v = computeVerdict(c, settings)
    const m = computeMetrics(c, settings)
    if (v.key === 'scale') {
      alerts.push({
        sev: 2, color: 'green', type: 'scale', page: 'creatives',
        text: <><b>{c.name}</b> está com ROAS {m.roas?.toFixed(2)}x — acima da meta. <b>Aumente o orçamento</b> e peça 2-3 variações do mesmo angle.</>,
      })
    }
    if (v.key === 'fatigue') {
      alerts.push({
        sev: 1, color: 'orange', type: 'fatigue', page: 'creatives',
        text: <><b>{c.name}</b> está no ar há <b>{m.daysLive} dias</b> — risco de fadiga. Suba variações novas antes do ROAS cair.</>,
      })
    }
    if (v.key === 'kill' && m.spend > 0) {
      alerts.push({
        sev: 1, color: 'red', type: 'kill', page: 'creatives',
        text: <><b>{c.name}</b> queimou {fmtMoney(m.spend, settings.currency)} com ROAS {m.roas ? m.roas.toFixed(2) + 'x' : '0'} — <b>pause e realoque</b> a verba nos vencedores.</>,
      })
    }
  }

  // 2. Direitos de uso expirando
  for (const c of creatives) {
    if (!c.rightsExpiry || c.active === false) continue
    const until = -daysBetween(c.rightsExpiry) // dias até expirar (negativo = já expirou)
    if (until < 0) {
      alerts.push({
        sev: 0, color: 'red', type: 'rights', page: 'finance',
        text: <>Direitos de uso de <b>{c.name}</b> <b>EXPIRARAM</b> há {Math.abs(until)} dia(s). Pause o anúncio ou renove com {creatorName(c.creatorId)} agora.</>,
      })
    } else if (until <= (settings.rightsAlertDays || 15)) {
      alerts.push({
        sev: 1, color: 'yellow', type: 'rights', page: 'finance',
        text: <>Direitos de <b>{c.name}</b> expiram em <b>{until} dia(s)</b>. Negocie a renovação com {creatorName(c.creatorId)} antes de perder o criativo.</>,
      })
    }
  }

  // 3. Pagamentos vencidos / a vencer
  for (const p of payments) {
    if (p.paid) continue
    const late = isOverdue(p.dueDate)
    const until = p.dueDate ? -daysBetween(p.dueDate) : null
    if (late) {
      alerts.push({
        sev: 0, color: 'red', type: 'payment', page: 'finance',
        text: <>Pagamento de <b>{fmtMoney(p.amount, settings.currency)}</b> para <b>{creatorName(p.creatorId)}</b> está atrasado. Creator sem pagamento = creator que some.</>,
      })
    } else if (until != null && until <= 3) {
      alerts.push({
        sev: 1, color: 'yellow', type: 'payment', page: 'finance',
        text: <>Pagamento de <b>{fmtMoney(p.amount, settings.currency)}</b> para <b>{creatorName(p.creatorId)}</b> vence em {until} dia(s).</>,
      })
    }
  }

  // 4. Entregas atrasadas no pipeline
  for (const del of deliverables) {
    if (['approved', 'live'].includes(del.stage)) continue
    if (isOverdue(del.deadline)) {
      const stage = PIPELINE_STAGES.find((s) => s.key === del.stage)?.label || del.stage
      alerts.push({
        sev: 1, color: 'orange', type: 'delivery', page: 'pipeline',
        text: <><b>{del.title}</b> ({creatorName(del.creatorId)}) está atrasado há {daysBetween(del.deadline)} dia(s) na etapa <b>{stage}</b>. Cobre o creator hoje.</>,
      })
    }
  }

  // 5. Briefs enviados sem resposta há mais de 3 dias
  for (const b of briefs) {
    if (b.status !== 'sent') continue
    const days = daysBetween(b.createdAt?.slice(0, 10))
    if (days >= 3) {
      alerts.push({
        sev: 2, color: 'blue', type: 'brief', page: 'briefs',
        text: <>Brief para <b>{creatorName(b.creatorId)}</b> enviado há {days} dias sem aceite. Faça follow-up.</>,
      })
    }
  }

  return alerts.sort((a, b) => a.sev - b.sev)
}
