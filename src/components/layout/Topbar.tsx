import { useState } from 'react'
import { Search, Bell, Megaphone, Menu } from 'lucide-react'
import { useConsoleStore } from '@/store/useConsoleStore'
import { useLocation, useNavigate } from 'react-router-dom'

const pages: Record<string, { title: string; sub: string }> = {
  '/':          { title: 'Dashboard',           sub: 'Agency overview'          },
  '/leads':     { title: 'Leads',               sub: 'Your pipeline'            },
  '/nurture':   { title: 'Nurture',             sub: 'Campaigns & outreach'     },
  '/clients':   { title: 'Clients',             sub: 'Client accounts'          },
  '/projects':  { title: 'Projects',            sub: 'Active & delivered work'  },
  '/invoices':  { title: 'Invoices & Revenue',  sub: 'Revenue tracker'          },
  '/calendar':  { title: 'Calendar',            sub: 'Your schedule'            },
  '/settings':  { title: 'Settings',            sub: 'Account & preferences'    },
}

export function Topbar() {
  const { setSidebarOpen, sidebarOpen } = useConsoleStore()
  const location = useLocation()
  const navigate = useNavigate()
  const page = pages[location.pathname] ?? { title: 'Console', sub: '' }
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <header
      className="flex items-center shrink-0 z-20"
      style={{
        height: 'var(--bx-topbar)',
        gap: '14px',
        padding: '0 26px',
        background: 'rgba(246,245,248,0.82)',
        backdropFilter: 'blur(14px) saturate(140%)',
        WebkitBackdropFilter: 'blur(14px) saturate(140%)',
        borderBottom: '1px solid var(--bx-line)',
      }}
    >
      {/* Mobile hamburger */}
      <button
        className="lg:hidden p-1.5 rounded-[var(--radius-sm)] text-[var(--color-muted)] hover:bg-[var(--color-bg)]"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu size={17} />
      </button>

      {/* Page title */}
      <div className="shrink-0">
        <h1 className="text-[15px] font-semibold text-[var(--color-ink)] leading-tight">{page.title}</h1>
        <p className="text-[11px] text-[var(--color-muted)] leading-tight">{page.sub}</p>
      </div>

      {/* Search */}
      <div
        className={`flex items-center gap-2 h-8 px-3 rounded-[var(--radius-base)] border transition-all duration-150 ${
          searchFocused
            ? 'border-[var(--color-purple)] shadow-[0_0_0_3px_var(--color-purple-soft)] bg-white w-64'
            : 'border-[var(--color-hairline)] bg-[var(--color-bg)] w-52'
        }`}
      >
        <Search size={12} className="text-[var(--color-faint)] shrink-0" />
        <input
          className="bg-transparent outline-none text-[12px] text-[var(--color-ink)] placeholder:text-[var(--color-faint)] w-full font-[var(--font-sans)]"
          placeholder="Search clients, leads, campaigns…"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          onKeyDown={e => e.key === 'Escape' && e.currentTarget.blur()}
        />
        {!searchFocused && (
          <kbd className="shrink-0 text-[10px] text-[var(--color-faint)] border border-[var(--color-hairline)] rounded px-1 py-0.5 font-[var(--font-mono)] leading-none">⌘K</kbd>
        )}
      </div>

      <div className="flex-1" />

      {/* New campaign */}
      <button
        onClick={() => navigate('/nurture')}
        className="flex items-center gap-1.5 text-[13px] font-semibold px-4 py-1.5 bg-[var(--color-purple)] text-white rounded-[var(--radius-base)] hover:bg-[var(--color-purple-deep)] transition-colors shadow-sm shrink-0"
      >
        <Megaphone size={14} />
        New campaign
      </button>

      {/* Notifications */}
      <button className="relative p-2 rounded-[var(--radius-base)] text-[var(--color-muted)] hover:bg-[var(--color-bg)] transition-colors">
        <Bell size={16} />
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[var(--color-danger)] rounded-full" />
      </button>

      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-[var(--color-purple)] flex items-center justify-center text-[11px] font-bold text-white cursor-pointer">
        CR
      </div>
    </header>
  )
}
