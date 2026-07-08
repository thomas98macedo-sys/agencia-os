// ============================================================
// CRIA·OS — Biblioteca de Hooks, CTAs e Angles comprovados
// Munição criativa pronta para copiar no próximo brief.
// ============================================================
import React, { useState } from 'react'
import { BookOpen, Copy, Sparkles, Megaphone } from 'lucide-react'
import { HOOK_LIBRARY, CTA_LIBRARY, ANGLES } from '../constants.js'
import { PageHeader, Badge, useToast, SearchBox } from '../ui.jsx'
import { cx } from '../util.js'

export default function Library() {
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('hooks')
  const toast = useToast()

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      toast('Copiado! Cole no seu brief.')
    } catch {
      toast('Não foi possível copiar automaticamente.')
    }
  }

  const q = query.trim().toLowerCase()
  const filteredHooks = HOOK_LIBRARY
    .map((cat) => ({ ...cat, hooks: cat.hooks.filter((h) => !q || h.toLowerCase().includes(q) || cat.cat.toLowerCase().includes(q)) }))
    .filter((cat) => cat.hooks.length > 0)

  return (
    <>
      <PageHeader
        icon={BookOpen}
        title="Biblioteca de Hooks"
        sub="Hooks, CTAs e angles validados pelo mercado. Substitua os [colchetes] pelo seu produto e cole no brief — os 3 primeiros segundos decidem tudo."
        actions={<SearchBox value={query} onChange={setQuery} placeholder="Buscar hook…" />}
      />

      <div className="tabs">
        <button className={cx('tab', tab === 'hooks' && 'active')} onClick={() => setTab('hooks')}>🪝 Hooks</button>
        <button className={cx('tab', tab === 'ctas' && 'active')} onClick={() => setTab('ctas')}>📣 CTAs</button>
        <button className={cx('tab', tab === 'angles' && 'active')} onClick={() => setTab('angles')}>🎯 Angles</button>
      </div>

      {tab === 'hooks' && (
        <div style={{ display: 'grid', gap: 16 }}>
          {filteredHooks.map((cat) => (
            <div key={cat.cat} className="card">
              <div className="card-title"><Sparkles size={13} /> {cat.cat}</div>
              <div style={{ display: 'grid', gap: 8 }}>
                {cat.hooks.map((h, i) => (
                  <div key={i} className="alert-row" style={{ margin: 0, cursor: 'pointer' }} onClick={() => copy(h)}>
                    <span className="alert-text">“{h}”</span>
                    <button className="icon-btn" title="Copiar"><Copy size={14} /></button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'ctas' && (
        <div className="card">
          <div className="card-title"><Megaphone size={13} /> CTAs que convertem</div>
          <div style={{ display: 'grid', gap: 8 }}>
            {CTA_LIBRARY.filter((c) => !q || c.toLowerCase().includes(q)).map((c, i) => (
              <div key={i} className="alert-row" style={{ margin: 0, cursor: 'pointer' }} onClick={() => copy(c)}>
                <span className="alert-text">“{c}”</span>
                <button className="icon-btn" title="Copiar"><Copy size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'angles' && (
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {ANGLES.filter((a) => !q || a.label.toLowerCase().includes(q) || a.desc.toLowerCase().includes(q)).map((a) => (
            <div key={a.key} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Badge color="purple">{a.label}</Badge>
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.55 }}>{a.desc}</div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
