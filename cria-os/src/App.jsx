// ============================================================
// CRIA·OS — Shell principal (sidebar + roteamento por estado)
// ============================================================
import React, { useState } from 'react'
import {
  LayoutDashboard, Users, Megaphone, FileText, Kanban, Flame,
  Wallet, BookOpen, Settings as SettingsIcon,
} from 'lucide-react'
import { useStore } from './store.js'
import { ToastProvider } from './ui.jsx'
import { computeAlerts } from './modules/alerts.jsx'

import Dashboard from './modules/Dashboard.jsx'
import Creators from './modules/Creators.jsx'
import Campaigns from './modules/Campaigns.jsx'
import Briefs from './modules/Briefs.jsx'
import Pipeline from './modules/Pipeline.jsx'
import Creatives from './modules/Creatives.jsx'
import Finance from './modules/Finance.jsx'
import Library from './modules/Library.jsx'
import Settings from './modules/Settings.jsx'

const NAV = [
  { section: 'Visão Geral' },
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, comp: Dashboard },
  { section: 'Operação' },
  { key: 'creators', label: 'Creators', icon: Users, comp: Creators },
  { key: 'campaigns', label: 'Campanhas', icon: Megaphone, comp: Campaigns },
  { key: 'briefs', label: 'Briefings', icon: FileText, comp: Briefs },
  { key: 'pipeline', label: 'Produção', icon: Kanban, comp: Pipeline },
  { section: 'Inteligência' },
  { key: 'creatives', label: 'Criativos', icon: Flame, comp: Creatives },
  { section: 'Gestão' },
  { key: 'finance', label: 'Direitos & Pagamentos', icon: Wallet, comp: Finance },
  { key: 'library', label: 'Biblioteca de Hooks', icon: BookOpen, comp: Library },
  { section: 'Sistema' },
  { key: 'settings', label: 'Configurações', icon: SettingsIcon, comp: Settings },
]

export default function App() {
  const [page, setPage] = useState('dashboard')
  const state = useStore()
  const alerts = computeAlerts(state)

  const active = NAV.find((n) => n.key === page) || NAV[1]
  const Comp = active.comp

  return (
    <ToastProvider>
      <div className="app">
        <aside className="sidebar">
          <div className="logo">
            <div className="logo-mark">C</div>
            <div>
              <div className="logo-name">CRIA<span>·OS</span></div>
              <div className="logo-sub">UGC & Criativos</div>
            </div>
          </div>
          <nav className="nav">
            {NAV.map((item, i) =>
              item.section ? (
                <div key={i} className="nav-section">{item.section}</div>
              ) : (
                <button
                  key={item.key}
                  className={`nav-item ${page === item.key ? 'active' : ''}`}
                  onClick={() => setPage(item.key)}
                >
                  <item.icon size={17} />
                  <span className="nav-label">{item.label}</span>
                  {item.key === 'dashboard' && alerts.length > 0 && (
                    <span className="badge-count">{alerts.length}</span>
                  )}
                </button>
              ),
            )}
          </nav>
          <div className="sidebar-footer">
            {state.settings.brand} · CRIA·OS v1.0
          </div>
        </aside>
        <main className="main">
          <Comp go={setPage} />
        </main>
      </div>
    </ToastProvider>
  )
}
