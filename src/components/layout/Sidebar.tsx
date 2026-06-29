import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, Megaphone, Briefcase, FolderKanban,
  Receipt, CalendarDays, Settings, ChevronLeft, ChevronRight, X
} from 'lucide-react'
import { useConsoleStore } from '@/store/useConsoleStore'

const groups = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
    ]
  },
  {
    label: 'Growth',
    items: [
      { label: 'Leads', icon: Users, to: '/leads' },
      { label: 'Nurture', icon: Megaphone, to: '/nurture' },
    ]
  },
  {
    label: 'Delivery',
    items: [
      { label: 'Clients', icon: Briefcase, to: '/clients' },
      { label: 'Projects', icon: FolderKanban, to: '/projects' },
    ]
  },
  {
    label: 'Business',
    items: [
      { label: 'Invoices', icon: Receipt, to: '/invoices' },
      { label: 'Calendar', icon: CalendarDays, to: '/calendar' },
    ]
  },
  {
    label: 'Account',
    items: [
      { label: 'Settings', icon: Settings, to: '/settings' },
    ]
  },
]

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useConsoleStore()

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-30 bg-[var(--color-ink)]/30 lg:hidden transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`
        fixed lg:relative z-40 flex flex-col
        bg-[var(--color-surface)] border-r border-[var(--color-hairline)]
        transition-[width,transform] duration-240 ease-[cubic-bezier(0.22,1,0.36,1)]
        h-full shrink-0 overflow-hidden
        ${sidebarOpen ? 'w-[252px] translate-x-0' : 'w-[252px] -translate-x-full lg:w-[60px] lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 h-[60px] border-b border-[var(--color-hairline)] shrink-0">
          <div className="w-8 h-8 rounded-[var(--radius-base)] bg-[var(--color-purple)] flex items-center justify-center shrink-0">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M5 4h6a4 4 0 0 1 0 8H5V4z" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M5 12h6.5a4 4 0 0 1 0 8H5v-8z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" opacity=".6"/>
            </svg>
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <div className="text-[14px] font-semibold font-[var(--font-display)] text-[var(--color-ink)] leading-tight whitespace-nowrap">Bix</div>
              <div className="text-[10px] text-[var(--color-muted)] whitespace-nowrap tracking-wide">Agency Console</div>
            </div>
          )}
          {/* Mobile close */}
          <button className="ml-auto lg:hidden p-1 text-[var(--color-muted)]" onClick={() => setSidebarOpen(false)}>
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {groups.map(g => (
            <div key={g.label} className="mb-4">
              {sidebarOpen && (
                <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-[var(--color-faint)] px-2 mb-1">{g.label}</p>
              )}
              {g.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-2 py-2 rounded-[var(--radius-base)] transition-all duration-150 group ${
                      isActive
                        ? 'bg-[var(--color-purple-soft)] text-[var(--color-purple)]'
                        : 'text-[var(--color-muted)] hover:bg-[rgba(20,16,31,0.05)] hover:text-[var(--color-ink)]'
                    }`
                  }
                  title={!sidebarOpen ? item.label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon size={16} className={`shrink-0 ${isActive ? 'text-[var(--color-purple)]' : ''}`} />
                      {sidebarOpen && (
                        <span className="text-[13px] font-medium whitespace-nowrap">{item.label}</span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Collapse toggle (desktop) */}
        <div className="hidden lg:flex items-center justify-end px-2 py-3 border-t border-[var(--color-hairline)]">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-[var(--radius-base)] text-[var(--color-faint)] hover:bg-[var(--color-bg)] hover:text-[var(--color-ink)] transition-colors"
          >
            {sidebarOpen ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
          </button>
        </div>
      </aside>
    </>
  )
}
