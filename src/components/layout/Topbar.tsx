import { useState } from 'react'
import { Search, Bell, Menu, Plus, ChevronDown } from 'lucide-react'
import { useConsoleStore } from '@/store/useConsoleStore'
import { useLocation } from 'react-router-dom'

const pageTitles: Record<string, string> = {
  '/':          'Dashboard',
  '/leads':     'Leads',
  '/nurture':   'Nurture',
  '/clients':   'Clients',
  '/projects':  'Projects',
  '/invoices':  'Invoices',
  '/calendar':  'Calendar',
  '/settings':  'Settings',
}

export function Topbar({ onAddAction }: { onAddAction?: () => void }) {
  const { setSidebarOpen, sidebarOpen } = useConsoleStore()
  const location = useLocation()
  const title = pageTitles[location.pathname] ?? 'Bix Console'
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <header className="flex items-center gap-3 h-[60px] px-5 bg-[var(--color-surface)] border-b border-[var(--color-hairline)] shrink-0 sticky top-0 z-20">
      {/* Mobile menu */}
      <button
        className="lg:hidden p-1.5 rounded-[var(--radius-base)] text-[var(--color-muted)] hover:bg-[var(--color-bg)]"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <Menu size={18} />
      </button>

      <h1 className="text-[16px] font-semibold text-[var(--color-ink)] leading-none whitespace-nowrap">{title}</h1>

      {/* Search */}
      <div className={`flex items-center gap-2 ml-3 h-8 px-3 rounded-[var(--radius-base)] border transition-all duration-150 ${searchFocused ? 'border-[var(--color-purple)] shadow-[0_0_0_3px_var(--color-purple-soft)] bg-white w-60' : 'border-[var(--color-hairline)] bg-[var(--color-bg)] w-44'}`}>
        <Search size={13} className="text-[var(--color-faint)] shrink-0" />
        <input
          className="bg-transparent outline-none text-[12px] text-[var(--color-ink)] placeholder:text-[var(--color-faint)] w-full font-[var(--font-sans)]"
          placeholder="Search… (⌘K)"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          onKeyDown={e => e.key === 'Escape' && e.currentTarget.blur()}
        />
      </div>

      <div className="flex-1" />

      {/* Actions */}
      {onAddAction && (
        <button
          onClick={onAddAction}
          className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 bg-[var(--color-purple)] text-white rounded-[var(--radius-base)] hover:bg-[var(--color-purple-deep)] transition-colors shadow-sm"
        >
          <Plus size={13} />
          Add
        </button>
      )}

      {/* Notifications */}
      <button className="relative p-2 rounded-[var(--radius-base)] text-[var(--color-muted)] hover:bg-[var(--color-bg)] transition-colors">
        <Bell size={16} />
        <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-danger)] rounded-full" />
      </button>

      {/* User avatar */}
      <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-[var(--radius-base)] hover:bg-[var(--color-bg)] transition-colors group">
        <div className="w-7 h-7 rounded-full bg-[var(--color-purple)] flex items-center justify-center text-[11px] font-bold text-white">S</div>
        <span className="text-[12px] font-medium text-[var(--color-ink)] hidden sm:block">Sheneska</span>
        <ChevronDown size={12} className="text-[var(--color-faint)] group-hover:text-[var(--color-muted)]" />
      </button>
    </header>
  )
}
