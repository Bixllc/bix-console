import { useState } from 'react'
import {
  Plus, Mail, MessageSquare, Star, Send, Sparkles,
  Eye, Reply, Megaphone, ChevronRight, RefreshCw,
} from 'lucide-react'
import {
  Badge, Button, Card, StatCard, Modal,
  Field, Input, Textarea, useToast,
} from '@/components/ui'
import { useConsoleStore } from '@/store/useConsoleStore'
import { mockSequences } from '@/data/mock'
import type { CampaignChannel, CampaignStatus } from '@/data/mock'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pct(a: number, b: number) {
  if (!b) return '—'
  return Math.round((a / b) * 100) + '%'
}

function channelLabel(ch: CampaignChannel): string {
  const map: Record<CampaignChannel, string> = {
    email: 'Email', sms: 'SMS', drip: 'Drip', 'cold-email': 'Cold Email', 'social-dm': 'Social DM',
  }
  return map[ch]
}

function channelIconEl(ch: CampaignChannel) {
  const cls = 'w-4 h-4 text-white'
  switch (ch) {
    case 'email':      return <Mail className={cls} />
    case 'sms':        return <MessageSquare className={cls} />
    case 'drip':       return <RefreshCw className={cls} />
    case 'cold-email': return <Star className={cls} />
    case 'social-dm':  return <MessageSquare className={cls} />
  }
}

function channelBg(ch: CampaignChannel): string {
  const map: Record<CampaignChannel, string> = {
    email: '#442061', sms: '#2E89E6', drip: '#1E8A5E', 'cold-email': '#B5810F', 'social-dm': '#442061',
  }
  return map[ch]
}

function statusBadgeVariant(s: CampaignStatus): 'success' | 'muted' | 'blue' | 'amber' | 'danger' {
  const map: Record<CampaignStatus, 'success' | 'muted' | 'blue' | 'amber' | 'danger'> = {
    active: 'success', draft: 'muted', scheduled: 'blue', completed: 'amber', paused: 'danger',
  }
  return map[s]
}

// ─── Channel Cards ────────────────────────────────────────────────────────────

const CHANNEL_CARDS = [
  { channel: 'email'      as CampaignChannel, label: 'Email',        stat: '41%',   statLabel: 'open rate',      sub: '1,064 sent' },
  { channel: 'sms'        as CampaignChannel, label: 'SMS',          stat: '94%',   statLabel: 'delivered',      sub: '176 sent'   },
  { channel: 'drip'       as CampaignChannel, label: 'Sequences',    stat: '58.4%', statLabel: 'enrolled active',sub: '40 enrolled' },
  { channel: 'cold-email' as CampaignChannel, label: 'Cold outreach',stat: '17%',   statLabel: 'reply rate',     sub: '187 sent'   },
  { channel: 'social-dm'  as CampaignChannel, label: 'Social DM',    stat: '28%',   statLabel: 'reply rate',     sub: '64 sent'    },
]

// ─── Funnel data ──────────────────────────────────────────────────────────────

const FUNNEL = [
  { label: 'Leads captured', value: 11, pct: 100, color: 'var(--color-blue)'    },
  { label: 'Contacted',      value: 9,  pct: 82,  color: 'var(--color-purple)'  },
  { label: 'Qualified',      value: 4,  pct: 36,  color: 'var(--color-amber)'   },
  { label: 'Proposal sent',  value: 2,  pct: 18,  color: 'var(--color-success)' },
  { label: 'Won',            value: 2,  pct: 18,  color: '#2ECC8B'              },
]

// ─── AI Drafts ────────────────────────────────────────────────────────────────

const AI_DRAFTS: Record<CampaignChannel, { subject?: string; body: string }> = {
  email: {
    subject: 'Your website could be working harder',
    body: `Hi there,\n\nI came across your business and was genuinely impressed. At Bix, we help local businesses turn their online presence into a real revenue engine.\n\nWould you be open to a quick 20-minute call this week?\n\n— Cam, Bix LLC`,
  },
  sms: {
    body: `Hey! This is Cam from Bix LLC. We help local businesses get more clients with custom websites & automation. Are you free for a quick 15-min call?`,
  },
  drip: {
    body: `Hey, I noticed your business and wanted to reach out. At Bix, we specialize in helping businesses like yours grow with professional web presence and automation.`,
  },
  'cold-email': {
    subject: 'Quick question about [Business]',
    body: `Hi [Name],\n\nI was checking out [Business] and had a thought — have you considered what a high-converting website could do for your revenue?\n\nWe recently helped a similar business increase bookings by 40% in 60 days.\n\nWorth a 15-minute call?\n\nBest,\nCam | Bix LLC`,
  },
  'social-dm': {
    body: `Hey! I came across your page and love what you're doing. Quick question — are you actively looking to grow your client base online? We help businesses like yours with websites + automation that convert. No pressure, just reaching out!`,
  },
}

// ─── Campaign Composer Modal ──────────────────────────────────────────────────

const CHANNELS_LIST: { value: CampaignChannel; label: string }[] = [
  { value: 'email',      label: 'Email'       },
  { value: 'sms',        label: 'SMS'         },
  { value: 'drip',       label: 'Sequence'    },
  { value: 'cold-email', label: 'Cold Email'  },
  { value: 'social-dm',  label: 'Social DM'   },
]

const EMPTY_CAMPAIGN = { channel: 'cold-email' as CampaignChannel, name: '', audience: '', subject: '', body: '' }

function CampaignComposer({
  open, onClose, defaultChannel,
}: { open: boolean; onClose: () => void; defaultChannel?: CampaignChannel }) {
  const addCampaign = useConsoleStore(s => s.addCampaign)
  const toast = useToast()
  const [form, setForm] = useState({ ...EMPTY_CAMPAIGN, channel: defaultChannel ?? 'cold-email' as CampaignChannel })
  const [drafting, setDrafting] = useState(false)

  function set<K extends keyof typeof EMPTY_CAMPAIGN>(k: K, v: typeof EMPTY_CAMPAIGN[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  function handleAIDraft() {
    setDrafting(true)
    setTimeout(() => {
      const draft = AI_DRAFTS[form.channel]
      setForm(f => ({ ...f, body: draft.body, subject: draft.subject ?? f.subject }))
      setDrafting(false)
      toast('AI draft generated', 'info')
    }, 1500)
  }

  function handleSend() {
    if (!form.name) { toast('Please give your campaign a name', 'error'); return }
    addCampaign({
      id: 'cam' + Date.now(), name: form.name, channel: form.channel, status: 'active',
      audience: form.audience || 'General', sent: 0, opens: 0, clicks: 0, replies: 0, conversions: 0,
      createdAt: new Date().toISOString().split('T')[0],
    })
    toast('Campaign sent!')
    setForm(EMPTY_CAMPAIGN)
    onClose()
  }

  function handleDraft() {
    if (!form.name) { toast('Please give your campaign a name', 'error'); return }
    addCampaign({
      id: 'cam' + Date.now(), name: form.name, channel: form.channel, status: 'draft',
      audience: form.audience || 'General', sent: 0, opens: 0, clicks: 0, replies: 0, conversions: 0,
      createdAt: new Date().toISOString().split('T')[0],
    })
    toast('Saved as draft', 'info')
    setForm(EMPTY_CAMPAIGN)
    onClose()
  }

  const showSubject = form.channel === 'email' || form.channel === 'cold-email'

  return (
    <Modal open={open} onClose={onClose} title="New campaign" width="max-w-2xl">
      <div className="flex flex-col gap-4">
        {/* Channel selector */}
        <div>
          <p className="text-[12px] font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-2">Channel</p>
          <div className="grid grid-cols-5 gap-1.5">
            {CHANNELS_LIST.map(ch => (
              <button
                key={ch.value}
                onClick={() => set('channel', ch.value)}
                className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-[var(--radius-base)] border text-center transition-all ${
                  form.channel === ch.value
                    ? 'border-[var(--color-purple)] bg-[var(--color-purple-soft)] text-[var(--color-purple)]'
                    : 'border-[var(--color-hairline)] bg-[var(--color-bg)] text-[var(--color-muted)] hover:border-[var(--color-purple)]'
                }`}
              >
                <div className="w-7 h-7 rounded-[var(--radius-sm)] flex items-center justify-center"
                  style={{ background: form.channel === ch.value ? 'var(--color-purple)' : channelBg(ch.value) }}>
                  {channelIconEl(ch.value)}
                </div>
                <span className="text-[10px] font-medium">{ch.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Campaign name *">
            <Input placeholder="Q3 cold outreach" value={form.name} onChange={e => set('name', e.target.value)} />
          </Field>
          <Field label="Audience">
            <Input placeholder="Local fitness businesses" value={form.audience} onChange={e => set('audience', e.target.value)} />
          </Field>
        </div>

        {showSubject && (
          <Field label="Subject line">
            <Input placeholder="Quick question about your website" value={form.subject} onChange={e => set('subject', e.target.value)} />
          </Field>
        )}

        <Field label="Message body">
          <Textarea placeholder="Write your message..." value={form.body} onChange={e => set('body', e.target.value)} rows={7} />
        </Field>

        <Button variant="ghost" size="sm" onClick={handleAIDraft} disabled={drafting} className="self-start">
          <Sparkles size={13} /> {drafting ? 'Drafting...' : 'AI Draft'}
        </Button>

        <div className="flex items-center justify-between pt-4 border-t border-[var(--color-hairline)]">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={handleDraft}>Save draft</Button>
            <Button variant="secondary" onClick={() => toast('Scheduling coming soon', 'info')}>Schedule</Button>
            <Button variant="primary" onClick={handleSend}><Send size={13} /> Send now</Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

// ─── Nurture Page ─────────────────────────────────────────────────────────────

export function Nurture() {
  const campaigns = useConsoleStore(s => s.campaigns)
  const [composerOpen, setComposerOpen] = useState(false)
  const [composerChannel, setComposerChannel] = useState<CampaignChannel | undefined>(undefined)
  const [filter, setFilter] = useState<'all' | 'active' | 'sent' | 'drafts'>('all')
  const toast = useToast()

  function openWithChannel(ch: CampaignChannel) {
    setComposerChannel(ch)
    setComposerOpen(true)
  }

  const filteredCampaigns = campaigns.filter(c => {
    if (filter === 'all')    return true
    if (filter === 'active') return c.status === 'active' || c.status === 'scheduled'
    if (filter === 'sent')   return c.status === 'completed'
    if (filter === 'drafts') return c.status === 'draft'
    return true
  })

  const FILTER_TABS: { key: typeof filter; label: string }[] = [
    { key: 'all',    label: 'All'    },
    { key: 'active', label: 'Active' },
    { key: 'sent',   label: 'Sent'   },
    { key: 'drafts', label: 'Drafts' },
  ]

  return (
    <div className="flex flex-col gap-6">

      {/* Hero */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold font-[var(--font-display)] text-[var(--color-ink)]">
            Nurture &amp; outreach
          </h1>
          <p className="text-[13px] text-[var(--color-muted)] mt-0.5">
            Turn leads into clients with email, SMS, sequences &amp; 1:1 outreach
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => toast('AI drafting coming soon', 'info')}>
            <Sparkles size={14} /> Draft with AI
          </Button>
          <Button variant="primary" onClick={() => { setComposerChannel(undefined); setComposerOpen(true) }}>
            <Plus size={14} /> New campaign
          </Button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Active campaigns"      value={3}       icon={<Megaphone size={16} />}  accent="blue"    deltaLabel="Running now" />
        <StatCard label="Messages sent (30d)"   value="915"     icon={<Send size={16} />}        accent="blue"    deltaLabel="All channels" />
        <StatCard label="Avg open rate"         value="43.6%"   icon={<Eye size={16} />}         accent="success" deltaLabel="Email + cold" />
        <StatCard label="Replies"               value={84}      icon={<Reply size={16} />}       accent="amber"   deltaLabel="Last 30 days" />
      </div>

      {/* Channel cards */}
      <div>
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[var(--color-muted)] mb-3">
          START AN OUTREACH
        </p>
        <div className="grid grid-cols-5 gap-3">
          {CHANNEL_CARDS.map(c => (
            <button
              key={c.channel}
              onClick={() => openWithChannel(c.channel)}
              className="bg-[var(--color-surface)] border border-[var(--color-hairline)] rounded-[var(--radius-lg)] p-4 flex flex-col gap-3 text-left hover:shadow-[var(--shadow-md)] hover:border-[var(--color-purple)] transition-all cursor-pointer"
            >
              <div className="w-9 h-9 rounded-[var(--radius-base)] flex items-center justify-center flex-shrink-0"
                style={{ background: channelBg(c.channel) }}>
                {channelIconEl(c.channel)}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[var(--color-ink)]">{c.label}</p>
                <p className="text-[18px] font-bold text-[var(--color-ink)] font-[var(--font-mono)] mt-0.5">{c.stat}</p>
                <p className="text-[11px] text-[var(--color-muted)]">{c.statLabel}</p>
                <p className="text-[11px] text-[var(--color-faint)] mt-1">{c.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 2-column layout */}
      <div className="flex gap-5 items-start">

        {/* Left: Campaigns */}
        <div className="flex-[3] min-w-0">
          <Card padding={false}>
            {/* Header + filter pills */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-hairline)]">
              <h3 className="text-[15px] font-semibold text-[var(--color-ink)]">Campaigns</h3>
              <div className="flex items-center gap-1">
                {FILTER_TABS.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`text-[12px] font-medium px-3 py-1.5 rounded-full transition-all duration-150 ${
                      filter === tab.key
                        ? 'bg-[var(--color-purple)] text-white'
                        : 'text-[var(--color-muted)] hover:bg-[rgba(20,16,31,0.05)] hover:text-[var(--color-ink)]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Campaign rows */}
            {filteredCampaigns.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-[13px] text-[var(--color-faint)]">No campaigns in this view</p>
              </div>
            ) : (
              <div>
                {filteredCampaigns.map(c => (
                  <div
                    key={c.id}
                    className="flex items-center gap-4 px-5 py-3.5 border-b border-[var(--color-hairline)] last:border-0 hover:bg-[var(--color-bg)] transition-colors cursor-pointer"
                  >
                    {/* Channel icon */}
                    <div className="w-8 h-8 rounded-[var(--radius-sm)] flex items-center justify-center flex-shrink-0"
                      style={{ background: channelBg(c.channel) }}>
                      {channelIconEl(c.channel)}
                    </div>

                    {/* Name + meta */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[var(--color-ink)] truncate">{c.name}</p>
                      <p className="text-[11px] text-[var(--color-muted)] mt-0.5">
                        {channelLabel(c.channel)} · {c.audience} · {c.createdAt}
                      </p>
                    </div>

                    {/* Stats if sent, badges if not */}
                    {c.sent > 0 ? (
                      <div className="flex items-center gap-5 flex-shrink-0">
                        <div className="text-center">
                          <p className="text-[10px] font-semibold text-[var(--color-muted)] uppercase tracking-wide">SENT</p>
                          <p className="text-[14px] font-bold text-[var(--color-ink)] font-[var(--font-mono)]">{c.sent}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-semibold text-[var(--color-muted)] uppercase tracking-wide">OPENS</p>
                          <p className="text-[14px] font-bold text-[var(--color-ink)] font-[var(--font-mono)]">{pct(c.opens, c.sent)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] font-semibold text-[var(--color-muted)] uppercase tracking-wide">REPLIES</p>
                          <p className="text-[14px] font-bold text-[var(--color-ink)] font-[var(--font-mono)]">{c.replies}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-shrink-0">
                        <Badge variant={statusBadgeVariant(c.status)}>
                          {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                        </Badge>
                      </div>
                    )}

                    <ChevronRight size={14} className="text-[var(--color-faint)] flex-shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right: Funnel + Sequences */}
        <div className="flex-[2] min-w-0 flex flex-col gap-4">

          {/* Conversion funnel */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-semibold text-[var(--color-ink)]">Conversion funnel</h3>
              <span className="text-[11px] text-[var(--color-muted)]">30 days</span>
            </div>
            <div className="flex flex-col gap-2">
              {FUNNEL.map(f => (
                <div key={f.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[12px] text-[var(--color-muted)]">{f.label}</span>
                    <span className="text-[12px] font-semibold font-[var(--font-mono)] text-[var(--color-ink)]">{f.value} · {f.pct}%</span>
                  </div>
                  <div className="h-2 bg-[rgba(20,16,31,0.06)] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${f.pct}%`, background: f.color }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Sequences */}
          <Card padding={false}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-hairline)]">
              <h3 className="text-[15px] font-semibold text-[var(--color-ink)]">Sequences</h3>
              <Button variant="ghost" size="sm" onClick={() => { setComposerChannel('drip'); setComposerOpen(true) }}>
                <Plus size={12} /> New
              </Button>
            </div>
            <div>
              {mockSequences.map(seq => (
                <div key={seq.id} className="flex items-center gap-3 px-5 py-3.5 border-b border-[var(--color-hairline)] last:border-0">
                  <div className="w-8 h-8 rounded-[var(--radius-sm)] bg-[var(--color-success-soft)] flex items-center justify-center flex-shrink-0">
                    <RefreshCw size={14} className="text-[var(--color-success)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[var(--color-ink)]">{seq.name}</p>
                    <p className="text-[11px] text-[var(--color-muted)] mt-0.5">{seq.steps} steps · {seq.enrolled} enrolled</p>
                  </div>
                  <Badge variant={seq.status === 'active' ? 'success' : 'muted'}>
                    {seq.status === 'active' ? 'Active' : 'Paused'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </div>

      {/* Campaign Composer */}
      <CampaignComposer
        open={composerOpen}
        onClose={() => { setComposerOpen(false); setComposerChannel(undefined) }}
        defaultChannel={composerChannel}
      />

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
