import { Folder, Award, TrendingUp, AlertTriangle, CheckCircle, MessageSquare, Sparkles } from 'lucide-react'
import { Button, Card, StatCard, useToast } from '@/components/ui'
import { useConsoleStore } from '@/store/useConsoleStore'
import { mockClients } from '@/data/mock'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase()
}

const AVATAR_COLORS = [
  '#442061', '#5B3F8A', '#2E89E6', '#1E8A5E', '#B5810F',
  '#442061', '#5B3F8A', '#2E89E6', '#1E8A5E', '#B5810F', '#442061',
]

function getClientInfo(clientId: string) {
  const c = mockClients.find(m => m.id === clientId)
  return c ? { healthScore: c.healthScore, industry: c.industry, name: c.name } : { healthScore: null, industry: '', name: '' }
}

function getClientIdx(clientId: string): number {
  return mockClients.findIndex(m => m.id === clientId)
}

function healthDotColor(score: number | null): string {
  if (score === null) return 'var(--color-faint)'
  if (score >= 90) return 'var(--color-success)'
  if (score >= 75) return 'var(--color-amber)'
  return 'var(--color-danger)'
}

function fmtLiveSince(s: string) {
  return new Date(s).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

// ─── Projects Page ────────────────────────────────────────────────────────────

export function Projects() {
  const projects = useConsoleStore(s => s.projects)
  const toast = useToast()

  const active   = projects.filter(p => p.status !== 'launched')
  const launched = projects.filter(p => p.status === 'launched')

  const avgProgress = active.length > 0
    ? Math.round(active.reduce((s, p) => s + p.progress, 0) / active.length)
    : 0

  const needsAttention = active.filter(p => {
    const info = getClientInfo(p.clientId)
    return info.healthScore !== null && info.healthScore < 75
  }).length

  return (
    <div className="flex flex-col gap-6">

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="In build"       value={active.length}   icon={<Folder size={16} />}       accent="blue"  deltaLabel="Active builds" />
        <StatCard label="Launched"        value={launched.length} icon={<Award size={16} />}         accent="success" deltaLabel="Live projects" />
        <StatCard label="Avg. progress"   value={`${avgProgress}%`} icon={<TrendingUp size={16} />} accent="blue"  deltaLabel="Active builds" />
        <StatCard label="Needs attention" value={needsAttention}  icon={<AlertTriangle size={16} />} accent="amber" deltaLabel="Health score &lt;75" />
      </div>

      {/* Active builds */}
      <div>
        <div className="mb-4">
          <h2 className="text-[18px] font-semibold text-[var(--color-ink)]">Active builds</h2>
          <p className="text-[13px] text-[var(--color-muted)] mt-0.5">Projects across all client accounts</p>
        </div>

        {active.length === 0 ? (
          <Card>
            <div className="py-12 text-center">
              <Folder size={32} className="text-[var(--color-faint)] mx-auto mb-3" />
              <p className="text-[15px] font-semibold text-[var(--color-ink)]">No active projects</p>
              <p className="text-[13px] text-[var(--color-muted)] mt-1">All projects have launched.</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {active.map((p, i) => {
              const idx     = getClientIdx(p.clientId)
              const info    = getClientInfo(p.clientId)
              const color   = AVATAR_COLORS[idx >= 0 ? idx : i % AVATAR_COLORS.length]
              const initials = getInitials(p.clientName)

              return (
                <Card key={p.id} className="flex flex-col gap-4 hover:shadow-[var(--shadow-md)] transition-shadow">
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-[var(--radius-base)] flex items-center justify-center flex-shrink-0"
                        style={{ background: color }}>
                        <span className="text-[13px] font-bold text-white">{initials}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-[var(--color-ink)] truncate">{p.clientName}</p>
                        <p className="text-[11px] text-[var(--color-muted)] truncate">{p.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="w-2 h-2 rounded-full" style={{ background: healthDotColor(info.healthScore) }} />
                      <span className="text-[13px] font-semibold font-[var(--font-mono)] text-[var(--color-ink)]">
                        {info.healthScore ?? '—'}
                      </span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12px] text-[var(--color-muted)]">Progress</span>
                      <span className="text-[12px] font-semibold font-[var(--font-mono)] text-[var(--color-ink)]">{p.progress}%</span>
                    </div>
                    <div className="h-[4px] bg-[rgba(20,16,31,0.08)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${p.progress}%`, background: 'linear-gradient(90deg, var(--color-purple), var(--color-blue))' }}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-1 border-t border-[var(--color-hairline)]">
                    <Button variant="secondary" size="sm" className="flex-1" onClick={() => toast('Project view coming soon', 'info')}>
                      View
                    </Button>
                    <Button variant="secondary" size="sm" className="flex-1" onClick={() => toast('Update sent', 'success')}>
                      <MessageSquare size={12} /> Update
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Recently launched */}
      {launched.length > 0 && (
        <div>
          <p className="text-[11px] font-semibold tracking-widest uppercase text-[var(--color-muted)] mb-3">
            RECENTLY LAUNCHED
          </p>
          <Card padding={false}>
            {launched.map((p) => {
              const info = getClientInfo(p.clientId)
              return (
                <div
                  key={p.id}
                  className="flex items-center gap-4 px-5 py-4 border-b border-[var(--color-hairline)] last:border-0"
                >
                  {/* Green check */}
                  <div className="w-8 h-8 rounded-full bg-[var(--color-success-soft)] flex items-center justify-center flex-shrink-0">
                    <CheckCircle size={16} className="text-[var(--color-success)]" />
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[var(--color-ink)] truncate">
                      {p.clientName} · {p.name}
                    </p>
                    <p className="text-[11px] text-[var(--color-muted)] mt-0.5">
                      {info.industry}{p.launchedAt ? ` · live since ${fmtLiveSince(p.launchedAt)}` : ''}
                    </p>
                  </div>
                  {/* Badge */}
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[var(--color-success-soft)] text-[var(--color-success)] px-2 py-0.5 rounded-full flex-shrink-0">
                    • Launched
                  </span>
                </div>
              )
            })}
          </Card>
        </div>
      )}

      {/* Sparkles FAB */}
      <button
        className="fixed bottom-6 right-6 z-30 flex items-center gap-2 px-4 py-2.5 bg-[var(--color-purple)] text-white rounded-full shadow-[var(--shadow-lg)] hover:bg-[var(--color-purple-deep)] transition-all text-[13px] font-semibold"
        onClick={() => toast('Ask Bix coming soon', 'info')}
      >
        <Sparkles size={14} /> Ask Bix
      </button>

    </div>
  )
}
