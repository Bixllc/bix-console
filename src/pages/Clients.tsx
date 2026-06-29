import React, { useState } from 'react'
import {
  Users, RefreshCw, Shield, AlertTriangle, UserPlus,
  Copy, CheckCircle, ChevronRight, ExternalLink,
} from 'lucide-react'
import {
  Badge, Button, Card, StatCard, Drawer,
  Modal, Field, Input, Select, Textarea,
  ProgressBar, useToast,
} from '@/components/ui'
import { useConsoleStore } from '@/store/useConsoleStore'
import type { Client, Invite, ClientPlan, ProjectStatus } from '@/data/mock'
import { Sparkles } from 'lucide-react'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtMoney(n: number) {
  return '$' + n.toLocaleString()
}

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const AVATAR_COLORS = [
  '#442061', '#5B3F8A', '#2E89E6', '#1E8A5E', '#B5810F',
  '#442061', '#5B3F8A', '#2E89E6', '#1E8A5E', '#B5810F', '#442061',
]

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

function planBadgeVariant(plan: ClientPlan): 'muted' | 'blue' | 'purple' {
  const map: Record<ClientPlan, 'muted' | 'blue' | 'purple'> = {
    starter: 'muted', growth: 'blue', scale: 'purple',
  }
  return map[plan]
}

function planLabel(plan: ClientPlan) {
  return plan.charAt(0).toUpperCase() + plan.slice(1)
}

function projectStatusVariant(s: ProjectStatus): 'muted' | 'blue' | 'amber' | 'purple' | 'success' {
  const map: Record<ProjectStatus, 'muted' | 'blue' | 'amber' | 'purple' | 'success'> = {
    discovery: 'muted', design: 'blue', development: 'amber', review: 'purple', launched: 'success',
  }
  return map[s]
}

function healthDotColor(score: number): string {
  if (score >= 90) return 'var(--color-success)'
  if (score >= 75) return 'var(--color-amber)'
  return 'var(--color-danger)'
}

// ─── Client Detail Drawer ─────────────────────────────────────────────────────

function ClientDrawer({ client, onClose, idx }: { client: Client | null; onClose: () => void; idx: number }) {
  if (!client) return <Drawer open={false} onClose={onClose} title="" children={null} />

  const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length]

  return (
    <Drawer open title={client.company} onClose={onClose} width="w-[500px]">
      <div className="flex flex-col gap-6 p-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="w-14 h-14 rounded-[var(--radius-lg)] flex items-center justify-center mb-3"
              style={{ background: avatarColor }}>
              <span className="text-[20px] font-bold text-white">{getInitials(client.name)}</span>
            </div>
            <h3 className="text-[18px] font-semibold text-[var(--color-ink)]">{client.company}</h3>
            <p className="text-[13px] text-[var(--color-muted)]">{client.name} · {client.industry}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={planBadgeVariant(client.plan)}>{planLabel(client.plan)}</Badge>
            <Badge variant={client.status === 'active' ? 'success' : client.status === 'paused' ? 'amber' : 'danger'}>
              {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'MRR',    value: fmtMoney(client.mrr) + '/mo' },
            { label: 'Health', value: `${client.healthScore}` },
            { label: 'Joined', value: fmtDate(client.joinedAt) },
          ].map(item => (
            <div key={item.label} className="bg-[var(--color-bg)] rounded-[var(--radius-base)] p-3 text-center">
              <p className="text-[11px] text-[var(--color-muted)] uppercase tracking-wide">{item.label}</p>
              <p className="text-[16px] font-semibold font-[var(--font-mono)] text-[var(--color-ink)] mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Health */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[12px] font-semibold text-[var(--color-muted)] uppercase tracking-wide">Health score</p>
            <span className="text-[13px] font-semibold font-[var(--font-mono)]" style={{ color: healthDotColor(client.healthScore) }}>
              {client.healthScore}
            </span>
          </div>
          <ProgressBar value={client.healthScore} color={healthDotColor(client.healthScore)} />
        </div>

        {/* Project */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[12px] font-semibold text-[var(--color-muted)] uppercase tracking-wide">Project</p>
            <Badge variant={projectStatusVariant(client.projectStatus)}>
              {client.projectStatus.charAt(0).toUpperCase() + client.projectStatus.slice(1)}
            </Badge>
          </div>
          <ProgressBar value={client.projectProgress} />
          <p className="text-[11px] text-[var(--color-faint)] mt-1">{client.projectProgress}% complete</p>
        </div>

        {/* Contact */}
        <div>
          <p className="text-[12px] font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-2">Contact</p>
          <div className="bg-[var(--color-bg)] rounded-[var(--radius-base)] p-3 space-y-2">
            <p className="text-[13px] text-[var(--color-ink)]">{client.email}</p>
            {client.website && (
              <a href={client.website} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 text-[13px] text-[var(--color-purple)] hover:underline">
                <ExternalLink size={12} /> {client.website}
              </a>
            )}
          </div>
        </div>

      </div>
    </Drawer>
  )
}

// ─── Invite Client Modal ──────────────────────────────────────────────────────

const EMPTY_INVITE = { name: '', company: '', email: '', plan: 'growth' as ClientPlan, note: '' }

function InviteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addInvite = useConsoleStore(s => s.addInvite)
  const toast = useToast()
  const [form, setForm] = useState(EMPTY_INVITE)
  const [sent, setSent] = useState<Invite | null>(null)

  function set<K extends keyof typeof EMPTY_INVITE>(k: K, v: typeof EMPTY_INVITE[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.email) { toast('Please fill required fields', 'error'); return }
    const token = Math.random().toString(36).slice(2, 10)
    const invite: Invite = {
      id: 'i' + Date.now(), name: form.name, company: form.company, email: form.email,
      plan: form.plan, note: form.note || undefined, status: 'pending',
      inviteLink: `https://bix.agency/portal/set-password?token=${token}`,
      sentAt: new Date().toISOString().split('T')[0],
    }
    addInvite(invite)
    setSent(invite)
  }

  function handleClose() { setForm(EMPTY_INVITE); setSent(null); onClose() }

  function copyLink() {
    if (sent) { navigator.clipboard.writeText(sent.inviteLink); toast('Invite link copied!') }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Invite client" width="max-w-md">
      {sent ? (
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="w-14 h-14 rounded-full bg-[var(--color-success-soft)] flex items-center justify-center">
            <CheckCircle size={28} className="text-[var(--color-success)]" />
          </div>
          <div className="text-center">
            <p className="text-[16px] font-semibold text-[var(--color-ink)]">Invite sent to {sent.name}!</p>
            <p className="text-[13px] text-[var(--color-muted)] mt-1">They'll receive an email to set up their access.</p>
          </div>
          <div className="w-full bg-[var(--color-bg)] rounded-[var(--radius-base)] p-3">
            <p className="text-[11px] text-[var(--color-muted)] mb-1.5 font-medium">Invite link</p>
            <div className="flex items-center gap-2">
              <p className="text-[12px] font-[var(--font-mono)] text-[var(--color-ink)] truncate flex-1">{sent.inviteLink}</p>
              <Button variant="secondary" size="sm" onClick={copyLink}><Copy size={12} /> Copy</Button>
            </div>
          </div>
          <Button variant="primary" onClick={handleClose} className="w-full">Done</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Full name *">
              <Input placeholder="Rico Alvarez" value={form.name} onChange={e => set('name', e.target.value)} />
            </Field>
            <Field label="Company">
              <Input placeholder="TitanFit Studio" value={form.company} onChange={e => set('company', e.target.value)} />
            </Field>
          </div>
          <Field label="Email *">
            <Input type="email" placeholder="rico@titanfit.com" value={form.email} onChange={e => set('email', e.target.value)} />
          </Field>
          <Field label="Plan">
            <Select value={form.plan} onChange={e => set('plan', e.target.value as ClientPlan)}>
              <option value="starter">Starter — $350/mo</option>
              <option value="growth">Growth — $850/mo</option>
              <option value="scale">Scale — $1,800/mo</option>
            </Select>
          </Field>
          <Field label="Note (optional)">
            <Textarea placeholder="Any context for this invite..." value={form.note} onChange={e => set('note', e.target.value)} rows={2} />
          </Field>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--color-hairline)]">
            <Button type="button" variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="primary"><UserPlus size={13} /> Send invite</Button>
          </div>
        </form>
      )}
    </Modal>
  )
}

// ─── Clients Page ─────────────────────────────────────────────────────────────

type FilterType = 'all' | 'active' | 'at-risk'

export function Clients() {
  const clients = useConsoleStore(s => s.clients)
  const toast = useToast()
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [selectedIdx, setSelectedIdx] = useState(0)
  const [inviteOpen, setInviteOpen] = useState(false)
  const [filter, setFilter] = useState<FilterType>('all')

  const totalMRR   = clients.filter(c => c.status === 'active').reduce((s, c) => s + c.mrr, 0)
  const activeCount = clients.filter(c => c.status === 'active').length
  const avgHealth  = Math.round(clients.reduce((s, c) => s + c.healthScore, 0) / clients.length)
  const atRiskCount = clients.filter(c => c.healthScore < 75).length

  const filteredClients = clients.filter(c => {
    if (filter === 'active')  return c.status === 'active'
    if (filter === 'at-risk') return c.healthScore < 75
    return true
  })

  const FILTER_TABS: { key: FilterType; label: string }[] = [
    { key: 'all',     label: `All ${clients.length}` },
    { key: 'active',  label: 'Active'   },
    { key: 'at-risk', label: 'At risk'  },
  ]

  return (
    <div className="flex flex-col gap-6">

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Active clients" value={activeCount}         icon={<Users size={16} />}         accent="blue"  deltaLabel="Retainer accounts" />
        <StatCard label="Total MRR"      value={fmtMoney(totalMRR)}  icon={<RefreshCw size={16} />}     accent="success" delta={8} deltaLabel="vs last month" />
        <StatCard label="Avg. health"    value={avgHealth}            icon={<Shield size={16} />}        accent="blue"  deltaLabel="All clients" />
        <StatCard label="At risk"        value={atRiskCount}          icon={<AlertTriangle size={16} />} accent="amber" deltaLabel="Health score &lt;75" />
      </div>

      {/* Filter pills + invite button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {FILTER_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`text-[13px] font-medium px-4 py-1.5 rounded-full transition-all duration-150 ${
                filter === tab.key
                  ? 'bg-[var(--color-purple)] text-white'
                  : 'text-[var(--color-muted)] hover:bg-[rgba(20,16,31,0.05)] hover:text-[var(--color-ink)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <Button variant="primary" onClick={() => setInviteOpen(true)}>
          <UserPlus size={14} /> Invite client
        </Button>
      </div>

      {/* Client table */}
      <Card padding={false}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--color-hairline)]">
              {['CLIENT', 'PLAN', 'MRR', 'PROJECT', 'HEALTH', 'STATUS', ''].map(h => (
                <th key={h} className="text-left text-[11px] font-semibold text-[var(--color-faint)] uppercase tracking-wide px-5 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((c, idx) => {
              const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length]
              return (
                <tr
                  key={c.id}
                  className="border-b border-[var(--color-hairline)] last:border-0 hover:bg-[var(--color-bg)] transition-colors cursor-pointer"
                  onClick={() => { setSelectedClient(c); setSelectedIdx(idx) }}
                >
                  {/* CLIENT */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-[var(--radius-base)] flex items-center justify-center flex-shrink-0"
                        style={{ background: avatarColor }}>
                        <span className="text-[12px] font-bold text-white">{getInitials(c.name)}</span>
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-[var(--color-ink)]">{c.company}</p>
                        <p className="text-[11px] text-[var(--color-muted)]">{c.industry} · {c.name}</p>
                      </div>
                    </div>
                  </td>
                  {/* PLAN */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{
                        background: c.plan === 'scale' ? 'var(--color-purple)' : c.plan === 'growth' ? 'var(--color-blue)' : 'var(--color-muted)'
                      }} />
                      <span className="text-[13px] text-[var(--color-ink)]">{planLabel(c.plan)}</span>
                    </div>
                  </td>
                  {/* MRR */}
                  <td className="px-5 py-3.5">
                    <span className="text-[13px] font-bold font-[var(--font-mono)] text-[var(--color-ink)]">{fmtMoney(c.mrr)}</span>
                  </td>
                  {/* PROJECT */}
                  <td className="px-5 py-3.5 w-[160px]">
                    <p className="text-[12px] text-[var(--color-ink)] mb-1">{c.projectStatus.charAt(0).toUpperCase() + c.projectStatus.slice(1)}</p>
                    <div className="h-[3px] bg-[rgba(20,16,31,0.08)] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${c.projectProgress}%`, background: 'var(--color-blue)' }} />
                    </div>
                  </td>
                  {/* HEALTH */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: healthDotColor(c.healthScore) }} />
                      <span className="text-[13px] font-semibold font-[var(--font-mono)] text-[var(--color-ink)]">{c.healthScore}</span>
                    </div>
                  </td>
                  {/* STATUS */}
                  <td className="px-5 py-3.5">
                    <Badge variant={c.status === 'active' ? 'success' : c.healthScore < 75 ? 'danger' : 'muted'}>
                      {c.status === 'active' && c.healthScore >= 75 ? 'Active' : c.status === 'active' && c.healthScore < 75 ? 'At risk' : 'Inactive'}
                    </Badge>
                  </td>
                  {/* ARROW */}
                  <td className="px-5 py-3.5">
                    <ChevronRight size={14} className="text-[var(--color-faint)]" />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Card>

      {/* Drawers & Modals */}
      <ClientDrawer client={selectedClient} idx={selectedIdx} onClose={() => setSelectedClient(null)} />
      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} />

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
