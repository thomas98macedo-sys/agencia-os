// ============================================================
// CRIA·OS — Inteligência de Criativos
// Métricas por criativo, score, veredito automático
// (escalar / iterar / fadiga / pausar) e insights por angle.
// ============================================================
import React, { useMemo, useState } from 'react'
import { Flame, Plus, Trash2, Pencil, Trophy, AlertTriangle, Lightbulb, Pause, Play, Link as LinkIcon } from 'lucide-react'
import { useStore, addItem, updateItem, removeItem } from '../store.js'
import { ANGLES, AD_PLATFORMS, FORMATS, angleLabel, adPlatformLabel } from '../constants.js'
import { computeMetrics, computeScore, computeVerdict, groupStats, fmtMoney, fmtMoneyShort, fmtNum, fmtPct, fmtDate, todayIso, cx } from '../util.js'
import { PageHeader, Modal, Field, Select, Badge, Score, Empty, useToast, confirmDelete } from '../ui.jsx'

const emptyCreative = {
  name: '', campaignId: '', creatorId: '', platform: 'meta', angle: 'dor', format: 'reels',
  url: '', startDate: '', active: true, rightsExpiry: '',
  metrics: { spend: '', impressions: '', clicks: '', purchases: '', revenue: '', hookRate: '', holdRate: '' },
  notes: '',
}

const COLUMNS = [
  { key: 'spend', label: 'Investido' },
  { key: 'roas', label: 'ROAS' },
  { key: 'cpa', label: 'CPA' },
  { key: 'ctr', label: 'CTR' },
  { key: 'hookRate', label: 'Hook' },
  { key: 'holdRate', label: 'Hold' },
  { key: 'daysLive', label: 'Dias' },
]

export default function Creatives() {
  const { creatives, campaigns, creators, settings } = useStore()
  const [tab, setTab] = useState('table')
  const [editing, setEditing] = useState(null)
  const [sortBy, setSortBy] = useState('score')
  const [sortDir, setSortDir] = useState(-1)
  const toast = useToast()

  const rows = useMemo(() => {
    const list = creatives.map((c) => ({
      c,
      m: computeMetrics(c, settings),
      score: computeScore(c, settings),
      v: computeVerdict(c, settings),
    }))
    const val = (r) => (sortBy === 'score' ? (r.score ?? -1) : sortBy === 'name' ? r.c.name : (r.m[sortBy] ?? -1))
    return list.sort((a, b) => {
      const va = val(a), vb = val(b)
      if (typeof va === 'string') return sortDir * va.localeCompare(vb)
      return sortDir * (va - vb)
    })
  }, [creatives, settings, sortBy, sortDir])

  const setSort = (key) => {
    if (sortBy === key) setSortDir(-sortDir)
    else { setSortBy(key); setSortDir(-1) }
  }

  const save = (data) => {
    const metrics = Object.fromEntries(Object.entries(data.metrics || {}).map(([k, v]) => [k, Number(v) || 0]))
    const clean = { ...data, metrics }
    if (data.id) { updateItem('creatives', data.id, clean); toast('Criativo atualizado') }
    else { addItem('creatives', clean); toast('Criativo cadastrado') }
    setEditing(null)
  }

  const creatorName = (id) => creators.find((x) => x.id === id)?.name || '—'
  const campaignName = (id) => campaigns.find((x) => x.id === id)?.name || '—'

  return (
    <>
      <PageHeader
        icon={Flame}
        title="Inteligência de Criativos"
        sub={`Cole as métricas do gerenciador e o CRIA·OS diz o que escalar, o que iterar e o que pausar. Meta atual: ROAS ${Number(settings.targetRoas).toFixed(1)}x · CPA ${fmtMoney(settings.targetCpa, settings.currency)} (ajuste em Configurações).`}
        actions={<button className="btn primary" onClick={() => setEditing({ ...emptyCreative, startDate: todayIso() })}><Plus size={14} /> Novo Criativo</button>}
      />

      <div className="tabs">
        <button className={cx('tab', tab === 'table' && 'active')} onClick={() => setTab('table')}>Criativos</button>
        <button className={cx('tab', tab === 'insights' && 'active')} onClick={() => setTab('insights')}>Insights & Angles</button>
      </div>

      {creatives.length === 0 ? (
        <Empty
          icon={Flame}
          title="Nenhum criativo cadastrado"
          text="Cadastre os criativos que estão rodando e preencha as métricas semanalmente. O score e o veredito são calculados na hora."
          action={<button className="btn primary" onClick={() => setEditing({ ...emptyCreative, startDate: todayIso() })}><Plus size={14} /> Cadastrar criativo</button>}
        />
      ) : tab === 'table' ? (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th className="sortable" onClick={() => setSort('name')}>Criativo</th>
                <th>Angle</th>
                {COLUMNS.map((col) => (
                  <th key={col.key} className="num sortable" onClick={() => setSort(col.key)}>
                    {col.label}{sortBy === col.key ? (sortDir === -1 ? ' ↓' : ' ↑') : ''}
                  </th>
                ))}
                <th className="num sortable" onClick={() => setSort('score')}>Score{sortBy === 'score' ? (sortDir === -1 ? ' ↓' : ' ↑') : ''}</th>
                <th>Veredito</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ c, m, score, v }) => (
                <tr key={c.id} className="clickable" onClick={() => setEditing({ ...c, metrics: { ...c.metrics } })}>
                  <td>
                    <div className="td-main" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {c.name}
                      {c.url && (
                        <a href={c.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} title="Abrir anúncio">
                          <LinkIcon size = {12} />
                        </a>
                      )}
                    </div>
                    <div className="td-sub">{creatorName(c.creatorId)} · {adPlatformLabel(c.platform)} · {campaignName(c.campaignId)}</div>
                  </td>
                  <td>{c.angle ? <Badge color="purple">{angleLabel(c.angle)}</Badge> : '—'}</td>
                  <td className="num">{fmtMoneyShort(m.spend, settings.currency)}</td>
                  <td className="num" style={{ fontWeight: 800, color: m.roas != null ? (m.roas >= settings.targetRoas ? 'var(--green)' : m.roas >= settings.targetRoas * 0.75 ? 'var(--yellow)' : 'var(--red)') : undefined }}>
                    {m.roas != null ? m.roas.toFixed(2) + 'x' : '—'}
                  </td>
                  <td className="num" style={{ color: m.cpa != null ? (m.cpa <= settings.targetCpa ? 'var(--green)' : 'var(--red)') : undefined }}>
                    {m.cpa != null ? fmtMoney(m.cpa, settings.currency) : '—'}
                  </td>
                  <td className="num">{fmtPct(m.ctr, 2)}</td>
                  <td className="num">{m.hookRate ? fmtPct(m.hookRate, 0) : '—'}</td>
                  <td className="num">{m.holdRate ? fmtPct(m.holdRate, 0) : '—'}</td>
                  <td className="num">{m.daysLive}</td>
                  <td className="num"><Score value={score} /></td>
                  <td><Badge color={v.color}>{v.emoji} {v.label}</Badge></td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <button
                      className="icon-btn"
                      title={c.active === false ? 'Reativar' : 'Marcar como pausado'}
                      onClick={() => { updateItem('creatives', c.id, { active: c.active === false }); toast(c.active === false ? 'Criativo reativado' : 'Criativo pausado') }}
                    >
                      {c.active === false ? <Play size={14} /> : <Pause size={14} />}
                    </button>
                    <button className="icon-btn" onClick={() => setEditing({ ...c, metrics: { ...c.metrics } })}><Pencil size={14} /></button>
                    <button className="icon-btn danger" onClick={() => confirmDelete(c.name) && (removeItem('creatives', c.id), toast('Criativo removido'))}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Insights creatives={creatives} creators={creators} settings={settings} />
      )}

      {editing && (
        <CreativeModal
          creative={editing}
          campaigns={campaigns}
          creators={creators}
          settings={settings}
          onSave={save}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  )
}

// ---------- Insights ----------
function Insights({ creatives, creators, settings }) {
  const withSpend = creatives.filter((c) => (c.metrics?.spend || 0) > 0)
  const byAngle = groupStats(withSpend, settings, (c) => c.angle, angleLabel)
  const byCreator = groupStats(withSpend.filter((c) => c.creatorId), settings, (c) => c.creatorId, (id) => creators.find((x) => x.id === id)?.name || 'Sem creator')
  const byPlatform = groupStats(withSpend, settings, (c) => c.platform, adPlatformLabel)

  const insights = buildInsights({ byAngle, byCreator, byPlatform, creatives: withSpend, settings })
  const maxRoas = Math.max(...byAngle.map((g) => g.roas || 0), 0.001)

  return (
    <>
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title"><Lightbulb size={13} /> Leituras automáticas dos seus dados</div>
        {insights.length === 0 ? (
          <Empty icon={Lightbulb} title="Ainda sem dados suficientes" text="Preencha investimento e receita de pelo menos 2 criativos para gerar insights." />
        ) : (
          insights.map((ins, i) => (
            <div key={i} className={cx('insight-card', ins.tone)}>
              <span className="ic-icon">{ins.tone === 'win' ? <Trophy size={15} /> : ins.tone === 'warn' ? <AlertTriangle size={15} /> : <Lightbulb size={15} />}</span>
              <span>{ins.text}</span>
            </div>
          ))
        )}
      </div>

      <div className="grid-3">
        <StatBlock title="ROAS por Angle" groups={byAngle} max={maxRoas} settings={settings} />
        <StatBlock title="ROAS por Creator" groups={byCreator} max={Math.max(...byCreator.map((g) => g.roas || 0), 0.001)} settings={settings} />
        <StatBlock title="ROAS por Plataforma" groups={byPlatform} max={Math.max(...byPlatform.map((g) => g.roas || 0), 0.001)} settings={settings} />
      </div>
    </>
  )
}

function StatBlock({ title, groups, max, settings }) {
  return (
    <div className="card">
      <div className="card-title">{title}</div>
      {groups.length === 0 && <div style={{ color: 'var(--text-3)', fontSize: 13 }}>Sem dados ainda.</div>}
      {groups.map((g) => (
        <div key={g.key} className="mini-bar-row">
          <span className="mb-label" title={g.label}>{g.label}</span>
          <div className="progress-bar">
            <div style={{ width: `${((g.roas || 0) / max) * 100}%`, background: (g.roas || 0) >= settings.targetRoas ? 'var(--green)' : 'var(--grad)' }} />
          </div>
          <span className="mb-value" style={{ color: (g.roas || 0) >= settings.targetRoas ? 'var(--green)' : undefined }}>
            {g.roas ? g.roas.toFixed(2) + 'x' : '—'}
          </span>
        </div>
      ))}
    </div>
  )
}

function buildInsights({ byAngle, byCreator, byPlatform, creatives, settings }) {
  const out = []
  const cur = settings.currency

  if (byAngle.length >= 2) {
    const best = byAngle[0]
    const worst = byAngle[byAngle.length - 1]
    if (best.roas && worst.roas != null && best.roas > worst.roas * 1.3) {
      out.push({
        tone: 'win',
        text: <>O angle <b>{best.label}</b> tem ROAS médio de <b>{best.roas.toFixed(2)}x</b> contra {worst.roas.toFixed(2)}x de <b>{worst.label}</b>. Brief novo: peça <b>2-3 variações de {best.label}</b> para creators diferentes.</>,
      })
    }
    const bestHook = [...byAngle].sort((a, b) => (b.hookRate || 0) - (a.hookRate || 0))[0]
    if (bestHook?.hookRate >= 25 && bestHook.key !== byAngle[0].key) {
      out.push({
        tone: 'info',
        text: <><b>{bestHook.label}</b> tem o melhor hook rate ({fmtPct(bestHook.hookRate, 0)}) mas não é o melhor em ROAS — o problema está <b>depois do gancho</b>. Teste trocar o meio do vídeo mantendo os 3 primeiros segundos.</>,
      })
    }
  }

  if (byCreator.length >= 2 && byCreator[0].roas >= settings.targetRoas) {
    const top = byCreator[0]
    out.push({
      tone: 'win',
      text: <><b>{top.label}</b> é seu creator mais lucrativo: ROAS {top.roas.toFixed(2)}x em {top.count} criativo(s). Feche um <b>pacote mensal recorrente</b> antes que um concorrente feche.</>,
    })
  }

  if (byPlatform.length >= 2) {
    const [a, b] = byPlatform
    if (a.roas && b.roas && a.roas > b.roas * 1.4) {
      out.push({
        tone: 'info',
        text: <>Seu dinheiro rende mais em <b>{a.label}</b> ({a.roas.toFixed(2)}x vs {b.roas.toFixed(2)}x em {b.label}). Considere realocar parte da verba — mas mantenha testes na outra fonte.</>,
      })
    }
  }

  const killList = creatives.filter((c) => computeVerdict(c, settings).key === 'kill')
  const killSpend = killList.reduce((a, c) => a + (Number(c.metrics?.spend) || 0), 0)
  if (killList.length > 0 && killSpend > 0) {
    out.push({
      tone: 'warn',
      text: <><b>{killList.length} criativo(s)</b> abaixo da meta já consumiram <b>{fmtMoney(killSpend, cur)}</b>. Pause-os e realoque nos vencedores — isso é dinheiro voltando pro seu ROAS geral.</>,
    })
  }

  const fatigued = creatives.filter((c) => computeVerdict(c, settings).key === 'fatigue')
  if (fatigued.length > 0) {
    out.push({
      tone: 'warn',
      text: <><b>{fatigued.length} vencedor(es) em risco de fadiga</b> (mais de {settings.fatigueDays} dias no ar). Regra de ouro: sempre tenha variações novas prontas ANTES do criativo campeão cansar.</>,
    })
  }

  return out
}

// ---------- Modal ----------
function CreativeModal({ creative, campaigns, creators, settings, onSave, onClose }) {
  const [form, setForm] = useState({ ...emptyCreative, ...creative, metrics: { ...emptyCreative.metrics, ...(creative.metrics || {}) } })
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })
  const setM = (k) => (e) => setForm({ ...form, metrics: { ...form.metrics, [k]: e.target.value } })

  const preview = computeMetrics({ ...form, metrics: Object.fromEntries(Object.entries(form.metrics).map(([k, v]) => [k, Number(v) || 0])) }, settings)

  return (
    <Modal
      title={form.id ? `Editar — ${form.name}` : 'Novo Criativo'}
      wide
      onClose={onClose}
      footer={
        <>
          <button className="btn ghost" onClick={onClose}>Cancelar</button>
          <button className="btn primary" disabled={!form.name.trim()} onClick={() => onSave(form)}>Salvar</button>
        </>
      }
    >
      <div className="form-grid">
        <Field label="Nome do criativo *" full><input value={form.name} onChange={set('name')} placeholder="Ex: Marina — Antes/Depois 21 dias" /></Field>
        <Field label="Campanha">
          <Select options={campaigns.map((c) => ({ key: c.id, label: c.name }))} value={form.campaignId} onChange={set('campaignId')} placeholder="Selecione…" />
        </Field>
        <Field label="Creator">
          <Select options={creators.map((c) => ({ key: c.id, label: c.name }))} value={form.creatorId} onChange={set('creatorId')} placeholder="Sem creator (estático/interno)" />
        </Field>
        <Field label="Plataforma de anúncio"><Select options={AD_PLATFORMS} value={form.platform} onChange={set('platform')} /></Field>
        <Field label="Angle"><Select options={ANGLES} value={form.angle} onChange={set('angle')} placeholder="—" /></Field>
        <Field label="Formato"><Select options={FORMATS} value={form.format} onChange={set('format')} /></Field>
        <Field label="Link do anúncio/post"><input value={form.url} onChange={set('url')} placeholder="https://…" /></Field>
        <Field label="Início da veiculação"><input type="date" value={form.startDate} onChange={set('startDate')} /></Field>
        <Field label="Direitos de uso até" hint="Deixe vazio se for conteúdo próprio/perpétuo.">
          <input type="date" value={form.rightsExpiry || ''} onChange={set('rightsExpiry')} />
        </Field>

        <Field label="— MÉTRICAS (copie do gerenciador de anúncios) —" full>
          <div className="form-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            <Field label={`Investido (${settings.currency})`}><input type="number" value={form.metrics.spend} onChange={setM('spend')} /></Field>
            <Field label="Impressões"><input type="number" value={form.metrics.impressions} onChange={setM('impressions')} /></Field>
            <Field label="Cliques"><input type="number" value={form.metrics.clicks} onChange={setM('clicks')} /></Field>
            <Field label="Compras"><input type="number" value={form.metrics.purchases} onChange={setM('purchases')} /></Field>
            <Field label={`Receita (${settings.currency})`}><input type="number" value={form.metrics.revenue} onChange={setM('revenue')} /></Field>
            <Field label="Hook rate (%)" hint="Views 3s ÷ impressões"><input type="number" value={form.metrics.hookRate} onChange={setM('hookRate')} /></Field>
            <Field label="Hold rate (%)" hint="Views 75% ÷ impressões"><input type="number" value={form.metrics.holdRate} onChange={setM('holdRate')} /></Field>
          </div>
        </Field>

        <Field label="Calculado em tempo real" full>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 10, padding: '12px 16px', fontSize: 13 }}>
            <span>ROAS: <b style={{ color: preview.roas >= settings.targetRoas ? 'var(--green)' : 'var(--yellow)' }}>{preview.roas ? preview.roas.toFixed(2) + 'x' : '—'}</b></span>
            <span>CPA: <b>{preview.cpa ? fmtMoney(preview.cpa, settings.currency) : '—'}</b></span>
            <span>CTR: <b>{fmtPct(preview.ctr, 2)}</b></span>
            <span>CPM: <b>{preview.cpm ? fmtMoney(preview.cpm, settings.currency) : '—'}</b></span>
          </div>
        </Field>

        <Field label="Notas" full><textarea value={form.notes} onChange={set('notes')} placeholder="Observações, hipóteses, próximos testes…" /></Field>
      </div>
    </Modal>
  )
}
