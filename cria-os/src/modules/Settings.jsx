// ============================================================
// CRIA·OS — Configurações: metas, marca, backup e reset
// ============================================================
import React, { useRef, useState } from 'react'
import { Settings as SettingsIcon, Download, Upload, RefreshCcw, Eraser, Target } from 'lucide-react'
import { useStore, updateSettings, exportJson, importJson, resetToDemo, resetEmpty } from '../store.js'
import { PageHeader, Field, useToast } from '../ui.jsx'
import { todayIso } from '../util.js'

export default function Settings() {
  const { settings } = useStore()
  const toast = useToast()
  const fileRef = useRef(null)
  const [form, setForm] = useState({ ...settings })
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const save = () => {
    updateSettings({
      brand: form.brand || 'Minha Marca',
      currency: form.currency || 'R$',
      targetRoas: Number(form.targetRoas) || 2,
      targetCpa: Number(form.targetCpa) || 60,
      minSpendToScale: Number(form.minSpendToScale) || 500,
      fatigueDays: Number(form.fatigueDays) || 21,
      rightsAlertDays: Number(form.rightsAlertDays) || 15,
    })
    toast('Configurações salvas')
  }

  const doExport = () => {
    const blob = new Blob([exportJson()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cria-os-backup-${todayIso()}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast('Backup exportado')
  }

  const doImport = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        importJson(String(reader.result))
        toast('Backup importado com sucesso')
      } catch (err) {
        alert('Erro ao importar: ' + err.message)
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <>
      <PageHeader
        icon={SettingsIcon}
        title="Configurações"
        sub="As metas abaixo alimentam o score, os vereditos e os alertas de todo o sistema. Ajuste para a realidade da sua operação."
      />

      <div className="grid-2">
        <div className="card">
          <div className="card-title"><Target size={13} /> Marca & Metas</div>
          <div className="form-grid">
            <Field label="Nome da marca / loja"><input value={form.brand} onChange={set('brand')} /></Field>
            <Field label="Moeda"><input value={form.currency} onChange={set('currency')} /></Field>
            <Field label="ROAS alvo" hint="Acima disso = escalar."><input type="number" step="0.1" value={form.targetRoas} onChange={set('targetRoas')} /></Field>
            <Field label="CPA máximo (R$)" hint="Custo por compra aceitável."><input type="number" value={form.targetCpa} onChange={set('targetCpa')} /></Field>
            <Field label="Investimento mínimo p/ julgar (R$)" hint="Antes disso o criativo fica como 'Testando'."><input type="number" value={form.minSpendToScale} onChange={set('minSpendToScale')} /></Field>
            <Field label="Dias até alerta de fadiga" hint="Vencedores no ar há mais que isso geram alerta."><input type="number" value={form.fatigueDays} onChange={set('fatigueDays')} /></Field>
            <Field label="Alerta de direitos (dias antes)" hint="Avisa X dias antes dos direitos de uso vencerem."><input type="number" value={form.rightsAlertDays} onChange={set('rightsAlertDays')} /></Field>
          </div>
          <div style={{ marginTop: 16 }}>
            <button className="btn primary" onClick={save}>Salvar configurações</button>
          </div>
        </div>

        <div className="card">
          <div className="card-title"><Download size={13} /> Backup & Dados</div>
          <p style={{ color: 'var(--text-2)', fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
            Seus dados ficam salvos <b>neste navegador</b> (localStorage). Exporte um backup regularmente
            e importe em qualquer outro dispositivo para migrar tudo.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start' }}>
            <button className="btn" onClick={doExport}><Download size={14} /> Exportar backup (.json)</button>
            <button className="btn" onClick={() => fileRef.current?.click()}><Upload size={14} /> Importar backup</button>
            <input ref={fileRef} type="file" accept="application/json" style={{ display: 'none' }} onChange={doImport} />
            <hr style={{ width: '100%', border: 'none', borderTop: '1px solid var(--border)', margin: '6px 0' }} />
            <button
              className="btn"
              onClick={() => window.confirm('Substituir TODOS os dados atuais pelos dados de demonstração?') && (resetToDemo(), toast('Dados demo restaurados'))}
            >
              <RefreshCcw size={14} /> Restaurar dados de demonstração
            </button>
            <button
              className="btn danger"
              onClick={() => window.confirm('Apagar TODOS os dados e começar do zero? Faça um backup antes!') && (resetEmpty(), toast('Base zerada'))}
            >
              <Eraser size={14} /> Zerar tudo (começar do zero)
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
