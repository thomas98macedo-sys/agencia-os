// Ícones de traço simples para os diferenciais (sem dependências externas)
const P = {
  eng: <><path d="M4 18h16" /><path d="M6 18v-3a6 6 0 0 1 12 0v3" /><path d="M10 9V6h4v3" /><path d="M9 12.5l-1.5 1.5" /></>,
  doc: <><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4" /><path d="M10 12h5M10 15.5h5M10 8.5h2" /></>,
  cal: <><rect x="4" y="5.5" width="16" height="14.5" rx="1.5" /><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4" /><path d="M9 14.5l2 2 4-4" /></>,
  chat: <><path d="M4 5.5h16v10H10l-4 3.5v-3.5H4z" /><path d="M8 9.5h8M8 12h5" /></>,
  swap: <><path d="M5 8h12l-3-3M19 16H7l3 3" /></>,
  check: <><circle cx="12" cy="12" r="8" /><path d="M8.5 12.2l2.4 2.4 4.6-4.8" /></>,
}

export function Icon({ name, size = 20, color = 'currentColor', stroke = 1.6 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block', flex: 'none' }}>
      {P[name]}
    </svg>
  )
}
