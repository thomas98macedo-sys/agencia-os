// ============================================================
// CRIA·OS — Campanhas: produto/oferta + orçamento + performance
// ============================================================
import React, { useState } from 'react'
import { Megaphone, Plus, Pencil, Trash2, TrendingUp, Clapperboard, FileText } from 'lucide-react'
import { useStore, addItem, updateItem, removeItem } from '../store.js'
import { fmtMoney, fmtMoneyShort, fmtDate, computeMetrics, cx } from '../util.js'
import { PageHeader, Modal, Field, Select, Badge, Empty, useToast, confirmDelete } from '../ui.jsx'

const STATUS = [
  { key: 'planning', label: 'Planejamento', color: 'blue' },
  { key: 'active', label: 'Ativa', color: 'green' },
  { key: 'done', label: 'Encerrada', color: 'gray' },
]

const emptyCampaign = { name: '', product: '', objective: '', budget: '', startDate: '', endDate: '', status: 'planning', notes: '' }

export default function Campaigns() {
  const { campaigns, creatives, briefs, settings } = useStore()
  const [editing, setEditing] = useState(null)
  const toast = useToast()

  const campStats = (id) => {
    const list = creatives.filter((c) => c.campaignId === id)
    let spend = 0, revenue = 0, purchases = 0
    for (const c of list) {
      const m = computeMetrics(c, settings)
      spend += m.spend; revenue += m.revenue; purchases += m.purchases
    }
    return {
      creatives: list.length,
      briefs: briefs.filter((b) => b.campaignId === id).length,
      spend, revenue, purchases,
      roas: spend > 0 ? revenue / spend : null,
      cpa: purchases > 0 ? spend / purchases : null,
    }
  }

  const save = (data) => {
    const clean = { ...data, budget: Number(data.budget) || 0 }
    if (data.id) { updateItem('campaigns', data.id, clean); toast('Campanha atualizada') }
    else { addItem('campaigns', clean); toast('Campanha criada') }
    setEditing(null)
  }

  return (
    <>
      <PageHeader
        icon={Megaphone}
        title="Campanhas"
        sub="Cada campanha agrupa briefings e criativos de um produto/oferta. Acompanhe orçamento vs resultado em tempo real."
        actions={<button className="btn primary" onClick={() => setEditing({ ...emptyCampaign })}><Plus size={14} /> Nova Campanha</button>}
      />

      {campaigns.length === 0 ? (
        <Empty
          icon={Megaphone}
          title="Nenhuma campanha"
          text="Crie a primeira campanha para organizar briefings e criativos por produto ou oferta."
          action={<button className="btn primary" onClick={() => setEditing({ ...emptyCampaign })}><Plus size={14} /> Criar campanha</button>}
        />
      ) : (
        <div style={{ display: 'grid', gap: 14 }}>
          {campaigns.map((camp) => {
            const st = campStats(camp.id)
            const status = STATUS.find((s) => s.key === camp.status)
            const budgetUsed = camp.budget > 0 ? Math.min((st.spend / camp.budget) * 100, 100) : 0
            return (
              <div key={camp.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setEditing(camp)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, flexWrap: 'wrap' }}>
                  <div style={{ minWidth: 240, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontWeight: 800, fontSize: 16 }}>{camp.name}</span>
                      <Badge color={status?.color}>{status?.label}</Badge>
                    </div>
                    <div style={{ color: 'var(--text-2)', fontSize: 13 }}>{camp.product}</div>
                    {camp.objective && <div style={{ color: 'var(--text-3)', fontSize: 12.5, marginTop: 6, maxWidth: 520, lineHeight: 1.5 }}>{camp.objective}</div>}
                    <div style={{ display: 'flex', gap: 14, marginTop: 10, fontSize: 12, color: 'var(--text-3)', flexWrap: 'wrap' }}>
                      <span><FileText size={12} style={{ verticalAlign: -2 }} /> {st.briefs} brief(s)</span>
                      <span><Clapperboard size={12} style={{ verticalAlign: -2 }} /> {st.creatives} criativo(s)</span>
                      <span>{fmtDate(camp.startDate)} → {fmtDate(camp.endDate)}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 26, alignItems: 'center', flexWrap: 'wrap' }}>
                    <MiniStat label="Investido" value={fmtMoneyShort(st.spend, settings.currency)} />
                    <MiniStat label="Receita" value={fmtMoneyShort(st.revenue, settings.currency)} />
                    <MiniStat
                      label="ROAS"
                      value={st.roas ? `${st.roas.toFixed(2)}x` : '—'}
                      color={st.roas ? (st.roas >= settings.targetRoas ? 'var(--green)' : st.roas >= settings.targetRoas * 0.75 ? 'var(--yellow)' : 'var(--red)') : undefined}
                    />
                    <MiniStat
                      label="CPA"
                      value={st.cpa ? fmtMoney(st.cpa, settings.currency) : '—'}
                      color={st.cpa ? (st.cpa <= settings.targetCpa ? 'var(--green)' : 'var(--red)') : undefined}
                    />
                    <div onClick={(e) => e.stopPropagation()}>
                      <button className="icon-btn" onClick={() => setEditing(camp)}><Pencil size={15} /></button>
                      <button className="icon-btn danger" onClick={() => confirmDelete(camp.name) && (removeItem('campaigns', camp.id), toast('Campanha removida'))}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
                {camp.budget > 0 && (
                  <div style={{ marginTop: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--text-3)', marginBottom: 5 }}>
                      <span>Orçamento: {fmtMoney(camp.budget, settings.currency)}</span>
                      <span style={{ color: budgetUsed >= 95 ? 'var(--red)' : undefined }}>{budgetUsed.toFixed(0)}% usado</span>
                    </div>
                    <div className="progress-bar"><div style={{ width: `${budgetUsed}%` }} /></div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {editing && <CampaignModal campaign={editing} onSave={save} onClose={() => setEditing(null)} />}
    </>
  )
}

function MiniStat({ label, value, color }) {
  return (
    <div style={{ textAlign: 'right', minWidth: 74 }}>
      <div style={{ fontSize: 10.5, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--text-3)' }}>{label}</div>
      <div style={{ fontWeight: 800, fontSize: 17, color, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
  )
}

function CampaignModal({ campaign, onSave, onClose }) {
  const [form, setForm] = useState({ ...emptyCampaign, ...campaign })
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  return (
    <Modal
      title={form.id ? `Editar — ${form.name}` : 'Nova Campanha'}
      onClose={onClose}
      footer={
        <>
          <button className="btn ghost" onClick={onClose}>Cancelar</button>
          <button className="btn primary" disabled={!form.name.trim()} onClick={() => onSave(form)}>Salvar</button>
        </>
      }
    >
      <div className="form-grid">
        <Field label="Nome da campanha *" full><input value={form.name} onChange={set('name')} placeholder="Ex: Lançamento Sérum Vitamina C" /></Field>
        <Field label="Produto / Oferta" full><input value={form.product} onChange={set('product')} placeholder="Ex: Sérum Facial 30ml — 20% OFF primeiro pedido" /></Field>
        <Field label="Objetivo" full><textarea value={form.objective} onChange={set('objective')} placeholder="Ex: Escalar produto herói com UGC de prova social. Meta: CPA < R$ 55" /></Field>
        <Field label="Orçamento (R$)"><input type="number" value={form.budget} onChange={set('budget')} placeholder="10000" /></Field>
        <Field label="Status"><Select options={STATUS} value={form.status} onChange={set('status')} /></Field>
        <Field label="Início"><input type="date" value={form.startDate} onChange={set('startDate')} /></Field>
        <Field label="Fim"><input type="date" value={form.endDate} onChange={set('endDate')} /></Field>
        <Field label="Notas" full><textarea value={form.notes} onChange={set('notes')} placeholder="Cupons, condições, links…" /></Field>
      </div>
    </Modal>
  )
}
