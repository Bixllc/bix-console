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
        className={`fixed inset-0 z-30 lg:hidden transition-opacity duration-200 ${sidebarOpen ? 'opacity-100 bg-black/40' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        style={{ background: '#130C1F' }}
        className={`
          fixed lg:relative z-40 flex flex-col h-full shrink-0 overflow-hidden
          transition-[width,transform] duration-240 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${sidebarOpen ? 'w-[240px] translate-x-0' : 'w-[240px] -translate-x-full lg:w-[60px] lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 h-[60px] shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {/* B icon */}
          <div className="w-8 h-8 rounded-[10px] bg-[var(--color-purple)] flex items-center justify-center shrink-0">
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
              <path d="M5 3h7a4 4 0 0 1 0 8H5V3z" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
              <path d="M5 11h7.5a4 4 0 0 1 0 8H5v-8z" stroke="white" strokeWidth="1.8" strokeLinejoin="round" opacity=".65"/>
            </svg>
          </div>

          {sidebarOpen && (
            <>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-bold text-white font-[var(--font-display)] tracking-wide">BIX</span>
                  <span className="text-[9px] font-semibold bg-[var(--color-purple)] text-white px-1.5 py-0.5 rounded-[4px] tracking-wider uppercase">Admin</span>
                </div>
                <div className="text-[10px] tracking-wide" style={{ color: 'rgba(255,255,255,0.4)' }}>Agency Console</div>
              </div>
              <button className="p-1 lg:hidden" style={{ color: 'rgba(255,255,255,0.4)' }} onClick={() => setSidebarOpen(false)}>
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
                  style={{ color: 'rgba(255,255,255,0.32)' }}
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
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-2 py-2 rounded-[10px] transition-all duration-150 mb-0.5 group ${
                      isActive
                        ? 'text-white'
                        : 'hover:text-white'
                    }`
                  }
                  style={({ isActive }) => ({
                    background: isActive ? 'rgba(255,255,255,0.10)' : 'transparent',
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.45)',
                  })}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        size={15}
                        className="shrink-0"
                        style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.45)' }}
                      />
                      {sidebarOpen && (
                        <span className="text-[13px] font-medium whitespace-nowrap leading-none">
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
          <div
            className="px-3 py-4 shrink-0"
            style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
          >
            <button className="flex items-center gap-2.5 w-full px-1 py-1 rounded-[10px] transition-colors hover:bg-white/5 group">
              <div className="w-7 h-7 rounded-full bg-[var(--color-purple)] flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                CR
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-[12px] font-semibold text-white truncate leading-tight">Cam Rivera</div>
                <div className="text-[10px] truncate leading-tight" style={{ color: 'rgba(255,255,255,0.4)' }}>Founder</div>
              </div>
              <ChevronDown size={13} style={{ color: 'rgba(255,255,255,0.3)' }} className="shrink-0" />
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
