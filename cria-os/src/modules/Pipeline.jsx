// ============================================================
// CRIA·OS — Pipeline de Produção (kanban de entregas UGC)
// Do brief enviado ao criativo no ar, com feedback de aprovação.
// ============================================================
import React, { useState } from 'react'
import { Kanban, Plus, Trash2, Clock, MessageSquare, Flame } from 'lucide-react'
import { useStore, addItem, updateItem, removeItem } from '../store.js'
import { PIPELINE_STAGES, FORMATS, formatLabel } from '../constants.js'
import { fmtDate, isOverdue, daysBetween, todayIso, addDaysIso, cx } from '../util.js'
import { PageHeader, Modal, Field, Select, Badge, Avatar, Empty, useToast, confirmDelete } from '../ui.jsx'

const emptyDel = { title: '', campaignId: '', creatorId: '', format: 'reels', stage: 'brief', deadline: '', feedback: [] }

export default function Pipeline() {
  const { deliverables, creators, campaigns, settings } = useStore()
  const [editing, setEditing] = useState(null)
  const [dragId, setDragId] = useState(null)
  const [dragOver, setDragOver] = useState(null)
  const toast = useToast()

  const creator = (id) => creators.find((c) => c.id === id)

  const save = (data) => {
    if (data.id) { updateItem('deliverables', data.id, data); toast('Entrega atualizada') }
    else { addItem('deliverables', data); toast('Entrega adicionada ao pipeline') }
    setEditing(null)
  }

  const onDrop = (stage) => {
    if (dragId) {
      updateItem('deliverables', dragId, { stage })
      if (stage === 'live') toast('No ar! Cadastre o criativo em Inteligência > Criativos para acompanhar métricas.')
      else toast('Etapa atualizada')
    }
    setDragId(null)
    setDragOver(null)
  }

  const promoteToCreative = (del) => {
    const cr = creator(del.creatorId)
    addItem('creatives', {
      name: del.title,
      campaignId: del.campaignId,
      creatorId: del.creatorId,
      deliverableId: del.id,
      platform: 'meta',
      angle: '',
      format: del.format,
      url: '',
      startDate: todayIso(),
      active: true,
      rightsExpiry: addDaysIso(todayIso(), 90),
      metrics: { spend: 0, impressions: 0, clicks: 0, purchases: 0, revenue: 0, hookRate: 0, holdRate: 0 },
      notes: '',
    })
    updateItem('deliverables', del.id, { stage: 'live' })
    toast('Criativo criado! Preencha as métricas em Criativos.')
  }

  return (
    <>
      <PageHeader
        icon={Kanban}
        title="Pipeline de Produção"
        sub="Cada card é um vídeo em produção. Arraste da esquerda pra direita até o ar — atrasos ficam vermelhos sozinhos."
        actions={<button className="btn primary" onClick={() => setEditing({ ...emptyDel, deadline: addDaysIso(todayIso(), 7) })}><Plus size={14} /> Nova Entrega</button>}
      />

      {deliverables.length === 0 ? (
        <Empty
          icon={Kanban}
          title="Pipeline vazio"
          text="Crie entregas manualmente ou envie um brief para a produção na aba Briefings."
          action={<button className="btn primary" onClick={() => setEditing({ ...emptyDel, deadline: addDaysIso(todayIso(), 7) })}><Plus size={14} /> Nova entrega</button>}
        />
      ) : (
        <div className="kanban">
          {PIPELINE_STAGES.map((stage) => {
            const cards = deliverables.filter((d) => d.stage === stage.key)
            return (
              <div
                key={stage.key}
                className={cx('kanban-col', dragOver === stage.key && 'drag-over')}
                onDragOver={(e) => { e.preventDefault(); setDragOver(stage.key) }}
                onDragLeave={() => setDragOver(null)}
                onDrop={() => onDrop(stage.key)}
              >
                <div className="kanban-col-header">
                  <span className={cx('dot', stage.color)} /> {stage.label}
                  <span className="kanban-col-count">{cards.length}</span>
                </div>
                <div className="kanban-cards">
                  {cards.map((d) => {
                    const late = !['approved', 'live'].includes(d.stage) && isOverdue(d.deadline)
                    const cr = creator(d.creatorId)
                    return (
                      <div
                        key={d.id}
                        className={cx('kanban-card', dragId === d.id && 'dragging')}
                        draggable
                        onDragStart={() => setDragId(d.id)}
                        onDragEnd={() => { setDragId(null); setDragOver(null) }}
                        onClick={() => setEditing(d)}
                        style={late ? { borderColor: 'rgba(248,113,113,.45)' } : undefined}
                      >
                        <div className="kc-title">{d.title}</div>
                        <div className="kc-meta">
                          <Badge color="gray">{formatLabel(d.format)}</Badge>
                          {d.feedback?.length > 0 && (
                            <span title="Feedbacks"><MessageSquare size={11} style={{ verticalAlign: -1 }} /> {d.feedback.length}</span>
                          )}
                        </div>
                        <div className="kc-footer">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {cr && <Avatar name={cr.name} size="sm" />}
                            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{cr?.name?.split(' ')[0] || '—'}</span>
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 700, color: late ? 'var(--red)' : 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Clock size={11} />
                            {late ? `${daysBetween(d.deadline)}d atrasado` : fmtDate(d.deadline)}
                          </span>
                        </div>
                        {d.stage === 'approved' && (
                          <button
                            className="btn sm primary"
                            style={{ width: '100%', marginTop: 9, justifyContent: 'center' }}
                            onClick={(e) => { e.stopPropagation(); promoteToCreative(d) }}
                          >
                            <Flame size={12} /> Subir como criativo
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {editing && (
        <DeliverableModal
          del={editing}
          creators={creators}
          campaigns={campaigns}
          onSave={save}
          onClose={() => setEditing(null)}
          onDelete={(id) => { removeItem('deliverables', id); setEditing(null); toast('Entrega removida') }}
        />
      )}
    </>
  )
}

function DeliverableModal({ del, creators, campaigns, onSave, onClose, onDelete }) {
  const [form, setForm] = useState({ ...emptyDel, ...del })
  const [newFeedback, setNewFeedback] = useState('')
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const addFeedback = () => {
    if (!newFeedback.trim()) return
    setForm({ ...form, feedback: [...(form.feedback || []), { date: todayIso(), text: newFeedback.trim() }] })
    setNewFeedback('')
  }

  return (
    <Modal
      title={form.id ? 'Editar Entrega' : 'Nova Entrega'}
      onClose={onClose}
      footer={
        <>
          {form.id && (
            <button className="btn danger" style={{ marginRight: 'auto' }} onClick={() => confirmDelete(form.title) && onDelete(form.id)}>
              <Trash2 size={14} /> Excluir
            </button>
          )}
          <button className="btn ghost" onClick={onClose}>Cancelar</button>
          <button className="btn primary" disabled={!form.title.trim()} onClick={() => onSave(form)}>Salvar</button>
        </>
      }
    >
      <div className="form-grid">
        <Field label="Título *" full><input value={form.title} onChange={set('title')} placeholder="Ex: POV Kit Verão — Marina" /></Field>
        <Field label="Campanha">
          <Select options={campaigns.map((c) => ({ key: c.id, label: c.name }))} value={form.campaignId} onChange={set('campaignId')} placeholder="Selecione…" />
        </Field>
        <Field label="Creator">
          <Select options={creators.map((c) => ({ key: c.id, label: c.name }))} value={form.creatorId} onChange={set('creatorId')} placeholder="Selecione…" />
        </Field>
        <Field label="Formato"><Select options={FORMATS} value={form.format} onChange={set('format')} /></Field>
        <Field label="Etapa"><Select options={PIPELINE_STAGES} value={form.stage} onChange={set('stage')} /></Field>
        <Field label="Prazo"><input type="date" value={form.deadline} onChange={set('deadline')} /></Field>
        <Field label="Feedback / notas de versão" full>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={newFeedback}
              onChange={(e) => setNewFeedback(e.target.value)}
              placeholder="Ex: Cortar 2s do início, trocar CTA…"
              onKeyDown={(e) => e.key === 'Enter' && addFeedback()}
            />
            <button className="btn" type="button" onClick={addFeedback}>Adicionar</button>
          </div>
          {(form.feedback || []).length > 0 && (
            <div style={{ marginTop: 10, display: 'grid', gap: 6 }}>
              {form.feedback.map((f, i) => (
                <div key={i} className="alert-row blue" style={{ margin: 0 }}>
                  <span className="alert-icon"><MessageSquare size={14} /></span>
                  <span className="alert-text"><b>{fmtDate(f.date)}:</b> {f.text}</span>
                  <button
                    className="icon-btn danger"
                    onClick={() => setForm({ ...form, feedback: form.feedback.filter((_, j) => j !== i) })}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Field>
      </div>
    </Modal>
  )
}
