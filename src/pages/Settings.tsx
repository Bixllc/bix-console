import React, { useState } from 'react'
import {
  LayoutGrid, Users, Link2, Crosshair, Bell, CreditCard,
  Plus, Check, Download, Sparkles,
} from 'lucide-react'
import {
  Badge, Button, Card, Field, Input,
  Toggle, useToast,
} from '@/components/ui'

// ─── Tab config ───────────────────────────────────────────────────────────────

type Tab = 'agency' | 'team' | 'integrations' | 'lead-capture' | 'notifications' | 'billing'

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'agency',         label: 'Agency',        icon: <LayoutGrid size={14} /> },
  { key: 'team',           label: 'Team',          icon: <Users size={14} />      },
  { key: 'integrations',   label: 'Integrations',  icon: <Link2 size={14} />      },
  { key: 'lead-capture',   label: 'Lead capture',  icon: <Crosshair size={14} />  },
  { key: 'notifications',  label: 'Notifications', icon: <Bell size={14} />       },
  { key: 'billing',        label: 'Billing',       icon: <CreditCard size={14} /> },
]

// ─── Agency Tab ───────────────────────────────────────────────────────────────

function AgencyTab() {
  const toast = useToast()
  const [form, setForm] = useState({
    name: 'BIX LLC', founder: 'Cam Rivera', replyEmail: 'cam@bixllc.net', domain: 'bixllc.net',
  })

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-[18px] font-semibold text-[var(--color-ink)]">Agency profile</h2>
        <p className="text-[13px] text-[var(--color-muted)] mt-0.5">
          Appears on invoices, proposals, and outgoing campaigns.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Agency name">
          <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        </Field>
        <Field label="Founder">
          <Input value={form.founder} onChange={e => setForm(f => ({ ...f, founder: e.target.value }))} />
        </Field>
        <Field label="Reply-to email">
          <Input type="email" value={form.replyEmail} onChange={e => setForm(f => ({ ...f, replyEmail: e.target.value }))} />
        </Field>
        <Field label="Sending domain">
          <Input value={form.domain} onChange={e => setForm(f => ({ ...f, domain: e.target.value }))} />
        </Field>
      </div>
      <div className="pt-2 border-t border-[var(--color-hairline)]">
        <Button variant="primary" onClick={() => toast('Agency profile saved')}>
          <Check size={13} /> Save changes
        </Button>
      </div>
    </div>
  )
}

// ─── Team Tab ─────────────────────────────────────────────────────────────────

const TEAM_MEMBERS = [
  { name: 'Cam Rivera',   role: 'Founder · Owner',   initials: 'CR', color: '#442061', badge: 'Owner'  },
  { name: 'Marcus Bell',  role: 'Lead Engineer',     initials: 'MB', color: '#2E89E6', badge: 'Member' },
  { name: 'Dana Okafor',  role: 'Designer',          initials: 'DO', color: '#1E8A5E', badge: 'Member' },
  { name: 'Priya Shah',   role: 'Project Lead',      initials: 'PS', color: '#B5810F', badge: 'Member' },
]

function TeamTab() {
  const toast = useToast()
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-semibold text-[var(--color-ink)]">Team</h2>
        <Button variant="secondary" size="sm" onClick={() => toast('Invite flow coming soon', 'info')}>
          <Plus size={13} /> Invite
        </Button>
      </div>
      <Card padding={false}>
        {TEAM_MEMBERS.map((m) => (
          <div
            key={m.name}
            className="flex items-center gap-4 px-5 py-4 border-b border-[var(--color-hairline)] last:border-0"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: m.color }}>
              <span className="text-[13px] font-bold text-white">{m.initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-[var(--color-ink)]">{m.name}</p>
              <p className="text-[12px] text-[var(--color-muted)] mt-0.5">{m.role}</p>
            </div>
            <Badge variant={m.badge === 'Owner' ? 'purple' : 'muted'}>
              {m.badge === 'Owner' ? '• Owner' : '• Member'}
            </Badge>
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── Integrations Tab ─────────────────────────────────────────────────────────

const INTEGRATIONS = [
  { id: 'gmail',     name: 'Gmail / Google Workspace', desc: 'Send campaigns from your domain', connected: true  },
  { id: 'twilio',    name: 'Twilio',                   desc: 'SMS sending',                      connected: true  },
  { id: 'stripe',    name: 'Stripe',                   desc: 'Invoices & payments',              connected: true  },
  { id: 'instagram', name: 'Instagram',                desc: 'Social DM outreach',               connected: false },
  { id: 'zapier',    name: 'Zapier',                   desc: 'Automations',                      connected: false },
  { id: 'calendly',  name: 'Calendly',                 desc: 'Booking links',                    connected: true  },
]

function IntegrationsTab() {
  const toast = useToast()
  const [integrations, setIntegrations] = useState(INTEGRATIONS)

  function connect(id: string) {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, connected: true } : i))
    const name = integrations.find(i => i.id === id)?.name ?? id
    toast(`${name} connected!`, 'success')
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-[18px] font-semibold text-[var(--color-ink)]">Integrations</h2>
      <Card padding={false}>
        {integrations.map(int => (
          <div key={int.id} className="flex items-center gap-4 px-5 py-4 border-b border-[var(--color-hairline)] last:border-0">
            <div className="w-9 h-9 rounded-[var(--radius-base)] bg-[var(--color-bg)] border border-[var(--color-hairline)] flex items-center justify-center flex-shrink-0">
              <Link2 size={14} className="text-[var(--color-muted)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-[var(--color-ink)]">{int.name}</p>
              <p className="text-[12px] text-[var(--color-muted)] mt-0.5">{int.desc}</p>
            </div>
            {int.connected ? (
              <Badge variant="success">• Connected</Badge>
            ) : (
              <Button variant="secondary" size="sm" onClick={() => connect(int.id)}>Connect</Button>
            )}
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── Lead Capture Tab ─────────────────────────────────────────────────────────

function LeadCaptureTab() {
  const toast = useToast()
  const [autoEnroll, setAutoEnroll] = useState(true)

  const SOURCES = [
    { name: 'Website contact form', status: 'Active',  statusColor: 'var(--color-success)' },
    { name: 'Book-a-call form',     status: 'Active',  statusColor: 'var(--color-success)' },
    { name: 'CSV import',           status: 'Manual',  statusColor: 'var(--color-muted)'   },
  ]

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-[18px] font-semibold text-[var(--color-ink)]">Lead capture</h2>
        <p className="text-[13px] text-[var(--color-muted)] mt-0.5">
          Where new leads come from and how they're handled.
        </p>
      </div>
      <Card padding={false}>
        {SOURCES.map((s) => (
          <div key={s.name} className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-hairline)] last:border-0">
            <p className="text-[14px] font-medium text-[var(--color-ink)]">{s.name}</p>
            <span className="text-[13px] font-semibold" style={{ color: s.statusColor }}>• {s.status}</span>
          </div>
        ))}
        <div className="px-5 py-4 border-t border-[var(--color-hairline)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] font-semibold text-[var(--color-ink)]">Auto-enroll new leads in welcome sequence</p>
              <p className="text-[12px] text-[var(--color-muted)] mt-0.5">New website leads start nurturing immediately</p>
            </div>
            <Toggle checked={autoEnroll} onChange={setAutoEnroll} />
          </div>
        </div>
      </Card>
      <Button variant="secondary" onClick={() => toast('Import coming soon', 'info')}>
        <Download size={14} /> Import a lead list
      </Button>
    </div>
  )
}

// ─── Notifications Tab ────────────────────────────────────────────────────────

const DEFAULT_NOTIFS = [
  { id: 'new-leads',    label: 'New leads',        desc: 'When a lead is captured',           enabled: true  },
  { id: 'replies',      label: 'Replies',          desc: 'When a lead replies to outreach',   enabled: true  },
  { id: 'campaigns',    label: 'Campaign reports', desc: 'When a campaign finishes',           enabled: true  },
  { id: 'invoices',     label: 'Overdue invoices', desc: 'Payment past due',                   enabled: true  },
  { id: 'digest',       label: 'Weekly digest',    desc: 'Monday morning summary',             enabled: false },
]

function NotificationsTab() {
  const [notifs, setNotifs] = useState(DEFAULT_NOTIFS)

  function toggle(id: string, v: boolean) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, enabled: v } : n))
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-[18px] font-semibold text-[var(--color-ink)]">Notifications</h2>
      <Card padding={false}>
        {notifs.map(n => (
          <div key={n.id} className="flex items-center justify-between gap-4 px-5 py-4 border-b border-[var(--color-hairline)] last:border-0">
            <div>
              <p className="text-[14px] font-semibold text-[var(--color-ink)]">{n.label}</p>
              <p className="text-[12px] text-[var(--color-muted)] mt-0.5">{n.desc}</p>
            </div>
            <Toggle checked={n.enabled} onChange={v => toggle(n.id, v)} />
          </div>
        ))}
      </Card>
    </div>
  )
}

// ─── Billing Tab ──────────────────────────────────────────────────────────────

function BillingTab() {
  const toast = useToast()
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-[18px] font-semibold text-[var(--color-ink)]">Billing</h2>
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-[16px] font-semibold text-[var(--color-ink)]">Growth Plan</h3>
              <Badge variant="purple">Current</Badge>
            </div>
            <p className="text-[13px] text-[var(--color-muted)]">
              Full-featured agency workspace with campaigns & client management.
            </p>
            <p className="text-[28px] font-bold font-[var(--font-mono)] text-[var(--color-ink)] mt-3">
              $850<span className="text-[14px] font-medium text-[var(--color-muted)]">/mo</span>
            </p>
          </div>
          <Button variant="secondary" onClick={() => toast('Upgrade options coming soon', 'info')}>
            Upgrade
          </Button>
        </div>
        <div className="mt-4 pt-4 border-t border-[var(--color-hairline)]">
          <p className="text-[12px] text-[var(--color-muted)]">
            Next billing date: <span className="text-[var(--color-ink)] font-medium">Jul 28, 2026</span>
          </p>
        </div>
      </Card>
    </div>
  )
}

// ─── Settings Page ────────────────────────────────────────────────────────────

const TAB_COMPONENTS: Record<Tab, React.ComponentType> = {
  agency:          AgencyTab,
  team:            TeamTab,
  integrations:    IntegrationsTab,
  'lead-capture':  LeadCaptureTab,
  notifications:   NotificationsTab,
  billing:         BillingTab,
}

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('agency')
  const toast = useToast()
  const ActiveTab = TAB_COMPONENTS[activeTab]

  return (
    <div className="flex gap-5 items-start">

      {/* Left inner nav */}
      <div className="w-[200px] flex-shrink-0 bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-hairline)] shadow-[var(--shadow-sm)] overflow-hidden">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] font-medium transition-all text-left border-b border-[var(--color-hairline)] last:border-0"
            style={activeTab === tab.key ? {
              borderLeft: '4px solid var(--color-purple)',
              color: 'var(--color-purple)',
              background: 'var(--color-purple-soft)',
              paddingLeft: '12px',
            } : {
              color: 'var(--color-muted)',
              borderLeft: '4px solid transparent',
              paddingLeft: '12px',
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Right content */}
      <div className="flex-1 min-w-0 bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-hairline)] shadow-[var(--shadow-sm)] p-6">
        <ActiveTab />
      </div>

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
