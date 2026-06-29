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
        {/* Logo — matches .bx-side__top from portal.css */}
        <div style={{
          height: 'var(--bx-topbar)',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '11px',
          padding: '0 18px',
          borderBottom: '1px solid var(--bx-line-2)',
        }}>
          {/* .bx-side__logo: 34px, radius 9px, purple gradient */}
          <div style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            flexShrink: 0,
            background: 'linear-gradient(160deg, #2E1442, #442061)',
            display: 'grid',
            placeItems: 'center',
            boxShadow: 'var(--bx-shadow-sm)',
          }}>
            <img
              src="/bix-logo.png"
              alt="BIX"
              width={20}
              height={20}
              style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
            />
          </div>

          {sidebarOpen && (
            <>
              {/* .bx-side__name */}
              <div style={{ lineHeight: 1.15, minWidth: 0, flex: 1 }}>
                <b style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 600, fontSize: 14, display: 'block', color: 'var(--bx-ink)' }}>
                  BIX
                </b>
                <span style={{ fontSize: 11, color: 'var(--bx-muted)' }}>Agency Console</span>
              </div>
              <button
                className="lg:hidden"
                style={{ color: 'var(--bx-faint)', padding: 4 }}
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
