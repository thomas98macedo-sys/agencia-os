// ============================================================
// CRIA·OS — Gerador de Briefings
// Brief profissional em 2 minutos, com roteiro sugerido por
// angle e texto pronto para colar no WhatsApp do creator.
// ============================================================
import React, { useState } from 'react'
import { FileText, Plus, Trash2, Copy, Send, Kanban, Pencil, MessageCircle } from 'lucide-react'
import { useStore, addItem, updateItem, removeItem } from '../store.js'
import { ANGLES, ANGLE_SCRIPTS, FORMATS, BRIEF_STATUS, RIGHTS_OPTIONS, angleLabel, formatLabel } from '../constants.js'
import { fmtDate, fmtMoney, todayIso, addDaysIso } from '../util.js'
import { PageHeader, Modal, Field, Select, Badge, Empty, useToast, confirmDelete } from '../ui.jsx'

const emptyBrief = {
  campaignId: '', creatorId: '', format: 'reels', duration: 30, angle: 'dor',
  hook: '', dos: '', donts: '', references: '', deadline: '', payment: '', rightsDays: 90, status: 'draft',
}

// Gera o texto do brief pronto para enviar
export function briefToText(brief, { campaign, creator, settings }) {
  const script = (ANGLE_SCRIPTS[brief.angle] || []).map((l) => `  • ${l}`).join('\n')
  const rights = brief.rightsDays === 0 || brief.rightsDays === '0'
    ? 'Perpétuo (uso em anúncios sem prazo)'
    : `${brief.rightsDays} dias de uso em tráfego pago a partir da entrega`
  return `🎬 *BRIEF DE CONTEÚDO — ${settings.brand.toUpperCase()}*

*Creator:* ${creator?.name || '—'} (${creator?.handle || ''})
*Campanha:* ${campaign?.name || '—'}
*Produto:* ${campaign?.product || '—'}

*Formato:* ${formatLabel(brief.format)} · ~${brief.duration}s · gravado no celular, em pé (9:16)
*Angle:* ${angleLabel(brief.angle)}

*🪝 HOOK sugerido (primeiros 3 segundos):*
"${brief.hook || 'a definir junto com você'}"

*🎞 ESTRUTURA DO VÍDEO:*
${script}

*✅ PODE / DEVE:*
${brief.dos || '—'}

*🚫 NÃO PODE:*
${brief.donts || '—'}
${brief.references ? `\n*🔗 Referências:* ${brief.references}` : ''}
*📅 Prazo de entrega:* ${fmtDate(brief.deadline)}
*💰 Valor:* ${brief.payment ? fmtMoney(Number(brief.payment), settings.currency) : 'combinado'}
*📜 Direitos de uso:* ${rights}

_Entrega: vídeo SEM legenda queimada + versão com, em qualidade máxima (sem marca d'água do app)._
Qualquer dúvida me chama! 🙌`
}

export default function Briefs() {
  const { briefs, campaigns, creators, settings } = useStore()
  const [editing, setEditing] = useState(null)
  const [preview, setPreview] = useState(null)
  const toast = useToast()

  const campaign = (id) => campaigns.find((c) => c.id === id)
  const creator = (id) => creators.find((c) => c.id === id)

  const save = (data) => {
    if (data.id) { updateItem('briefs', data.id, data); toast('Brief atualizado') }
    else { setPreview(addItem('briefs', data)); toast('Brief criado — texto pronto para enviar!') }
    setEditing(null)
  }

  const copyBrief = async (brief) => {
    const text = briefToText(brief, { campaign: campaign(brief.campaignId), creator: creator(brief.creatorId), settings })
    try {
      await navigator.clipboard.writeText(text)
      toast('Brief copiado! Cole no WhatsApp do creator.')
    } catch {
      toast('Não foi possível copiar automaticamente — selecione o texto.')
    }
    if (brief.status === 'draft') updateItem('briefs', brief.id, { status: 'sent' })
  }

  const sendToPipeline = (brief) => {
    const cr = creator(brief.creatorId)
    addItem('deliverables', {
      briefId: brief.id,
      campaignId: brief.campaignId,
      creatorId: brief.creatorId,
      title: `${angleLabel(brief.angle)} — ${cr?.name || 'Creator'}`,
      format: brief.format,
      stage: 'brief',
      deadline: brief.deadline,
      feedback: [],
    })
    if (brief.status !== 'accepted') updateItem('briefs', brief.id, { status: 'accepted' })
    toast('Card criado no pipeline de produção')
  }

  return (
    <>
      <PageHeader
        icon={FileText}
        title="Briefings"
        sub="Crie briefs profissionais em 2 minutos: escolha o angle, o CRIA·OS monta o roteiro e gera o texto pronto pra colar no WhatsApp."
        actions={<button className="btn primary" onClick={() => setEditing({ ...emptyBrief, deadline: addDaysIso(todayIso(), 7) })}><Plus size={14} /> Novo Brief</button>}
      />

      {briefs.length === 0 ? (
        <Empty
          icon={FileText}
          title="Nenhum brief criado"
          text="Um bom brief é a diferença entre um vídeo que vende e um vídeo que você paga e não usa. Crie o primeiro."
          action={<button className="btn primary" onClick={() => setEditing({ ...emptyBrief, deadline: addDaysIso(todayIso(), 7) })}><Plus size={14} /> Criar brief</button>}
        />
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Creator</th><th>Campanha</th><th>Angle</th><th>Formato</th>
                <th>Prazo</th><th className="num">Valor</th><th>Direitos</th><th>Status</th><th style={{ width: 170 }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {briefs.map((b) => {
                const st = BRIEF_STATUS.find((s) => s.key === b.status)
                const cr = creator(b.creatorId)
                return (
                  <tr key={b.id} className="clickable" onClick={() => setEditing(b)}>
                    <td><div className="td-main">{cr?.name || '—'}</div><div className="td-sub">{cr?.handle}</div></td>
                    <td>{campaign(b.campaignId)?.name || '—'}</td>
                    <td><Badge color="purple">{angleLabel(b.angle)}</Badge></td>
                    <td>{formatLabel(b.format)} · {b.duration}s</td>
                    <td>{fmtDate(b.deadline)}</td>
                    <td className="num">{b.payment ? fmtMoney(Number(b.payment), settings.currency) : '—'}</td>
                    <td>{Number(b.rightsDays) === 0 ? 'Perpétuo' : `${b.rightsDays}d`}</td>
                    <td><Badge color={st?.color}>{st?.label}</Badge></td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <button className="icon-btn" title="Ver texto do brief" onClick={() => setPreview(b)}><MessageCircle size={14} /></button>
                      <button className="icon-btn" title="Copiar brief (marca como enviado)" onClick={() => copyBrief(b)}><Copy size={14} /></button>
                      <button className="icon-btn" title="Criar card na produção" onClick={() => sendToPipeline(b)}><Kanban size={14} /></button>
                      <button className="icon-btn" title="Editar" onClick={() => setEditing(b)}><Pencil size={14} /></button>
                      <button className="icon-btn danger" title="Excluir" onClick={() => confirmDelete('este brief') && (removeItem('briefs', b.id), toast('Brief removido'))}>
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

      {editing && (
        <BriefModal
          brief={editing}
          campaigns={campaigns}
          creators={creators}
          onSave={save}
          onClose={() => setEditing(null)}
        />
      )}
      {preview && (
        <Modal
          title="Brief pronto para enviar"
          wide
          onClose={() => setPreview(null)}
          footer={
            <>
              <button className="btn ghost" onClick={() => setPreview(null)}>Fechar</button>
              <button className="btn primary" onClick={() => { copyBrief(preview); setPreview(null) }}>
                <Copy size={14} /> Copiar para WhatsApp
              </button>
            </>
          }
        >
          <div className="copy-box">
            {briefToText(preview, { campaign: campaign(preview.campaignId), creator: creator(preview.creatorId), settings })}
          </div>
        </Modal>
      )}
    </>
  )
}

function BriefModal({ brief, campaigns, creators, onSave, onClose }) {
  const [form, setForm] = useState({ ...emptyBrief, ...brief })
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const angle = ANGLES.find((a) => a.key === form.angle)
  return (
    <Modal
      title={form.id ? 'Editar Brief' : 'Novo Brief'}
      wide
      onClose={onClose}
      footer={
        <>
          <button className="btn ghost" onClick={onClose}>Cancelar</button>
          <button className="btn primary" disabled={!form.creatorId || !form.campaignId} onClick={() => onSave(form)}>
            <Send size={14} /> Salvar Brief
          </button>
        </>
      }
    >
      <div className="form-grid">
        <Field label="Campanha *">
          <Select options={campaigns.map((c) => ({ key: c.id, label: c.name }))} value={form.campaignId} onChange={set('campaignId')} placeholder="Selecione…" />
        </Field>
        <Field label="Creator *">
          <Select options={creators.map((c) => ({ key: c.id, label: `${c.name} (${c.handle || 's/ handle'})` }))} value={form.creatorId} onChange={set('creatorId')} placeholder="Selecione…" />
        </Field>
        <Field label="Formato">
          <Select options={FORMATS} value={form.format} onChange={set('format')} />
        </Field>
        <Field label="Duração (segundos)"><input type="number" value={form.duration} onChange={set('duration')} /></Field>
        <Field label="Angle (abordagem criativa)" hint={angle?.desc} full>
          <Select options={ANGLES} value={form.angle} onChange={set('angle')} />
        </Field>
        {ANGLE_SCRIPTS[form.angle] && (
          <Field label="Estrutura sugerida (gerada automaticamente pelo angle)" full>
            <div className="copy-box" style={{ maxHeight: 150 }}>
              {ANGLE_SCRIPTS[form.angle].map((l) => `• ${l}`).join('\n')}
            </div>
          </Field>
        )}
        <Field label="Hook (primeiros 3 segundos)" full hint="Dica: pegue um hook validado na Biblioteca de Hooks.">
          <input value={form.hook} onChange={set('hook')} placeholder='Ex: "NÃO compre sérum de vitamina C antes de ver isso"' />
        </Field>
        <Field label="Pode / Deve"><textarea value={form.dos} onChange={set('dos')} placeholder="Luz natural, mostrar textura, close no produto…" /></Field>
        <Field label="Não pode"><textarea value={form.donts} onChange={set('donts')} placeholder="Não prometer cura, não citar concorrente…" /></Field>
        <Field label="Referências (links)" full><input value={form.references} onChange={set('references')} placeholder="Links de vídeos de referência, separados por vírgula" /></Field>
        <Field label="Prazo de entrega"><input type="date" value={form.deadline} onChange={set('deadline')} /></Field>
        <Field label="Valor (R$)"><input type="number" value={form.payment} onChange={set('payment')} placeholder="400" /></Field>
        <Field label="Direitos de uso">
          <Select options={RIGHTS_OPTIONS} value={form.rightsDays} onChange={(e) => setForm({ ...form, rightsDays: Number(e.target.value) })} />
        </Field>
        <Field label="Status">
          <Select options={BRIEF_STATUS} value={form.status} onChange={set('status')} />
        </Field>
      </div>
    </Modal>
  )
}
