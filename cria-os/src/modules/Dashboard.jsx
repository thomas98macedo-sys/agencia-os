// ============================================================
// CRIA·OS — Dashboard: KPIs, alertas acionáveis e vencedores
// ============================================================
import React from 'react'
import {
  LayoutDashboard, TrendingUp, DollarSign, Users, Clapperboard, AlertTriangle,
  CircleAlert, Info, CheckCircle2, ArrowRight, Trophy, Kanban, Timer,
} from 'lucide-react'
import { useStore } from '../store.js'
import { computeMetrics, computeVerdict, computeScore, fmtMoneyShort, fmtMoney, isOverdue, cx } from '../util.js'
import { PageHeader, Kpi, Badge, Score, Empty } from '../ui.jsx'
import { computeAlerts } from './alerts.jsx'
import { angleLabel } from '../constants.js'

const sevIcon = { 0: CircleAlert, 1: AlertTriangle, 2: Info }

export default function Dashboard({ go }) {
  const state = useStore()
  const { settings, creatives, creators, deliverables, payments } = state
  const cur = settings.currency
  const alerts = computeAlerts(state)

  // agregados
  const activeCreatives = creatives.filter((c) => c.active !== false)
  const metrics = activeCreatives.map((c) => computeMetrics(c, settings))
  const totalSpend = metrics.reduce((a, m) => a + m.spend, 0)
  const totalRevenue = metrics.reduce((a, m) => a + m.revenue, 0)
  const totalPurchases = metrics.reduce((a, m) => a + m.purchases, 0)
  const roas = totalSpend > 0 ? totalRevenue / totalSpend : null
  const cpa = totalPurchases > 0 ? totalSpend / totalPurchases : null
  const activeCreators = creators.filter((c) => ['active', 'hired'].includes(c.status)).length
  const inProduction = deliverables.filter((d) => !['approved', 'live'].includes(d.stage)).length
  const lateDeliveries = deliverables.filter((d) => !['approved', 'live'].includes(d.stage) && isOverdue(d.deadline)).length
  const pendingPayments = payments.filter((p) => !p.paid).reduce((a, p) => a + Number(p.amount || 0), 0)

  // top criativos por score
  const ranked = creatives
    .map((c) => ({ c, score: computeScore(c, settings), m: computeMetrics(c, settings), v: computeVerdict(c, settings) }))
    .filter((r) => r.score != null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  return (
    <>
      <PageHeader
        icon={LayoutDashboard}
        title={`Central de Comando — ${settings.brand}`}
        sub="Tudo que precisa da sua atenção hoje: o que escalar, o que pausar, quem cobrar e o que renovar."
      />

      <div className="kpi-grid">
        <Kpi
          label="ROAS Geral (ativos)" icon={TrendingUp}
          value={roas != null ? `${roas.toFixed(2)}x` : '—'}
          valueClass={roas != null ? (roas >= settings.targetRoas ? 'green' : roas >= settings.targetRoas * 0.75 ? 'yellow' : 'red') : ''}
          sub={`Meta: ${Number(settings.targetRoas).toFixed(1)}x`}
          highlight
        />
        <Kpi label="Investido em criativos" icon={DollarSign} value={fmtMoneyShort(totalSpend, cur)} sub={`Receita: ${fmtMoneyShort(totalRevenue, cur)}`} />
        <Kpi
          label="CPA Médio" icon={DollarSign}
          value={cpa != null ? fmtMoney(cpa, cur) : '—'}
          valueClass={cpa != null ? (cpa <= settings.targetCpa ? 'green' : 'red') : ''}
          sub={`Alvo: ${fmtMoney(settings.targetCpa, cur)}`}
        />
        <Kpi label="Criativos no ar" icon={Clapperboard} value={activeCreatives.length} sub={`${creatives.length} no total`} />
        <Kpi label="Creators ativos" icon={Users} value={activeCreators} sub={`${creators.length} no CRM`} />
        <Kpi
          label="Em produção" icon={Kanban} value={inProduction}
          valueClass={lateDeliveries > 0 ? 'yellow' : ''}
          sub={lateDeliveries > 0 ? `${lateDeliveries} atrasado(s)!` : 'Nenhum atraso'}
        />
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title"><AlertTriangle size={13} /> O que fazer agora ({alerts.length})</div>
          {alerts.length === 0 ? (
            <Empty icon={CheckCircle2} title="Tudo em dia!" text="Nenhum alerta pendente. Hora de produzir mais criativos." />
          ) : (
            alerts.slice(0, 9).map((a, i) => {
              const Icon = sevIcon[a.sev] || Info
              return (
                <div key={i} className={cx('alert-row', a.color)}>
                  <span className="alert-icon"><Icon size={16} /></span>
                  <span className="alert-text">{a.text}</span>
                  <button className="icon-btn" title="Ir para a página" onClick={() => go(a.page)}>
                    <ArrowRight size={15} />
                  </button>
                </div>
              )
            })
          )}
        </div>

        <div className="card">
          <div className="card-title"><Trophy size={13} /> Ranking de criativos (score)</div>
          {ranked.length === 0 ? (
            <Empty icon={Clapperboard} title="Sem criativos com métricas" text="Cadastre criativos e preencha investimento e receita para ver o ranking." />
          ) : (
            <table>
              <thead>
                <tr><th>#</th><th>Criativo</th><th>Angle</th><th className="num">ROAS</th><th className="num">Score</th><th>Veredito</th></tr>
              </thead>
              <tbody>
                {ranked.map((r, i) => (
                  <tr key={r.c.id} className="clickable" onClick={() => go('creatives')}>
                    <td style={{ color: 'var(--text-3)', fontWeight: 700 }}>{i + 1}</td>
                    <td><div className="td-main" style={{ whiteSpace: 'normal' }}>{r.c.name}</div></td>
                    <td><Badge color="purple">{angleLabel(r.c.angle)}</Badge></td>
                    <td className="num" style={{ fontWeight: 700 }}>{r.m.roas ? r.m.roas.toFixed(2) + 'x' : '—'}</td>
                    <td className="num"><Score value={r.score} /></td>
                    <td><Badge color={r.v.color}>{r.v.emoji} {r.v.label}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {pendingPayments > 0 && (
            <div className="alert-row yellow" style={{ marginTop: 14 }}>
              <span className="alert-icon"><Timer size={16} /></span>
              <span className="alert-text"><b>{fmtMoney(pendingPayments, cur)}</b> em pagamentos pendentes a creators.</span>
              <button className="icon-btn" onClick={() => go('finance')}><ArrowRight size={15} /></button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
