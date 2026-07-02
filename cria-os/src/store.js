// ============================================================
// CRIA·OS — Store central com persistência em localStorage
// Pub/sub simples + hook useStore para componentes React.
// ============================================================
import { useSyncExternalStore } from 'react'
import { seedData } from './seed.js'

const DB_KEY = 'cria_os_db_v1'

const defaultSettings = {
  brand: 'Minha Marca',
  currency: 'R$',
  targetRoas: 2.0,       // ROAS alvo para considerar "escalar"
  targetCpa: 60,         // CPA máximo aceitável (R$)
  minSpendToScale: 500,  // investimento mínimo antes de julgar um criativo
  fatigueDays: 21,       // dias no ar até alerta de fadiga
  rightsAlertDays: 15,   // alerta de direitos expirando em X dias
  onboarded: false,
}

const emptyDb = {
  settings: { ...defaultSettings },
  creators: [],
  campaigns: [],
  briefs: [],
  deliverables: [],
  creatives: [],
  payments: [],
}

function load() {
  try {
    const raw = localStorage.getItem(DB_KEY)
    if (!raw) {
      const db = { ...emptyDb, ...seedData(), settings: { ...defaultSettings } }
      localStorage.setItem(DB_KEY, JSON.stringify(db))
      return db
    }
    const parsed = JSON.parse(raw)
    return { ...emptyDb, ...parsed, settings: { ...defaultSettings, ...(parsed.settings || {}) } }
  } catch (e) {
    console.error('CRIA·OS: falha ao ler localStorage, iniciando vazio.', e)
    return { ...emptyDb }
  }
}

let state = load()
const listeners = new Set()

function persist() {
  try {
    localStorage.setItem(DB_KEY, JSON.stringify(state))
  } catch (e) {
    console.error('CRIA·OS: falha ao salvar.', e)
  }
}

function emit() {
  persist()
  listeners.forEach((l) => l())
}

export function getState() {
  return state
}

export function setState(updater) {
  state = typeof updater === 'function' ? updater(state) : { ...state, ...updater }
  emit()
}

export function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useStore(selector = (s) => s) {
  return useSyncExternalStore(subscribe, () => selector(state))
}

// ---------- helpers CRUD genéricos ----------
export function uid(prefix = 'id') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function addItem(collection, item) {
  const withId = { id: uid(collection.slice(0, 3)), createdAt: new Date().toISOString(), ...item }
  setState((s) => ({ ...s, [collection]: [withId, ...s[collection]] }))
  return withId
}

export function updateItem(collection, id, patch) {
  setState((s) => ({
    ...s,
    [collection]: s[collection].map((it) => (it.id === id ? { ...it, ...patch } : it)),
  }))
}

export function removeItem(collection, id) {
  setState((s) => ({ ...s, [collection]: s[collection].filter((it) => it.id !== id) }))
}

export function updateSettings(patch) {
  setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }))
}

// ---------- export / import / reset ----------
export function exportJson() {
  return JSON.stringify(state, null, 2)
}

export function importJson(text) {
  const parsed = JSON.parse(text)
  if (!parsed || typeof parsed !== 'object' || !Array.isArray(parsed.creators)) {
    throw new Error('Arquivo inválido: não parece um backup do CRIA·OS.')
  }
  state = { ...emptyDb, ...parsed, settings: { ...defaultSettings, ...(parsed.settings || {}) } }
  emit()
}

export function resetToDemo() {
  state = { ...emptyDb, ...seedData(), settings: { ...defaultSettings } }
  emit()
}

export function resetEmpty() {
  state = JSON.parse(JSON.stringify(emptyDb))
  emit()
}
