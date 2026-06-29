import { useNavigate } from 'react-router-dom'
import {
  RefreshCw, Filter, UserPlus, Target,
  Megaphone, Users, DollarSign, CalendarDays, Sparkles,
  Flame, Calendar, Play, ArrowRight, CheckCircle2,
  Mail, FileText
} from 'lucide-react'
import { useConsoleStore } from '@/store/useConsoleStore'
import { mockMeetings, kpis } from '@/data/mock'
import { Card } from '@/components/ui'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt$(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`
  return `$${n.toLocaleString()}`
}

function fmtDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    + ' · ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function fmtRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3.6e6)
  if (h < 1) return 'Just now'
  if (h < 24) return `${h}h ago`
  if (h < 48) return 'Yesterday'
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function KpiCard({ icon, accent, delta, value, label }: {
  icon: React.ReactNode; accent: string; delta: number; value: string; label: string
}) {
  return (
    <Card className="flex flex-col gap-4 flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: accent + '18', color: accent }}>
          {icon}
        </div>
        <span className="text-[11px] font-semibold text-[#1E8A5E] flex items-center gap-0.5">
          <svg width="10" height="10" viewBox="0 0 10 10"><path d="M5 8V2M2 5l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          {delta}%
        </span>
      </div>
      <div>
        <div className="text-[28px] font-semibold font-[var(--font-display)] text-[var(--color-ink)] leading-none">{value}</div>
        <div className="text-[12px] text-[var(--color-muted)] mt-1.5">{label}</div>
      </div>
    </Card>
  )
}

// ─── Quick action card ────────────────────────────────────────────────────────

function QuickCard({ icon, accent, title, sub, onClick }: {
  icon: React.ReactNode; accent: string; title: string; sub: string; onClick?: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start gap-3 p-4 bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-hairline)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:border-[rgba(68,32,97,0.15)] transition-all text-left flex-1 min-w-0 cursor-pointer"
    >
      <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: accent + '18', color: accent }}>
        {icon}
      </div>
      <div>
        <div className="text-[13px] font-semibold text-[var(--color-ink)] leading-tight">{title}</div>
        <div className="text-[11px] text-[var(--color-muted)] mt-0.5">{sub}</div>
      </div>
    </button>
  )
}

// ─── Pipeline bar ─────────────────────────────────────────────────────────────

function PipelineBar({ label, count, pct, color }: { label: string; count: number; pct: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-[12px] text-[var(--color-ink)] mb-1.5">
        <span>{label}</span>
        <span className="font-medium text-[var(--color-muted)]">{count}</span>
      </div>
      <div className="h-[30px] rounded-[var(--radius-sm)] overflow-hidden" style={{ background: 'rgba(20,16,31,0.06)' }}>
        <div
          className="h-full rounded-[var(--radius-sm)] flex items-center px-3 transition-all duration-700"
          style={{ width: `${Math.max(pct, 5)}%`, background: color }}
        >
          <span className="text-[11px] font-semibold text-white">{pct}%</span>
        </div>
      </div>
    </div>
  )
}

// ─── Activity items ───────────────────────────────────────────────────────────

const activityItems = [
  { icon: <UserPlus size={13} />,    bg: '#442061', text: <>New lead <strong>Glow Beauty Bar</strong> from referral</>,          sub: 'Website',             time: '2026-06-29T09:00:00' },
  { icon: <Megaphone size={13} />,   bg: '#2E89E6', text: <>Campaign <strong>"Beauty Outreach"</strong> sent to 142 leads</>,    sub: 'You',                 time: '2026-06-24T14:00:00' },
  { icon: <CheckCircle2 size={13} />,bg: '#1E8A5E', text: <><strong>Luxe Lash Co</strong> moved to Won — $2,200</>,              sub: 'You',                 time: '2026-06-28T11:00:00' },
  { icon: <Mail size={13} />,        bg: '#B5810F', text: <><strong>Tre Williams</strong> replied to proposal follow-up</>,       sub: 'Trez Barber',         time: '2026-06-29T05:00:00' },
  { icon: <DollarSign size={13} />,  bg: '#1E8A5E', text: <>Invoice <strong>#INV-0003</strong> paid — $297</>,                   sub: 'Smoove Skin Studio',  time: '2026-06-22T10:00:00' },
  { icon: <FileText size={13} />,    bg: '#6C6577', text: <>Delivered <strong>LyvWel</strong> e-commerce store</>,               sub: 'LyvWel Team',         time: '2026-06-21T09:00:00' },
]

// ─── Dashboard ────────────────────────────────────────────────────────────────

export function Dashboard() {
  const { leads } = useConsoleStore()
  const navigate = useNavigate()

  const hotLeads = leads.filter(l => l.temperature === 'hot' && l.stage !== 'won' && l.stage !== 'lost').slice(0, 3)
  const upcoming = mockMeetings.slice(0, 3)

  const mrr = kpis.mrr
  const pipeline = kpis.pipelineValue
  const newLeads = kpis.newLeadsThisMonth
  const winRate = kpis.winRate

  const stageCounts = {
    new:       leads.filter(l => l.stage === 'new').length,
    contacted: leads.filter(l => l.stage === 'contacted').length,
    qualified: leads.filter(l => l.stage === 'qualified').length,
    proposal:  leads.filter(l => l.stage === 'proposal').length,
    won:       leads.filter(l => l.stage === 'won').length,
  }
  const totalLeads = Math.max(leads.length, 1)
  const pct = (n: number) => Math.round((n / totalLeads) * 100)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="flex flex-col gap-6 pb-20">
      {/* Hero */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.12em] uppercase text-[var(--color-muted)] mb-1.5">
            {greeting}, Cam
          </p>
          <h1 className="text-[32px] font-semibold text-[var(--color-ink)] leading-tight font-[var(--font-display)]">
            Here's how{' '}
            <span style={{ color: 'var(--color-purple)' }}>BIX LLC</span>
            {' '}is doing
          </h1>
        </div>
        <div className="flex items-center gap-2 shrink-0 pt-2">
          <button className="flex items-center gap-1.5 text-[13px] font-medium px-3.5 py-2 rounded-[var(--radius-base)] border border-[var(--color-hairline)] text-[var(--color-ink)] hover:bg-[var(--color-bg)] transition-colors bg-white">
            <Sparkles size={13} style={{ color: 'var(--color-purple)' }} />
            Ask Bix
          </button>
          <button
            onClick={() => navigate('/nurture')}
            className="flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 bg-[var(--color-purple)] text-white rounded-[var(--radius-base)] hover:bg-[var(--color-purple-deep)] transition-colors shadow-sm"
          >
            <Megaphone size={13} />
            New campaign
          </button>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={<RefreshCw size={16} />} accent="#2E89E6" delta={8.2}
          value={`$${mrr.toLocaleString()}`} label="Monthly recurring · MRR" />
        <KpiCard icon={<Filter size={16} />} accent="#2E89E6" delta={14.6}
          value={fmt$(pipeline)} label={`Pipeline value · ${leads.filter(l => !['won','lost'].includes(l.stage)).length} open`} />
        <KpiCard icon={<UserPlus size={16} />} accent="#1E8A5E" delta={21}
          value={String(newLeads)} label="New leads · this month" />
        <KpiCard icon={<Target size={16} />} accent="#B5810F" delta={4}
          value={`${winRate}%`} label="Win rate · last 30d" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        <QuickCard icon={<UserPlus size={15} />}     accent="#442061" title="Add a lead"      sub="Capture a new prospect"  onClick={() => navigate('/leads')}    />
        <QuickCard icon={<Megaphone size={15} />}    accent="#2E89E6" title="New campaign"    sub="Email, SMS or outreach"  onClick={() => navigate('/nurture')}  />
        <QuickCard icon={<Users size={15} />}        accent="#1E8A5E" title="Invite client"   sub="Send a portal invite"    onClick={() => navigate('/clients')}  />
        <QuickCard icon={<DollarSign size={15} />}   accent="#B5810F" title="Send invoice"    sub="2 outstanding"           onClick={() => navigate('/invoices')} />
        <QuickCard icon={<CalendarDays size={15} />} accent="#2E89E6" title="Schedule call"   sub="5 upcoming"              onClick={() => navigate('/calendar')} />
        <QuickCard icon={<Sparkles size={15} />}     accent="#442061" title="Ask Bix"         sub="Draft & automate" />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5">

        {/* LEFT */}
        <div className="flex flex-col gap-5">

          {/* Pipeline this month */}
          <Card>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[15px] font-semibold text-[var(--color-ink)]">Pipeline this month</h3>
              <button
                onClick={() => navigate('/leads')}
                className="text-[12px] font-medium text-[var(--color-purple)] hover:underline flex items-center gap-1"
              >
                Open pipeline <ArrowRight size={12} />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <PipelineBar label="Leads captured" count={totalLeads}                pct={100}                        color="#2E89E6" />
              <PipelineBar label="Contacted"      count={stageCounts.contacted}     pct={pct(stageCounts.contacted)} color="#442061" />
              <PipelineBar label="Qualified"      count={stageCounts.qualified}     pct={pct(stageCounts.qualified)} color="#B5810F" />
              <PipelineBar label="Proposal sent"  count={stageCounts.proposal}      pct={pct(stageCounts.proposal)}  color="#1E8A5E" />
              <PipelineBar label="Won"            count={stageCounts.won}           pct={pct(stageCounts.won)}       color="#2ECC8B" />
            </div>
          </Card>

          {/* Recent activity */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-semibold text-[var(--color-ink)]">Recent activity</h3>
              <span className="text-[12px] text-[var(--color-muted)]">Across the agency</span>
            </div>
            {activityItems.map((a, i) => (
              <div
                key={i}
                className="flex items-start gap-3 py-3"
                style={{ borderBottom: i < activityItems.length - 1 ? '1px solid var(--color-hairline)' : 'none' }}
              >
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-white mt-0.5" style={{ background: a.bg }}>
                  {a.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] text-[var(--color-ink)] leading-snug">{a.text}</p>
                  <p className="text-[11px] text-[var(--color-muted)] mt-0.5">{a.sub}</p>
                </div>
                <span className="text-[11px] text-[var(--color-faint)] shrink-0 whitespace-nowrap">{fmtRelative(a.time)}</span>
              </div>
            ))}
          </Card>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-5">

          {/* Hot leads */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-semibold text-[var(--color-ink)]">Hot leads</h3>
              <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: 'var(--color-danger)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-danger)' }} />
                {hotLeads.length} to action
              </span>
            </div>
            <div className="flex flex-col">
              {hotLeads.map((l, i) => (
                <div
                  key={l.id}
                  className="flex items-center gap-3 py-3 -mx-1 px-1 rounded-[var(--radius-base)] cursor-pointer hover:bg-[var(--color-bg)] transition-colors"
                  style={{ borderBottom: i < hotLeads.length - 1 ? '1px solid var(--color-hairline)' : 'none' }}
                  onClick={() => navigate('/leads')}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: '#FF4B0015', color: '#FF4B00' }}>
                    <Flame size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[var(--color-ink)] truncate">{l.business}</p>
                    <p className="text-[11px] text-[var(--color-muted)] truncate">{l.contact} · <span className="capitalize">{l.stage}</span></p>
                  </div>
                  <span className="text-[13px] font-semibold text-[var(--color-ink)] shrink-0">${l.value.toLocaleString()}</span>
                </div>
              ))}
              {hotLeads.length === 0 && (
                <p className="text-[12px] text-[var(--color-muted)] text-center py-4">No hot leads right now</p>
              )}
            </div>
          </Card>

          {/* Upcoming */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-semibold text-[var(--color-ink)]">Upcoming</h3>
              <button onClick={() => navigate('/calendar')} className="text-[12px] font-medium text-[var(--color-purple)] hover:underline flex items-center gap-1">
                All <ArrowRight size={12} />
              </button>
            </div>
            <div className="flex flex-col">
              {upcoming.map((m, i) => (
                <div
                  key={m.id}
                  className="flex items-center gap-3 py-3"
                  style={{ borderBottom: i < upcoming.length - 1 ? '1px solid var(--color-hairline)' : 'none' }}
                >
                  <div className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center shrink-0" style={{ background: 'var(--color-bg)' }}>
                    <Calendar size={14} className="text-[var(--color-muted)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[var(--color-ink)] truncate">{m.title} — {m.clientName}</p>
                    <p className="text-[11px] text-[var(--color-muted)]">{fmtDate(m.date)}</p>
                  </div>
                  {m.link && (
                    <a
                      href={m.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-7 h-7 rounded-full flex items-center justify-center border transition-colors shrink-0"
                      style={{ borderColor: 'var(--color-hairline)', color: 'var(--color-muted)' }}
                    >
                      <Play size={9} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Revenue this month */}
          <Card>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-[10px] flex items-center justify-center" style={{ background: '#1E8A5E18', color: '#1E8A5E' }}>
                <DollarSign size={16} />
              </div>
              <h3 className="text-[15px] font-semibold text-[var(--color-ink)]">Revenue this month</h3>
            </div>
            <div className="text-[32px] font-semibold font-[var(--font-display)] text-[var(--color-ink)] leading-none mb-4">
              $23,800
            </div>
            <div className="flex flex-col gap-2.5 mb-4">
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[var(--color-muted)]">Recurring (MRR)</span>
                <span className="font-semibold text-[var(--color-ink)]">${mrr.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-[13px]">
                <span className="text-[var(--color-muted)]">Outstanding</span>
                <span className="font-semibold" style={{ color: 'var(--color-amber)' }}>$7,000</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/invoices')}
              className="w-full text-[13px] font-medium py-2 rounded-[var(--radius-base)] border border-[var(--color-hairline)] text-[var(--color-ink)] hover:bg-[var(--color-bg)] transition-colors flex items-center justify-center gap-1.5"
            >
              View revenue <ArrowRight size={13} />
            </button>
          </Card>
        </div>
      </div>

      {/* Ask Bix FAB */}
      <button className="fixed bottom-6 right-6 z-30 flex items-center gap-2 px-4 py-2.5 bg-[var(--color-purple)] text-white rounded-full shadow-[var(--shadow-lg)] hover:bg-[var(--color-purple-deep)] transition-all text-[13px] font-semibold">
        <Sparkles size={14} />
        Ask Bix
      </button>
    </div>
  )
}
