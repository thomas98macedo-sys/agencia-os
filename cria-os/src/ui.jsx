// ============================================================
// CRIA·OS — componentes de UI compartilhados
// ============================================================
import React, { useEffect, useState, createContext, useContext, useCallback } from 'react'
import { X, Check, Star, Search, Inbox } from 'lucide-react'
import { cx } from './util.js'

// ---------- Toast ----------
const ToastCtx = createContext(() => {})
export const useToast = () => useContext(ToastCtx)

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState(null)
  const show = useCallback((text) => {
    setMsg(text)
  }, [])
  useEffect(() => {
    if (!msg) return
    const t = setTimeout(() => setMsg(null), 2600)
    return () => clearTimeout(t)
  }, [msg])
  return (
    <ToastCtx.Provider value={show}>
      {children}
      {msg && (
        <div className="toast">
          <Check size={15} className="check" /> {msg}
        </div>
      )}
    </ToastCtx.Provider>
  )
}

// ---------- Modal ----------
export function Modal({ title, onClose, children, footer, wide }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={cx('modal', wide && 'wide')}>
        <div className="modal-header">
          <div className="modal-title">{title}</div>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  )
}

// ---------- Form fields ----------
export function Field({ label, hint, full, children }) {
  return (
    <div className={cx('field', full && 'full')}>
      {label && <label>{label}</label>}
      {children}
      {hint && <div className="hint">{hint}</div>}
    </div>
  )
}

export function Input(props) {
  return <input {...props} />
}

export function Select({ options, value, onChange, placeholder, ...rest }) {
  return (
    <select value={value ?? ''} onChange={onChange} {...rest}>
      {placeholder != null && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.key ?? o.value} value={o.key ?? o.value}>{o.label}</option>
      ))}
    </select>
  )
}

// ---------- Badge ----------
export function Badge({ color = 'gray', children }) {
  return <span className={cx('badge', color)}>{children}</span>
}

// ---------- Avatar ----------
export function Avatar({ name, size }) {
  const initials = (name || '?')
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
  return <span className={cx('avatar', size)}>{initials}</span>
}

// ---------- Stars ----------
export function Stars({ value = 0, onChange, size = 15 }) {
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={cx('star', n <= value && 'on')}
          fill={n <= value ? 'currentColor' : 'none'}
          onClick={onChange ? (e) => { e.stopPropagation(); onChange(n === value ? 0 : n) } : undefined}
        />
      ))}
    </span>
  )
}

// ---------- Search ----------
export function SearchBox({ value, onChange, placeholder = 'Buscar…' }) {
  return (
    <div className="search-input">
      <Search size={14} color="var(--text-3)" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  )
}

// ---------- Empty state ----------
export function Empty({ icon: Icon = Inbox, title, text, action }) {
  return (
    <div className="empty">
      <div className="empty-icon"><Icon size={26} /></div>
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </div>
  )
}

// ---------- Page header ----------
export function PageHeader({ title, icon: Icon, sub, actions }) {
  return (
    <div className="page-header">
      <div>
        <div className="page-title">{Icon && <Icon size={22} color="var(--accent)" />}{title}</div>
        {sub && <div className="page-sub">{sub}</div>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  )
}

// ---------- KPI ----------
export function Kpi({ label, value, sub, icon: Icon, highlight, valueClass }) {
  return (
    <div className={cx('kpi', highlight && 'highlight')}>
      <div className="kpi-label">{Icon && <Icon size={12} />}{label}</div>
      <div className={cx('kpi-value', valueClass)}>{value}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </div>
  )
}

// ---------- Score colorido ----------
export function Score({ value }) {
  if (value == null) return <span style={{ color: 'var(--text-3)' }}>—</span>
  const color = value >= 70 ? 'var(--green)' : value >= 45 ? 'var(--yellow)' : 'var(--red)'
  return <span className="score-ring" style={{ color }}>{value}</span>
}

// ---------- confirm helper ----------
export function confirmDelete(label) {
  return window.confirm(`Excluir ${label}? Essa ação não pode ser desfeita.`)
}
