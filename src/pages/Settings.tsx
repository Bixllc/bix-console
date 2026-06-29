import React, { useState } from 'react'
import { User, Building2, Plug, Bell, CreditCard, Check, ExternalLink } from 'lucide-react'
import {
  Badge, Button, Card, CardHeader, Field, Input, Textarea,
  Toggle, useToast,
} from '@/components/ui'

// ─── Tab Navigation ───────────────────────────────────────────────────────────

type Tab = 'profile' | 'agency' | 'integrations' | 'notifications' | 'billing'

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: 'profile',       label: 'Profile',       icon: <User size={14} />       },
  { key: 'agency',        label: 'Agency',        icon: <Building2 size={14} />  },
  { key: 'integrations',  label: 'Integrations',  icon: <Plug size={14} />       },
  { key: 'notifications', label: 'Notifications', icon: <Bell size={14} />       },
  { key: 'billing',       label: 'Billing',       icon: <CreditCard size={14} /> },
]

// ─── Profile Tab ──────────────────────────────────────────────────────────────

function ProfileTab() {
  const toast = useToast()
  const [form, setForm] = useState({
    name: 'Sheneska Williams',
    email: 'admin@bixllc.net',
    role: 'Agency Owner',
    phone: '(214) 555-0100',
    bio: 'Founder of Bix LLC — helping local businesses grow their online presence.',
  })

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader title="Profile Information" subtitle="Your personal details" />

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[var(--color-hairline)]">
          <div className="w-16 h-16 rounded-full bg-[var(--color-purple)] flex items-center justify-center text-white text-[22px] font-bold font-[var(--font-display)]">
            S
          </div>
          <div>
            <p className="text-[14px] font-semibold text-[var(--color-ink)]">{form.name}</p>
            <p className="text-[12px] text-[var(--color-muted)]">{form.email}</p>
            <Button variant="ghost" size="sm" className="mt-1 -ml-2">Change photo</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Full Name">
            <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </Field>
          <Field label="Email Address">
            <Input value={form.email} readOnly className="opacity-60 cursor-not-allowed" />
          </Field>
          <Field label="Role">
            <Input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
          </Field>
          <Field label="Phone">
            <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          </Field>
          <div className="col-span-2">
            <Field label="Bio">
              <Textarea
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                rows={3}
              />
            </Field>
          </div>
        </div>

        <div className="flex justify-end mt-4 pt-4 border-t border-[var(--color-hairline)]">
          <Button variant="primary" onClick={() => toast('Profile saved')}>Save Changes</Button>
        </div>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader title="Password" subtitle="Update your password" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Current Password">
            <Input type="password" placeholder="••••••••" />
          </Field>
          <div />
          <Field label="New Password">
            <Input type="password" placeholder="••••••••" />
          </Field>
          <Field label="Confirm New Password">
            <Input type="password" placeholder="••••••••" />
          </Field>
        </div>
        <div className="flex justify-end mt-4 pt-4 border-t border-[var(--color-hairline)]">
          <Button variant="secondary" onClick={() => toast('Password updated')}>Update Password</Button>
        </div>
      </Card>
    </div>
  )
}

// ─── Agency Tab ───────────────────────────────────────────────────────────────

function AgencyTab() {
  const toast = useToast()
  const [form, setForm] = useState({
    name: 'Bix LLC',
    website: 'https://bixllc.net',
    tagline: 'We build websites that work as hard as you do.',
    email: 'hello@bixllc.net',
    phone: '(214) 555-0100',
    city: 'Dallas, TX',
    description: 'Bix LLC is a boutique web design & growth agency specializing in helping local businesses build a powerful online presence.',
  })

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader title="Agency Details" subtitle="Your business information" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Agency Name">
            <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </Field>
          <Field label="Website">
            <Input type="url" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} />
          </Field>
          <div className="col-span-2">
            <Field label="Tagline">
              <Input value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} />
            </Field>
          </div>
          <Field label="Contact Email">
            <Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </Field>
          <Field label="Phone">
            <Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          </Field>
          <Field label="Location">
            <Input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
          </Field>
          <div className="col-span-2">
            <Field label="Agency Description">
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
            </Field>
          </div>
        </div>
        <div className="flex justify-end mt-4 pt-4 border-t border-[var(--color-hairline)]">
          <Button variant="primary" onClick={() => toast('Agency settings saved')}>Save Changes</Button>
        </div>
      </Card>
    </div>
  )
}

// ─── Integrations Tab ─────────────────────────────────────────────────────────

interface Integration {
  id: string
  name: string
  description: string
  logo: string
  connected: boolean
  url?: string
}

const DEFAULT_INTEGRATIONS: Integration[] = [
  { id: 'calendly',  name: 'Calendly',   description: 'Booking links & scheduling automation',  logo: '📅', connected: true,  url: 'https://calendly.com/bixllc' },
  { id: 'supabase',  name: 'Supabase',   description: 'Database & auth backend',                 logo: '🛢️', connected: true  },
  { id: 'stripe',    name: 'Stripe',     description: 'Payment processing & subscriptions',      logo: '💳', connected: false },
  { id: 'meta',      name: 'Meta Ads',   description: 'Facebook & Instagram ad campaigns',       logo: '📱', connected: false },
]

function IntegrationsTab() {
  const toast = useToast()
  const [integrations, setIntegrations] = useState(DEFAULT_INTEGRATIONS)

  function toggleIntegration(id: string, value: boolean) {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, connected: value } : i))
    const name = integrations.find(i => i.id === id)?.name ?? id
    toast(value ? `${name} connected` : `${name} disconnected`, value ? 'success' : 'info')
  }

  function connectIntegration(id: string) {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, connected: true } : i))
    const name = integrations.find(i => i.id === id)?.name ?? id
    toast(`${name} connected!`)
  }

  return (
    <div className="flex flex-col gap-4">
      {integrations.map(int => (
        <Card key={int.id}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[var(--radius-base)] bg-[var(--color-bg)] border border-[var(--color-hairline)] flex items-center justify-center text-[24px]">
                {int.logo}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[14px] font-semibold text-[var(--color-ink)]">{int.name}</p>
                  {int.connected && (
                    <Badge variant="success">
                      <Check size={9} /> Connected
                    </Badge>
                  )}
                </div>
                <p className="text-[12px] text-[var(--color-muted)] mt-0.5">{int.description}</p>
                {int.url && int.connected && (
                  <a
                    href={int.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[11px] text-[var(--color-purple)] mt-1 hover:underline"
                  >
                    <ExternalLink size={10} /> {int.url}
                  </a>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              {int.connected ? (
                <>
                  <Toggle
                    checked={int.connected}
                    onChange={v => toggleIntegration(int.id, v)}
                  />
                  <Button variant="ghost" size="sm" onClick={() => toggleIntegration(int.id, false)}>
                    Disconnect
                  </Button>
                </>
              ) : (
                <>
                  <Toggle checked={false} onChange={v => { if (v) connectIntegration(int.id) }} />
                  <Button variant="secondary" size="sm" onClick={() => connectIntegration(int.id)}>
                    Connect
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

// ─── Notifications Tab ────────────────────────────────────────────────────────

interface NotifSetting {
  id: string
  label: string
  description: string
  enabled: boolean
}

const DEFAULT_NOTIFS: NotifSetting[] = [
  { id: 'new-lead',      label: 'New Lead',              description: 'When a new lead is added to the pipeline',        enabled: true  },
  { id: 'lead-stage',    label: 'Lead Stage Change',     description: 'When a lead moves to a new stage',                enabled: true  },
  { id: 'invoice-paid',  label: 'Invoice Paid',          description: 'When a client pays an invoice',                   enabled: true  },
  { id: 'invoice-over',  label: 'Invoice Overdue',       description: 'When an invoice becomes overdue',                 enabled: true  },
  { id: 'meeting-24h',   label: 'Meeting Reminder (24h)', description: 'Reminder 24 hours before a meeting',             enabled: true  },
  { id: 'meeting-1h',    label: 'Meeting Reminder (1h)',  description: 'Reminder 1 hour before a meeting',               enabled: false },
  { id: 'client-invite', label: 'Client Accepted Invite', description: 'When a client accepts their invitation',         enabled: true  },
  { id: 'campaign-done', label: 'Campaign Completed',    description: 'When a campaign finishes sending',                enabled: false },
]

function NotificationsTab() {
  const toast = useToast()
  const [notifs, setNotifs] = useState(DEFAULT_NOTIFS)

  function toggle(id: string, v: boolean) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, enabled: v } : n))
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader title="Email Notifications" subtitle="Control what emails you receive from Bix" />
        <div className="flex flex-col divide-y divide-[var(--color-hairline)]">
          {notifs.map(n => (
            <div key={n.id} className="flex items-center justify-between py-3.5 gap-4">
              <div>
                <p className="text-[13px] font-medium text-[var(--color-ink)]">{n.label}</p>
                <p className="text-[12px] text-[var(--color-muted)] mt-0.5">{n.description}</p>
              </div>
              <Toggle checked={n.enabled} onChange={v => toggle(n.id, v)} />
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4 pt-4 border-t border-[var(--color-hairline)]">
          <Button variant="primary" onClick={() => toast('Notification preferences saved')}>Save Preferences</Button>
        </div>
      </Card>
    </div>
  )
}

// ─── Billing Tab ──────────────────────────────────────────────────────────────

function BillingTab() {
  const toast = useToast()

  const PLAN_FEATURES = [
    'Unlimited leads & pipeline',
    'Up to 10 active clients',
    'Campaign composer & AI drafts',
    'Calendly integration',
    'Supabase backend',
    'Invoice management',
    'Priority support',
  ]

  return (
    <div className="flex flex-col gap-4">
      {/* Current Plan */}
      <Card>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-[16px] font-semibold text-[var(--color-ink)]">Agency Pro</h3>
              <Badge variant="purple">Current Plan</Badge>
            </div>
            <p className="text-[13px] text-[var(--color-muted)]">
              Full-featured agency workspace for growing teams.
            </p>
            <p className="text-[28px] font-bold font-[var(--font-mono)] text-[var(--color-ink)] mt-3">
              $97<span className="text-[14px] font-medium text-[var(--color-muted)]">/month</span>
            </p>
          </div>
          <Button variant="secondary" onClick={() => toast('Upgrade options coming soon', 'info')}>
            Upgrade Plan
          </Button>
        </div>

        <div className="mt-5 pt-4 border-t border-[var(--color-hairline)]">
          <p className="text-[12px] font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-3">What's included</p>
          <div className="grid grid-cols-2 gap-y-2 gap-x-4">
            {PLAN_FEATURES.map(f => (
              <div key={f} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-[var(--color-success-soft)] flex items-center justify-center flex-shrink-0">
                  <Check size={9} className="text-[var(--color-success)]" />
                </div>
                <span className="text-[12px] text-[var(--color-ink)]">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Billing Details */}
      <Card>
        <CardHeader title="Billing Details" subtitle="Payment method & history" />
        <div className="flex items-center justify-between py-3 border-b border-[var(--color-hairline)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-7 bg-[#1A1F71] rounded-[4px] flex items-center justify-center">
              <span className="text-white text-[8px] font-bold">VISA</span>
            </div>
            <div>
              <p className="text-[13px] font-medium text-[var(--color-ink)]">•••• •••• •••• 4242</p>
              <p className="text-[11px] text-[var(--color-muted)]">Expires 12/27</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => toast('Card management coming soon', 'info')}>
            Update
          </Button>
        </div>
        <div className="pt-3">
          <p className="text-[12px] text-[var(--color-muted)]">
            Next billing date: <span className="text-[var(--color-ink)] font-medium">Jul 29, 2026</span>
          </p>
        </div>
      </Card>

      {/* Danger Zone */}
      <Card>
        <CardHeader title="Danger Zone" />
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-[13px] font-medium text-[var(--color-ink)]">Cancel Subscription</p>
            <p className="text-[12px] text-[var(--color-muted)] mt-0.5">
              Your workspace will remain active until end of billing period.
            </p>
          </div>
          <Button variant="danger" size="sm" onClick={() => toast('Please contact support to cancel', 'error')}>
            Cancel Plan
          </Button>
        </div>
      </Card>
    </div>
  )
}

// ─── Settings Page ────────────────────────────────────────────────────────────

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const ActiveTab = {
    profile:       ProfileTab,
    agency:        AgencyTab,
    integrations:  IntegrationsTab,
    notifications: NotificationsTab,
    billing:       BillingTab,
  }[activeTab]

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div>
        <h1 className="text-[22px] font-semibold font-[var(--font-display)] text-[var(--color-ink)]">Settings</h1>
        <p className="text-[13px] text-[var(--color-muted)] mt-0.5">Manage your profile, agency, and preferences</p>
      </div>

      {/* Tab Nav */}
      <div className="flex items-center gap-1 border-b border-[var(--color-hairline)] -mx-0">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium border-b-2 -mb-px transition-all duration-150 ${
              activeTab === tab.key
                ? 'border-[var(--color-purple)] text-[var(--color-purple)]'
                : 'border-transparent text-[var(--color-muted)] hover:text-[var(--color-ink)]'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <ActiveTab />

    </div>
  )
}
