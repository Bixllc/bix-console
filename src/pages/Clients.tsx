import React, { useState } from 'react'
import {
  Users, DollarSign, Activity, Eye, Copy, RefreshCw,
  Plus, ExternalLink, CheckCircle,
} from 'lucide-react'
import {
  Badge, Button, Card, CardHeader, StatCard, Drawer,
  Modal, Field, Input, Select, Textarea, ProgressBar, useToast,
} from '@/components/ui'
import { useConsoleStore } from '@/store/useConsoleStore'
import type { Client, Invite, ClientPlan, ProjectStatus } from '@/data/mock'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtMoney(n: number) {
  return '$' + n.toLocaleString()
}

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function planBadgeVariant(plan: ClientPlan): 'muted' | 'blue' | 'purple' | 'amber' {
  const map: Record<ClientPlan, 'muted' | 'blue' | 'purple' | 'amber'> = {
    starter: 'muted', growth: 'blue', pro: 'purple', enterprise: 'amber',
  }
  return map[plan]
}

function planLabel(plan: ClientPlan) {
  return plan.charAt(0).toUpperCase() + plan.slice(1)
}

function projectStatusVariant(s: ProjectStatus): 'muted' | 'blue' | 'amber' | 'purple' | 'success' {
  const map: Record<ProjectStatus, 'muted' | 'blue' | 'amber' | 'purple' | 'success'> = {
    discovery: 'muted', design: 'blue', development: 'amber',
    review: 'purple', launched: 'success',
  }
  return map[s]
}

function healthColor(score: number) {
  if (score >= 80) return 'var(--color-success)'
  if (score >= 60) return 'var(--color-amber)'
  return 'var(--color-danger)'
}

// ─── Client Detail Drawer ─────────────────────────────────────────────────────

function ClientDrawer({ client, onClose }: { client: Client | null; onClose: () => void }) {
  if (!client) return <Drawer open={false} onClose={onClose} title="" children={null} />

  return (
    <Drawer open title={client.company} onClose={onClose} width="w-[500px]">
      <div className="flex flex-col gap-6 p-6">

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="w-12 h-12 rounded-[var(--radius-base)] bg-[var(--color-purple-soft)] flex items-center justify-center mb-3">
              <span className="text-[20px] font-bold text-[var(--color-purple)]">
                {client.company.charAt(0)}
              </span>
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

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'MRR', value: fmtMoney(client.mrr) },
            { label: 'Health', value: `${client.healthScore}%` },
            { label: 'Joined', value: fmtDate(client.joinedAt) },
          ].map(item => (
            <div key={item.label} className="bg-[var(--color-bg)] rounded-[var(--radius-base)] p-3 text-center">
              <p className="text-[11px] text-[var(--color-muted)] uppercase tracking-wide">{item.label}</p>
              <p className="text-[16px] font-semibold font-[var(--font-mono)] text-[var(--color-ink)] mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Health Score */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-[12px] font-semibold text-[var(--color-muted)] uppercase tracking-wide">Health Score</p>
            <span className="text-[13px] font-semibold font-[var(--font-mono)]" style={{ color: healthColor(client.healthScore) }}>
              {client.healthScore}%
            </span>
          </div>
          <ProgressBar value={client.healthScore} color={healthColor(client.healthScore)} />
        </div>

        {/* Project Status */}
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
            <p className="text-[13px] text-[var(--color-ink)]">📧 {client.email}</p>
            {client.website && (
              <a
                href={client.website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-[13px] text-[var(--color-purple)] hover:underline"
              >
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

const EMPTY_INVITE = {
  name: '', company: '', email: '',
  plan: 'growth' as ClientPlan, note: '',
}

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
      id: 'i' + Date.now(),
      name: form.name,
      company: form.company,
      email: form.email,
      plan: form.plan,
      note: form.note || undefined,
      status: 'pending',
      inviteLink: `https://bix-marketing-site.vercel.app/set-password.html?token=${token}`,
      sentAt: new Date().toISOString().split('T')[0],
    }
    addInvite(invite)
    setSent(invite)
  }

  function handleClose() {
    setForm(EMPTY_INVITE)
    setSent(null)
    onClose()
  }

  function copyLink() {
    if (sent) {
      navigator.clipboard.writeText(sent.inviteLink)
      toast('Invite link copied!')
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Invite Client" width="max-w-md">
      {sent ? (
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="w-14 h-14 rounded-full bg-[var(--color-success-soft)] flex items-center justify-center">
            <CheckCircle size={28} className="text-[var(--color-success)]" />
          </div>
          <div className="text-center">
            <p className="text-[16px] font-semibold text-[var(--color-ink)]">Invite sent to {sent.name}!</p>
            <p className="text-[13px] text-[var(--color-muted)] mt-1">
              They'll receive an email to set up their access.
            </p>
          </div>
          <div className="w-full bg-[var(--color-bg)] rounded-[var(--radius-base)] p-3">
            <p className="text-[11px] text-[var(--color-muted)] mb-1.5 font-medium">Invite Link</p>
            <div className="flex items-center gap-2">
              <p className="text-[12px] font-[var(--font-mono)] text-[var(--color-ink)] truncate flex-1">
                {sent.inviteLink}
              </p>
              <Button variant="secondary" size="sm" onClick={copyLink}>
                <Copy size={12} /> Copy
              </Button>
            </div>
          </div>
          <Button variant="primary" onClick={handleClose} className="w-full">Done</Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Full Name *">
              <Input placeholder="Maya Johnson" value={form.name} onChange={e => set('name', e.target.value)} />
            </Field>
            <Field label="Company">
              <Input placeholder="Glow Beauty Bar" value={form.company} onChange={e => set('company', e.target.value)} />
            </Field>
          </div>
          <Field label="Email *">
            <Input type="email" placeholder="maya@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
          </Field>
          <Field label="Plan">
            <Select value={form.plan} onChange={e => set('plan', e.target.value as ClientPlan)}>
              <option value="starter">Starter — $97/mo</option>
              <option value="growth">Growth — $197/mo</option>
              <option value="pro">Pro — $297/mo</option>
              <option value="enterprise">Enterprise — Custom</option>
            </Select>
          </Field>
          <Field label="Note (optional)">
            <Textarea
              placeholder="Any context for this invite..."
              value={form.note}
              onChange={e => set('note', e.target.value)}
              rows={2}
            />
          </Field>
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--color-hairline)]">
            <Button type="button" variant="secondary" onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="primary"><Plus size={13} /> Send Invite</Button>
          </div>
        </form>
      )}
    </Modal>
  )
}

// ─── Clients Page ─────────────────────────────────────────────────────────────

export function Clients() {
  const clients = useConsoleStore(s => s.clients)
  const invites = useConsoleStore(s => s.invites)
  const updateInvite = useConsoleStore(s => s.updateInvite)
  const toast = useToast()
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [inviteOpen, setInviteOpen] = useState(false)

  const totalMRR = clients.filter(c => c.status === 'active').reduce((s, c) => s + c.mrr, 0)
  const activeCount = clients.filter(c => c.status === 'active').length
  const avgHealth = Math.round(clients.reduce((s, c) => s + c.healthScore, 0) / clients.length)

  const pendingInvites = invites.filter(i => i.status === 'pending')

  function copyInviteLink(link: string) {
    navigator.clipboard.writeText(link)
    toast('Invite link copied!')
  }

  function resendInvite(id: string) {
    updateInvite(id, { sentAt: new Date().toISOString().split('T')[0] })
    toast('Invite resent')
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold font-[var(--font-display)] text-[var(--color-ink)]">Clients</h1>
          <p className="text-[13px] text-[var(--color-muted)] mt-0.5">{clients.length} total clients</p>
        </div>
        <Button variant="primary" onClick={() => setInviteOpen(true)}>
          <Plus size={14} /> Invite Client
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Total MRR"
          value={fmtMoney(totalMRR) + '/mo'}
          icon={<DollarSign size={16} />}
          accent="purple"
        />
        <StatCard
          label="Active Clients"
          value={activeCount}
          icon={<Users size={16} />}
          accent="success"
        />
        <StatCard
          label="Avg Health Score"
          value={`${avgHealth}%`}
          icon={<Activity size={16} />}
          accent="blue"
        />
      </div>

      {/* Client Table */}
      <Card padding={false}>
        <div className="p-5 pb-0">
          <CardHeader title="All Clients" subtitle="Retainer accounts" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-hairline)]">
                {['Client', 'Plan', 'MRR', 'Project', 'Health', 'Status', ''].map(h => (
                  <th key={h} className="text-left text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wide px-5 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map(c => (
                <tr key={c.id} className="border-b border-[var(--color-hairline)] last:border-0 hover:bg-[var(--color-bg)] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--color-purple-soft)] flex items-center justify-center flex-shrink-0">
                        <span className="text-[12px] font-bold text-[var(--color-purple)]">{c.company.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-[var(--color-ink)]">{c.company}</p>
                        <p className="text-[11px] text-[var(--color-muted)]">{c.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={planBadgeVariant(c.plan)}>{planLabel(c.plan)}</Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[13px] font-semibold font-[var(--font-mono)] text-[var(--color-ink)]">
                      {fmtMoney(c.mrr)}
                    </span>
                    <span className="text-[11px] text-[var(--color-muted)]">/mo</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={projectStatusVariant(c.projectStatus)}>
                      {c.projectStatus.charAt(0).toUpperCase() + c.projectStatus.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 w-[140px]">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium" style={{ color: healthColor(c.healthScore) }}>
                          {c.healthScore}%
                        </span>
                      </div>
                      <ProgressBar value={c.healthScore} color={healthColor(c.healthScore)} />
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={c.status === 'active' ? 'success' : c.status === 'paused' ? 'amber' : 'danger'}>
                      {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedClient(c)}>
                      <Eye size={13} /> View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pending Invitations */}
      {pendingInvites.length > 0 && (
        <Card>
          <CardHeader
            title="Pending Invitations"
            subtitle={`${pendingInvites.length} awaiting response`}
          />
          <div className="flex flex-col divide-y divide-[var(--color-hairline)]">
            {pendingInvites.map(inv => (
              <div key={inv.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-[13px] font-medium text-[var(--color-ink)]">{inv.name}</p>
                    <Badge variant={planBadgeVariant(inv.plan)}>{planLabel(inv.plan)}</Badge>
                  </div>
                  <p className="text-[11px] text-[var(--color-muted)] mt-0.5">
                    {inv.company} · {inv.email} · Sent {fmtDate(inv.sentAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button variant="secondary" size="sm" onClick={() => copyInviteLink(inv.inviteLink)}>
                    <Copy size={12} /> Copy Link
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => resendInvite(inv.id)}>
                    <RefreshCw size={12} /> Resend
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Drawers & Modals */}
      <ClientDrawer client={selectedClient} onClose={() => setSelectedClient(null)} />
      <InviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} />

    </div>
  )
}
