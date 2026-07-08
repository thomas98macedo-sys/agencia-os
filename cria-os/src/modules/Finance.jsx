// ============================================================
// CRIA·OS — Direitos de Uso & Pagamentos a creators
// Nunca mais rode anúncio com direito vencido nem atrase creator.
// ============================================================
import React, { useState } from 'react'
import { Wallet, Plus, Trash2, Check, ShieldAlert, ShieldCheck, Clock } from 'lucide-react'
import { useStore, addItem, updateItem, removeItem } from '../store.js'
import { fmtMoney, fmtDate, daysUntil, isOverdue, todayIso, cx } from '../util.js'
import { PageHeader, Modal, Field, Select, Badge, Kpi, Empty, useToast, confirmDelete } from '../ui.jsx'

const emptyPayment = { creatorId: '', description: '', amount: '', dueDate: '', paid: false, paidDate: null }

export default function Finance() {
  const { payments, creatives, creators, settings } = useStore()
  const [editing, setEditing] = useState(null)
  const toast = useToast()

  const creatorName = (id) => creators.find((c) => c.id === id)?.name || '—'

  const pending = payments.filter((p) => !p.paid)
  const pendingTotal = pending.reduce((a, p) => a + Number(p.amount || 0), 0)
  const lateCount = pending.filter((p) => isOverdue(p.dueDate)).length
  const paidTotal = payments.filter((p) => p.paid).reduce((a, p) => a + Number(p.amount || 0), 0)

  // direitos de uso: criativos com data de expiração
  const rights = creatives
    .filter((c) => c.rightsExpiry)
    .map((c) => ({ c, until: daysUntil(c.rightsExpiry) }))
    .sort((a, b) => a.until - b.until)
  const expired = rights.filter((r) => r.until < 0 && r.c.active !== false).length
  const expiring = rights.filter((r) => r.until >= 0 && r.until <= (settings.rightsAlertDays || 15)).length

  const save = (data) => {
    const clean = { ...data, amount: Number(data.amount) || 0 }
    if (data.id) { updateItem('payments', data.id, clean); toast('Pagamento atualizado') }
    else { addItem('payments', clean); toast('Pagamento registrado') }
    setEditing(null)
  }

  const markPaid = (p) => {
    updateItem('payments', p.id, { paid: !p.paid, paidDate: p.paid ? null : todayIso() })
    toast(p.paid ? 'Marcado como pendente' : 'Pagamento confirmado ✓')
  }

  return (
    <>
      <PageHeader
        icon={Wallet}
        title="Direitos & Pagamentos"
        sub="Direito de uso vencido em anúncio ativo = risco jurídico. Creator sem receber = creator que não grava mais. Aqui você controla os dois."
        actions={<button className="btn primary" onClick={() => setEditing({ ...emptyPayment })}><Plus size={14} /> Novo Pagamento</button>}
      />

      <div className="kpi-grid">
        <Kpi label="A pagar" value={fmtMoney(pendingTotal, settings.currency)} valueClass={lateCount > 0 ? 'red' : ''} sub={lateCount > 0 ? `${lateCount} atrasado(s)!` : `${pending.length} pendente(s)`} />
        <Kpi label="Pago (histórico)" value={fmtMoney(paidTotal, settings.currency)} sub={`${payments.filter((p) => p.paid).length} pagamento(s)`} />
        <Kpi label="Direitos expirados" value={expired} valueClass={expired > 0 ? 'red' : 'green'} sub={expired > 0 ? 'Ação imediata!' : 'Tudo regular'} />
        <Kpi label="Expirando em breve" value={expiring} valueClass={expiring > 0 ? 'yellow' : ''} sub={`Janela de ${settings.rightsAlertDays || 15} dias`} />
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title"><Clock size={13} /> Pagamentos</div>
          {payments.length === 0 ? (
            <Empty icon={Wallet} title="Nenhum pagamento" text="Registre o combinado com cada creator para nunca atrasar." />
          ) : (
            <table>
              <thead>
                <tr><th>Creator</th><th>Descrição</th><th className="num">Valor</th><th>Vencimento</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {[...payments].sort((a, b) => Number(a.paid) - Number(b.paid)).map((p) => {
                  const late = !p.paid && isOverdue(p.dueDate)
                  return (
                    <tr key={p.id} className="clickable" onClick={() => setEditing(p)}>
                      <td className="td-main">{creatorName(p.creatorId)}</td>
                      <td style={{ whiteSpace: 'normal', maxWidth: 220 }}>{p.description}</td>
                      <td className="num" style={{ fontWeight: 700 }}>{fmtMoney(p.amount, settings.currency)}</td>
                      <td style={{ color: late ? 'var(--red)' : undefined, fontWeight: late ? 700 : 400 }}>{fmtDate(p.dueDate)}</td>
                      <td>
                        {p.paid
                          ? <Badge color="green">Pago {p.paidDate ? fmtDate(p.paidDate) : ''}</Badge>
                          : late
                            ? <Badge color="red">Atrasado</Badge>
                            : <Badge color="yellow">Pendente</Badge>}
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <button className="icon-btn" title={p.paid ? 'Desfazer' : 'Marcar como pago'} onClick={() => markPaid(p)}>
                          <Check size={15} color={p.paid ? 'var(--green)' : undefined} />
                        </button>
                        <button className="icon-btn danger" onClick={() => confirmDelete('este pagamento') && (removeItem('payments', p.id), toast('Removido'))}>
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <div className="card-title"><ShieldAlert size={13} /> Direitos de uso por criativo</div>
          {rights.length === 0 ? (
            <Empty icon={ShieldCheck} title="Nenhum criativo com prazo de direitos" text="Defina a data de expiração dos direitos ao cadastrar cada criativo de UGC." />
          ) : (
            <table>
              <thead>
                <tr><th>Criativo</th><th>Creator</th><th>Expira em</th><th>Status</th></tr>
              </thead>
              <tbody>
                {rights.map(({ c, until }) => (
                  <tr key={c.id}>
                    <td style={{ whiteSpace: 'normal', maxWidth: 220 }} className="td-main">{c.name}</td>
                    <td>{creatorName(c.creatorId)}</td>
                    <td>{fmtDate(c.rightsExpiry)}</td>
                    <td>
                      {until < 0
                        ? <Badge color="red">Expirado há {Math.abs(until)}d {c.active !== false ? '· ANÚNCIO ATIVO' : ''}</Badge>
                        : until <= (settings.rightsAlertDays || 15)
                          ? <Badge color="yellow">{until}d restantes</Badge>
                          : <Badge color="green">{until}d restantes</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {editing && (
        <PaymentModal payment={editing} creators={creators} onSave={save} onClose={() => setEditing(null)} />
      )}
    </>
  )
}

function PaymentModal({ payment, creators, onSave, onClose }) {
  const [form, setForm] = useState({ ...emptyPayment, ...payment })
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  return (
    <Modal
      title={form.id ? 'Editar Pagamento' : 'Novo Pagamento'}
      onClose={onClose}
      footer={
        <>
          <button className="btn ghost" onClick={onClose}>Cancelar</button>
          <button className="btn primary" disabled={!form.creatorId || !form.amount} onClick={() => onSave(form)}>Salvar</button>
        </>
      }
    >
      <div className="form-grid">
        <Field label="Creator *" full>
          <Select options={creators.map((c) => ({ key: c.id, label: c.name }))} value={form.creatorId} onChange={set('creatorId')} placeholder="Selecione…" />
        </Field>
        <Field label="Descrição" full><input value={form.description} onChange={set('description')} placeholder="Ex: Vídeo antes/depois — campanha Sérum" /></Field>
        <Field label="Valor (R$) *"><input type="number" value={form.amount} onChange={set('amount')} /></Field>
        <Field label="Vencimento"><input type="date" value={form.dueDate} onChange={set('dueDate')} /></Field>
        <Field label="Status" full>
          <Select
            options={[{ key: 'false', label: 'Pendente' }, { key: 'true', label: 'Pago' }]}
            value={String(form.paid)}
            onChange={(e) => setForm({ ...form, paid: e.target.value === 'true', paidDate: e.target.value === 'true' ? todayIso() : null })}
          />
        </Field>
      </div>
    </Modal>
  )
}
