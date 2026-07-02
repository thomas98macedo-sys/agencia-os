// ============================================================
// CRIA·OS — CRM de Creators (kanban drag&drop + tabela + perfil)
// ============================================================
import React, { useMemo, useState } from 'react'
import { Users, Plus, Pencil, Trash2, MessageCircle, Mail, Instagram, LayoutGrid, List } from 'lucide-react'
import { useStore, addItem, updateItem, removeItem } from '../store.js'
import { CREATOR_STAGES, PLATFORMS } from '../constants.js'
import { fmtNum, fmtMoney, computeMetrics, cx } from '../util.js'
import { PageHeader, Modal, Field, Select, Badge, Avatar, Stars, SearchBox, Empty, useToast, confirmDelete } from '../ui.jsx'

const emptyCreator = {
  name: '', handle: '', platforms: ['instagram'], niche: '', followers: '',
  whatsapp: '', email: '', city: '', price: '', status: 'prospect', rating: 0, notes: '',
}

export default function Creators() {
  const { creators, creatives, settings } = useStore()
  const [view, setView] = useState('kanban')
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(null) // null | {} novo | creator
  const [dragId, setDragId] = useState(null)
  const [dragOver, setDragOver] = useState(null)
  const toast = useToast()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return creators
    return creators.filter((c) =>
      [c.name, c.handle, c.niche, c.city, c.notes].join(' ').toLowerCase().includes(q),
    )
  }, [creators, query])

  // estatísticas do creator a partir dos criativos veiculados
  const creatorStats = (id) => {
    const list = creatives.filter((c) => c.creatorId === id)
    let spend = 0, revenue = 0
    for (const c of list) {
      const m = computeMetrics(c, settings)
      spend += m.spend
      revenue += m.revenue
    }
    return { count: list.length, roas: spend > 0 ? revenue / spend : null }
  }

  const save = (data) => {
    const clean = {
      ...data,
      followers: Number(data.followers) || 0,
      price: Number(data.price) || 0,
    }
    if (data.id) {
      updateItem('creators', data.id, clean)
      toast('Creator atualizado')
    } else {
      addItem('creators', clean)
      toast('Creator adicionado ao CRM')
    }
    setEditing(null)
  }

  const onDrop = (stage) => {
    if (dragId) {
      updateItem('creators', dragId, { status: stage })
      toast('Etapa atualizada')
    }
    setDragId(null)
    setDragOver(null)
  }

  return (
    <>
      <PageHeader
        icon={Users}
        title="CRM de Creators"
        sub="Seu banco de creators e influencers: da prospecção ao creator ativo produzindo todo mês. Arraste os cards entre as etapas."
        actions={
          <>
            <SearchBox value={query} onChange={setQuery} placeholder="Buscar creator, nicho, cidade…" />
            <button className="btn" onClick={() => setView(view === 'kanban' ? 'table' : 'kanban')}>
              {view === 'kanban' ? <List size={14} /> : <LayoutGrid size={14} />}
              {view === 'kanban' ? 'Tabela' : 'Kanban'}
            </button>
            <button className="btn primary" onClick={() => setEditing({ ...emptyCreator })}>
              <Plus size={14} /> Novo Creator
            </button>
          </>
        }
      />

      {creators.length === 0 ? (
        <Empty
          icon={Users}
          title="Nenhum creator no CRM"
          text="Adicione os creators que você prospecta, negocia e contrata. Aqui vive todo o seu exército de UGC."
          action={<button className="btn primary" onClick={() => setEditing({ ...emptyCreator })}><Plus size={14} /> Adicionar primeiro creator</button>}
        />
      ) : view === 'kanban' ? (
        <div className="kanban">
          {CREATOR_STAGES.map((stage) => {
            const cards = filtered.filter((c) => c.status === stage.key)
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
                  {cards.map((c) => {
                    const st = creatorStats(c.id)
                    return (
                      <div
                        key={c.id}
                        className={cx('kanban-card', dragId === c.id && 'dragging')}
                        draggable
                        onDragStart={() => setDragId(c.id)}
                        onDragEnd={() => { setDragId(null); setDragOver(null) }}
                        onClick={() => setEditing(c)}
                      >
                        <div style={{ display: 'flex', gap: 9, alignItems: 'center', marginBottom: 8 }}>
                          <Avatar name={c.name} />
                          <div style={{ minWidth: 0 }}>
                            <div className="kc-title" style={{ margin: 0 }}>{c.name}</div>
                            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{c.handle}</div>
                          </div>
                        </div>
                        <div className="kc-meta">
                          {c.niche && <Badge color="purple">{c.niche}</Badge>}
                          {c.followers > 0 && <span>{fmtNum(c.followers)} segs</span>}
                        </div>
                        <div className="kc-footer">
                          <Stars value={c.rating} size={12} />
                          {st.count > 0 && (
                            <span style={{ fontSize: 11, color: st.roas >= settings.targetRoas ? 'var(--green)' : 'var(--text-3)', fontWeight: 700 }}>
                              {st.count} criativo(s){st.roas ? ` · ${st.roas.toFixed(1)}x` : ''}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Creator</th><th>Nicho</th><th className="num">Seguidores</th><th className="num">Preço/vídeo</th>
                <th>Status</th><th>Nota</th><th className="num">Criativos</th><th className="num">ROAS</th><th>Contato</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const st = creatorStats(c.id)
                const stage = CREATOR_STAGES.find((s) => s.key === c.status)
                return (
                  <tr key={c.id} className="clickable" onClick={() => setEditing(c)}>
                    <td>
                      <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
                        <Avatar name={c.name} size="sm" />
                        <div>
                          <div className="td-main">{c.name}</div>
                          <div className="td-sub">{c.handle}</div>
                        </div>
                      </div>
                    </td>
                    <td>{c.niche || '—'}</td>
                    <td className="num">{fmtNum(c.followers)}</td>
                    <td className="num">{c.price ? fmtMoney(c.price, settings.currency) : '—'}</td>
                    <td><Badge color={stage?.color}>{stage?.label}</Badge></td>
                    <td><Stars value={c.rating} size={12} /></td>
                    <td className="num">{st.count}</td>
                    <td className="num" style={{ fontWeight: 700, color: st.roas >= settings.targetRoas ? 'var(--green)' : undefined }}>
                      {st.roas ? st.roas.toFixed(2) + 'x' : '—'}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      {c.whatsapp && (
                        <a className="icon-btn" title="WhatsApp" href={`https://wa.me/55${c.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
                          <MessageCircle size={15} />
                        </a>
                      )}
                      {c.email && (
                        <a className="icon-btn" title="Email" href={`mailto:${c.email}`}><Mail size={15} /></a>
                      )}
                      {c.handle && (
                        <a className="icon-btn" title="Perfil" href={`https://instagram.com/${c.handle.replace('@', '')}`} target="_blank" rel="noreferrer">
                          <Instagram size={15} />
                        </a>
                      )}
                    </td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button className="icon-btn" onClick={() => setEditing(c)}><Pencil size={14} /></button>
                      <button
                        className="icon-btn danger"
                        onClick={() => confirmDelete(c.name) && (removeItem('creators', c.id), toast('Creator removido'))}
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {editing && <CreatorModal creator={editing} onSave={save} onClose={() => setEditing(null)} onDelete={(id) => { removeItem('creators', id); setEditing(null); toast('Creator removido') }} />}
    </>
  )
}

function CreatorModal({ creator, onSave, onClose, onDelete }) {
  const [form, setForm] = useState({ ...emptyCreator, ...creator })
  const set = (k) => (e) => setForm({ ...form, [k]: e.target?.value ?? e })
  const togglePlatform = (key) => {
    const has = form.platforms?.includes(key)
    setForm({ ...form, platforms: has ? form.platforms.filter((p) => p !== key) : [...(form.platforms || []), key] })
  }
  return (
    <Modal
      title={form.id ? `Editar — ${form.name}` : 'Novo Creator'}
      onClose={onClose}
      footer={
        <>
          {form.id && <button className="btn danger" style={{ marginRight: 'auto' }} onClick={() => confirmDelete(form.name) && onDelete(form.id)}><Trash2 size={14} /> Excluir</button>}
          <button className="btn ghost" onClick={onClose}>Cancelar</button>
          <button className="btn primary" disabled={!form.name.trim()} onClick={() => onSave(form)}>Salvar</button>
        </>
      }
    >
      <div className="form-grid">
        <Field label="Nome *"><input value={form.name} onChange={set('name')} placeholder="Ex: Marina Lopes" /></Field>
        <Field label="@ / Handle"><input value={form.handle} onChange={set('handle')} placeholder="@marinalopes" /></Field>
        <Field label="Plataformas" full>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {PLATFORMS.map((p) => (
              <button
                key={p.key}
                type="button"
                className={cx('btn sm', form.platforms?.includes(p.key) && 'primary')}
                onClick={() => togglePlatform(p.key)}
              >
                {p.label}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Nicho"><input value={form.niche} onChange={set('niche')} placeholder="Skincare, Fitness, Casa…" /></Field>
        <Field label="Seguidores"><input type="number" value={form.followers} onChange={set('followers')} placeholder="50000" /></Field>
        <Field label="Preço por vídeo (R$)"><input type="number" value={form.price} onChange={set('price')} placeholder="400" /></Field>
        <Field label="Etapa">
          <Select options={CREATOR_STAGES} value={form.status} onChange={set('status')} />
        </Field>
        <Field label="WhatsApp"><input value={form.whatsapp} onChange={set('whatsapp')} placeholder="11 99999-9999" /></Field>
        <Field label="Email"><input value={form.email} onChange={set('email')} placeholder="creator@email.com" /></Field>
        <Field label="Cidade"><input value={form.city} onChange={set('city')} placeholder="São Paulo/SP" /></Field>
        <Field label="Avaliação">
          <div style={{ paddingTop: 6 }}><Stars value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} size={20} /></div>
        </Field>
        <Field label="Notas internas" full>
          <textarea value={form.notes} onChange={set('notes')} placeholder="Qualidade da entrega, prazos, observações de negociação…" />
        </Field>
      </div>
    </Modal>
  )
}
