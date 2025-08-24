import { Home, List, FilePlus, BarChart2, Repeat, Settings, Menu, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useState } from 'react'

export default function Sidebar() {
  const [open, setOpen] = useState(false)

  const items = [
    { to: '/', label: 'Dashboard', icon: Home },
    { to: '/animals', label: 'All Animals', icon: List },
    { to: '/quick-entry', label: 'Quick Entry', icon: FilePlus },
    { to: '/reports', label: 'Animal Reports', icon: BarChart2 },
    { to: '/transfers', label: 'Transfers', icon: Repeat },
    { to: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <>
      <button className="md:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded shadow" onClick={() => setOpen(!open)} aria-label="Toggle menu">
        <Menu className="w-5 h-5 text-emerald-600" />
      </button>

      <aside className={`${open ? 'fixed left-0 top-0 bottom-0 z-50 w-56' : 'hidden'} md:block md:relative md:w-52 bg-white/90 border-r border-white/40 p-4`}>
        {/* mobile close button inside drawer */}
        <div className="md:hidden flex justify-end">
          <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-2 rounded bg-gray-100">
            <X className="w-4 h-4 text-gray-700" />
          </button>
        </div>
        <div className="mb-6 flex items-center space-x-3">
          {/* larger logo to match login scale */}
          <img src="/images/logo-64.svg" alt="Zoo logo" className="h-14 w-14" />
          <div>
            <h3 className="text-2xl font-bold text-[color:var(--sidebar-primary)]">ZMS</h3>
            <p className="text-xs text-gray-500 mt-1">Management System</p>
          </div>
        </div>

        <nav className="space-y-1">
          {items.map((it) => {
            const Icon = it.icon
            return (
              <NavLink
                key={it.to}
                to={it.to}
                end
                className={({ isActive }) => `flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-emerald-50 ${isActive ? 'bg-emerald-100 font-semibold text-emerald-700' : 'text-gray-700'}`}>
                <Icon className="w-5 h-5 text-emerald-600" />
                <span className="font-medium">{it.label}</span>
              </NavLink>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
