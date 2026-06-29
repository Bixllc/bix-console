import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, UserPlus, Megaphone, Users, FolderOpen,
  DollarSign, CalendarDays, Settings, ChevronDown, X
} from 'lucide-react'
import { useConsoleStore } from '@/store/useConsoleStore'

const groups = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', icon: LayoutDashboard, to: '/' }],
  },
  {
    label: 'Growth',
    items: [
      { label: 'Leads',   icon: UserPlus,  to: '/leads'   },
      { label: 'Nurture', icon: Megaphone, to: '/nurture' },
    ],
  },
  {
    label: 'Delivery',
    items: [
      { label: 'Clients',  icon: Users,      to: '/clients'  },
      { label: 'Projects', icon: FolderOpen, to: '/projects' },
    ],
  },
  {
    label: 'Business',
    items: [
      { label: 'Invoices & Revenue', icon: DollarSign,   to: '/invoices' },
      { label: 'Calendar',           icon: CalendarDays, to: '/calendar' },
    ],
  },
  {
    label: 'Account',
    items: [{ label: 'Settings', icon: Settings, to: '/settings' }],
  },
]

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useConsoleStore()

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-30 lg:hidden transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ background: 'rgba(20,16,31,0.4)' }}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`
          fixed lg:relative z-40 flex flex-col h-full shrink-0 overflow-hidden
          transition-[width,transform] duration-240
          ${sidebarOpen ? 'w-[var(--bx-sidebar)] translate-x-0' : 'w-[var(--bx-sidebar)] -translate-x-full lg:w-[60px] lg:translate-x-0'}
        `}
        style={{
          background: 'var(--bx-surface)',
          borderRight: '1px solid var(--bx-line)',
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 px-4 shrink-0"
          style={{ height: 'var(--bx-topbar)', borderBottom: '1px solid var(--bx-line)' }}
        >
          <div
            className="w-8 h-8 rounded-[var(--bx-r)] flex items-center justify-center shrink-0"
            style={{ background: 'var(--bx-purple)' }}
          >
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
              <path d="M5 3h7a4 4 0 0 1 0 8H5V3z" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M5 11h7.5a4 4 0 0 1 0 8H5v-8z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" opacity=".65"/>
            </svg>
          </div>

          {sidebarOpen && (
            <>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span
                    className="text-[14px] font-bold tracking-wide"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--bx-ink)' }}
                  >
                    BIX
                  </span>
                  <span
                    className="text-[9px] font-semibold px-1.5 py-0.5 rounded-[4px] tracking-wider uppercase"
                    style={{ background: 'var(--bx-purple)', color: 'var(--bx-surface)' }}
                  >
                    Admin
                  </span>
                </div>
                <div className="text-[10px] tracking-wide" style={{ color: 'var(--bx-muted)' }}>
                  Agency Console
                </div>
              </div>
              <button
                className="p-1 lg:hidden"
                style={{ color: 'var(--bx-faint)' }}
                onClick={() => setSidebarOpen(false)}
              >
                <X size={15} />
              </button>
            </>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          {groups.map(g => (
            <div key={g.label} className="mb-5">
              {sidebarOpen && (
                <p
                  className="text-[10px] font-semibold tracking-[0.12em] uppercase px-2 mb-1.5"
                  style={{ color: 'var(--bx-faint)' }}
                >
                  {g.label}
                </p>
              )}
              {g.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                  className="flex items-center gap-2.5 px-2 py-2 rounded-[var(--bx-r)] transition-all duration-150 mb-0.5"
                  style={({ isActive }) => ({
                    background: isActive ? 'var(--bx-purple-soft)' : 'transparent',
                    color: isActive ? 'var(--bx-purple)' : 'var(--bx-muted)',
                  })}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        size={15}
                        className="shrink-0"
                        style={{ color: isActive ? 'var(--bx-purple)' : 'var(--bx-muted)' }}
                      />
                      {sidebarOpen && (
                        <span
                          className="text-[13px] font-medium whitespace-nowrap leading-none"
                          style={{ color: isActive ? 'var(--bx-purple)' : 'var(--bx-ink-2)' }}
                        >
                          {item.label}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* User */}
        {sidebarOpen && (
          <div className="px-3 py-4 shrink-0" style={{ borderTop: '1px solid var(--bx-line)' }}>
            <button
              className="flex items-center gap-2.5 w-full px-1 py-1 rounded-[var(--bx-r)] transition-colors group"
              style={{ background: 'transparent' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bx-bg)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                style={{ background: 'var(--bx-purple)', color: 'var(--bx-surface)' }}
              >
                CR
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-[12px] font-semibold truncate leading-tight" style={{ color: 'var(--bx-ink)' }}>
                  Cam Rivera
                </div>
                <div className="text-[10px] truncate leading-tight" style={{ color: 'var(--bx-faint)' }}>
                  Founder
                </div>
              </div>
              <ChevronDown size={13} style={{ color: 'var(--bx-faint)' }} className="shrink-0" />
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
