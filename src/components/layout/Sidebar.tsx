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

        {/* Nav — matches .bx-side__nav / .bx-nav-item from portal.css */}
        <nav className="flex-1 overflow-y-auto" style={{ padding: '14px 12px 8px' }}>
          {groups.map(g => (
            <div key={g.label} style={{ marginBottom: 4 }}>
              {sidebarOpen && (
                <div style={{
                  fontSize: 10,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--bx-faint)',
                  fontWeight: 600,
                  padding: '12px 12px 6px',
                }}>
                  {g.label}
                </div>
              )}
              {g.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                  className={({ isActive }) => `bx-nav-item${isActive ? ' is-active' : ''}`}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <item.icon size={18} />
                  {sidebarOpen && item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* User footer — bx-side__foot */}
        {sidebarOpen && (
          <div style={{ padding: 12, borderTop: '1px solid var(--bx-line-2)', flexShrink: 0 }}>
            <button
              className="bx-side__user w-full text-left"
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, borderRadius: 8, cursor: 'pointer', background: 'transparent', border: 0, width: '100%', transition: 'background 160ms' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bx-bg)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {/* Avatar — bx-av */}
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(160deg, #2E1442, #442061)',
                color: '#fff', fontSize: 12, fontWeight: 600,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                CR
              </div>
              {/* Text — bx-side__user-meta */}
              <div style={{ minWidth: 0, flex: 1, lineHeight: 1.2 }}>
                <b style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'var(--bx-ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Cam Rivera
                </b>
                <span style={{ display: 'block', fontSize: '11.5px', color: 'var(--bx-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Founder
                </span>
              </div>
              <ChevronDown size={16} style={{ color: 'var(--bx-faint)', flexShrink: 0 }} />
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
