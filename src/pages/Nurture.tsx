import React, { useState } from 'react'
import { Plus, AtSign, Mail, MessageSquare, Zap, Edit2, PauseCircle, Send, Sparkles } from 'lucide-react'
import {
  Badge, Button, Card, CardHeader, StatCard, Modal,
  Field, Input, Textarea, useToast, EmptyState,
} from '@/components/ui'
import { useConsoleStore } from '@/store/useConsoleStore'
import type { CampaignChannel, CampaignStatus } from '@/data/mock'


function pct(a: number, b: number) {
  if (!b) return '—'
  return Math.round((a / b) * 100) + '%'
}

function channelBadgeVariant(ch: CampaignChannel): 'purple' | 'blue' | 'success' | 'amber' | 'muted' {
  const map: Record<CampaignChannel, 'purple' | 'blue' | 'success' | 'amber' | 'muted'> = {
    email: 'blue', sms: 'amber', drip: 'success', 'cold-email': 'purple', 'social-dm': 'muted',
  }
  return map[ch]
}

function channelLabel(ch: CampaignChannel) {
  const map: Record<CampaignChannel, string> = {
    email: 'Email', sms: 'SMS', drip: 'Drip', 'cold-email': 'Cold Email', 'social-dm': 'Social DM',
  }
  return map[ch]
}

function statusBadgeVariant(s: CampaignStatus): 'success' | 'muted' | 'blue' | 'amber' | 'danger' {
  const map: Record<CampaignStatus, 'success' | 'muted' | 'blue' | 'amber' | 'danger'> = {
    active: 'success', draft: 'muted', scheduled: 'blue', completed: 'amber', paused: 'danger',
  }
  return map[s]
}

// ─── Channel Stat Cards ───────────────────────────────────────────────────────

const channelStats = [
  { label: 'Cold Email', channel: 'cold-email' as CampaignChannel, sent: 142, openRate: '50%', icon: <Mail size={16} />, accent: 'blue' as const },
  { label: 'SMS',        channel: 'sms'        as CampaignChannel, sent: 0,   openRate: 'Draft', icon: <MessageSquare size={16} />, accent: 'amber' as const },
  { label: 'Drip',       channel: 'drip'       as CampaignChannel, sent: 24,  openRate: '92%',   icon: <Zap size={16} />,           accent: 'success' as const },
  { label: 'Social DM',  channel: 'social-dm'  as CampaignChannel, sent: 89,  openRate: '100%',  icon: <AtSign size={16} />,      accent: 'purple' as const },
]

// ─── Channel Picker ───────────────────────────────────────────────────────────

const CHANNELS: { value: CampaignChannel; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: 'email',      label: 'Email',      icon: <Mail size={16} />,          desc: 'Newsletter style' },
  { value: 'sms',        label: 'SMS',        icon: <MessageSquare size={16} />, desc: 'Text message' },
  { value: 'drip',       label: 'Drip',       icon: <Zap size={16} />,           desc: 'Automated sequence' },
  { value: 'cold-email', label: 'Cold Email', icon: <Send size={16} />,           desc: 'Outreach email' },
  { value: 'social-dm',  label: 'Social DM',  icon: <AtSign size={16} />,      desc: 'AtSign DM' },
]

// ─── Preview Components ───────────────────────────────────────────────────────

function EmailPreview({ subject, body }: { subject: string; body: string }) {
  return (
    <div className="bg-white border border-[var(--color-hairline)] rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-md)]">
      <div className="bg-[var(--color-bg)] px-4 py-2.5 border-b border-[var(--color-hairline)] flex items-center gap-3">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
          <span className="w-3 h-3 rounded-full bg-[#28C840]" />
        </div>
        <span className="text-[11px] text-[var(--color-muted)]">Email Preview</span>
      </div>
      <div className="p-4">
        <div className="border-b border-[var(--color-hairline)] pb-3 mb-3 space-y-1">
          <p className="text-[11px] text-[var(--color-muted)]"><span className="font-medium">From:</span> Sheneska @ Bix LLC &lt;hello@bixllc.net&gt;</p>
          <p className="text-[11px] text-[var(--color-muted)]"><span className="font-medium">Subject:</span> {subject || 'Your subject line'}</p>
        </div>
        <div className="text-[13px] text-[var(--color-ink)] leading-relaxed whitespace-pre-wrap min-h-[80px]">
          {body || <span className="text-[var(--color-faint)]">Your message will appear here...</span>}
        </div>
        <div className="mt-4 pt-3 border-t border-[var(--color-hairline)]">
          <p className="text-[10px] text-[var(--color-faint)]">Bix LLC · Dallas, TX · Unsubscribe</p>
        </div>
      </div>
    </div>
  )
}

function SMSPreview({ body }: { body: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-[220px] bg-[#1C1C1E] rounded-[32px] p-3 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        <div className="bg-[#2C2C2E] rounded-[24px] p-3">
          <div className="flex justify-center mb-3">
            <div className="w-12 h-1 bg-[#3A3A3C] rounded-full" />
          </div>
          <div className="text-[11px] text-[#8E8E93] text-center mb-3">SMS Preview</div>
          <div className="flex justify-end">
            <div className="bg-[#34C759] rounded-[18px] rounded-br-[4px] px-3 py-2 max-w-[160px]">
              <p className="text-[12px] text-white leading-snug whitespace-pre-wrap">
                {body || 'Your SMS message will appear here...'}
              </p>
            </div>
          </div>
          <p className="text-[10px] text-[#636366] text-right mt-1">Delivered</p>
        </div>
      </div>
    </div>
  )
}

function SocialDMPreview({ body }: { body: string }) {
  return (
    <div className="bg-white border border-[var(--color-hairline)] rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-md)]">
      <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[var(--color-hairline)] bg-white">
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] flex items-center justify-center">
          <AtSign size={14} className="text-white" />
        </div>
        <div>
          <p className="text-[12px] font-semibold text-[var(--color-ink)]">bixllc</p>
          <p className="text-[10px] text-[var(--color-faint)]">AtSign Direct Message</p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#F77737] flex-shrink-0" />
          <div className="bg-[var(--color-bg)] rounded-[18px] rounded-tl-[4px] px-3 py-2 max-w-[200px]">
            <p className="text-[12px] text-[var(--color-ink)] leading-snug whitespace-pre-wrap">
              {body || 'Hey! Your message will appear here...'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function DripPreview({ body }: { body: string }) {
  const steps = ['Day 1: Initial outreach', 'Day 3: Follow-up value add', 'Day 7: Social proof', 'Day 14: Soft close']
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[12px] font-semibold text-[var(--color-muted)] mb-1">Sequence Steps</p>
      {steps.map((step, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${i === 0 ? 'bg-[var(--color-purple)] text-white' : 'bg-[var(--color-bg)] border border-[var(--color-hairline)] text-[var(--color-muted)]'}`}>
              {i + 1}
            </div>
            {i < steps.length - 1 && <div className="w-px h-4 bg-[var(--color-hairline)] my-0.5" />}
          </div>
          <div className={`flex-1 pb-2 rounded-[var(--radius-sm)] ${i === 0 ? 'text-[var(--color-ink)]' : 'text-[var(--color-muted)]'}`}>
            <p className="text-[12px] font-medium">{step}</p>
            {i === 0 && body && (
              <p className="text-[11px] text-[var(--color-muted)] mt-0.5 line-clamp-2">{body}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── AI Draft content per channel ─────────────────────────────────────────────

const AI_DRAFTS: Record<CampaignChannel, { subject?: string; body: string }> = {
  email: {
    subject: 'Your website could be working harder 🚀',
    body: `Hi there,

I came across your business and I'm genuinely impressed by what you've built. At Bix, we help local businesses like yours turn their online presence into a real revenue engine.

Most businesses are leaving 30–50% of their potential revenue on the table simply because their website isn't built to convert.

Would you be open to a quick 20-minute call this week? I'd love to show you exactly what we'd do for you.

— Sheneska, Bix LLC`,
  },
  sms: {
    body: `Hey! This is Sheneska from Bix LLC. We help local businesses get more clients with custom websites & automation. I'd love to show you what we've done for businesses like yours. Are you free for a quick 15-min call this week?`,
  },
  drip: {
    body: `Hey there, I noticed your business online and wanted to reach out. At Bix, we specialize in helping businesses like yours grow with professional web presence and automation. Here's a quick win we achieved for a recent client...`,
  },
  'cold-email': {
    subject: 'Quick question about [Business Name]',
    body: `Hi [Name],

I was checking out [Business Name] and had a thought — have you considered what a high-converting website could do for your revenue?

We recently helped [similar business] increase their bookings by 40% in just 60 days.

Would a 15-minute call this week work for you?

Best,
Sheneska | Bix LLC`,
  },
  'social-dm': {
    body: `Hey! I came across your page and love what you're doing with [Business]. Quick question — are you actively looking to grow your client base online? We help businesses like yours with websites + automation that actually convert. No pressure, just thought I'd reach out! 🙌`,
  },
}

// ─── Campaign Composer Modal ──────────────────────────────────────────────────

const EMPTY_CAMPAIGN = {
  channel: 'cold-email' as CampaignChannel,
  name: '',
  audience: '',
  subject: '',
  body: '',
}

function CampaignComposer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addCampaign = useConsoleStore(s => s.addCampaign)
  const toast = useToast()
  const [form, setForm] = useState(EMPTY_CAMPAIGN)
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
      id: 'cam' + Date.now(),
      name: form.name,
      channel: form.channel,
      status: 'active',
      audience: form.audience || 'General',
      sent: 0,
      opens: 0,
      clicks: 0,
      replies: 0,
      conversions: 0,
      createdAt: new Date().toISOString().split('T')[0],
    })
    toast('Campaign sent successfully!')
    setForm(EMPTY_CAMPAIGN)
    onClose()
  }

  function handleDraft() {
    if (!form.name) { toast('Please give your campaign a name', 'error'); return }
    addCampaign({
      id: 'cam' + Date.now(),
      name: form.name,
      channel: form.channel,
      status: 'draft',
      audience: form.audience || 'General',
      sent: 0, opens: 0, clicks: 0, replies: 0, conversions: 0,
      createdAt: new Date().toISOString().split('T')[0],
    })
    toast('Saved as draft', 'info')
    setForm(EMPTY_CAMPAIGN)
    onClose()
  }

  const showSubject = form.channel === 'email' || form.channel === 'cold-email'

  return (
    <Modal open={open} onClose={onClose} title="Campaign Composer" width="max-w-4xl">
      <div className="flex gap-5 min-h-[480px]">

        {/* Left Panel */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">

          {/* Channel Picker */}
          <div>
            <p className="text-[12px] font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-2">Channel</p>
            <div className="grid grid-cols-5 gap-1.5">
              {CHANNELS.map(ch => (
                <button
                  key={ch.value}
                  onClick={() => set('channel', ch.value)}
                  className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-[var(--radius-base)] border text-center transition-all duration-150 ${
                    form.channel === ch.value
                      ? 'border-[var(--color-purple)] bg-[var(--color-purple-soft)] text-[var(--color-purple)]'
                      : 'border-[var(--color-hairline)] bg-[var(--color-bg)] text-[var(--color-muted)] hover:border-[var(--color-purple)]'
                  }`}
                >
                  {ch.icon}
                  <span className="text-[10px] font-medium leading-tight">{ch.label}</span>
                </button>
              ))}
            </div>
          </div>

          <Field label="Campaign Name *">
            <Input
              placeholder="Beauty Industry Q3 Outreach"
              value={form.name}
              onChange={e => set('name', e.target.value)}
            />
          </Field>

          <Field label="Audience">
            <Input
              placeholder="Beauty & Wellness businesses"
              value={form.audience}
              onChange={e => set('audience', e.target.value)}
            />
          </Field>

          {showSubject && (
            <Field label="Subject Line">
              <Input
                placeholder="Your website could be working harder 🚀"
                value={form.subject}
                onChange={e => set('subject', e.target.value)}
              />
            </Field>
          )}

          <Field label="Message Body">
            <Textarea
              placeholder="Write your message..."
              value={form.body}
              onChange={e => set('body', e.target.value)}
              rows={7}
            />
          </Field>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleAIDraft}
            disabled={drafting}
            className="self-start"
          >
            <Sparkles size={13} />
            {drafting ? 'Drafting...' : 'AI Draft'}
          </Button>
        </div>

        {/* Divider */}
        <div className="w-px bg-[var(--color-hairline)]" />

        {/* Right Panel — Live Preview */}
        <div className="w-[280px] flex-shrink-0 flex flex-col gap-3">
          <p className="text-[12px] font-semibold text-[var(--color-muted)] uppercase tracking-wide">Live Preview</p>
          <div className="flex-1 flex flex-col justify-start">
            {form.channel === 'sms' ? (
              <SMSPreview body={form.body} />
            ) : form.channel === 'social-dm' ? (
              <SocialDMPreview body={form.body} />
            ) : form.channel === 'drip' || (form.channel === 'cold-email' && !form.subject) ? (
              form.channel === 'drip' ? (
                <DripPreview body={form.body} />
              ) : (
                <EmailPreview subject={form.subject} body={form.body} />
              )
            ) : (
              <EmailPreview subject={form.subject} body={form.body} />
            )}
          </div>
        </div>

      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-[var(--color-hairline)]">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={handleDraft}>Save Draft</Button>
          <Button variant="secondary">Schedule</Button>
          <Button variant="primary" onClick={handleSend}><Send size={13} /> Send Now</Button>
        </div>
      </div>
    </Modal>
  )
}

// ─── Nurture Page ─────────────────────────────────────────────────────────────

export function Nurture() {
  const campaigns = useConsoleStore(s => s.campaigns)
  const [composerOpen, setComposerOpen] = useState(false)
  const toast = useToast()

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold font-[var(--font-display)] text-[var(--color-ink)]">
            Nurture & Outreach
          </h1>
          <p className="text-[13px] text-[var(--color-muted)] mt-0.5">
            Campaigns, sequences, and outreach channels
          </p>
        </div>
        <Button variant="primary" onClick={() => setComposerOpen(true)}>
          <Plus size={14} /> New Campaign
        </Button>
      </div>

      {/* Channel Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {channelStats.map(s => (
          <StatCard
            key={s.channel}
            label={s.label}
            value={`${s.sent} sent`}
            deltaLabel={`${s.openRate} open rate`}
            icon={s.icon}
            accent={s.accent}
          />
        ))}
      </div>

      {/* Campaign Table */}
      <Card padding={false}>
        <div className="p-5 pb-0">
          <CardHeader title="Campaigns" subtitle={`${campaigns.length} total`} />
        </div>
        {campaigns.length === 0 ? (
          <EmptyState
            icon={<Send size={24} />}
            title="No campaigns yet"
            description="Create your first campaign to start reaching leads."
            action={
              <Button variant="primary" size="sm" onClick={() => setComposerOpen(true)}>
                <Plus size={13} /> New Campaign
              </Button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-hairline)]">
                  {['Name', 'Channel', 'Status', 'Sent', 'Opens', 'Replies', 'Conversions', ''].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wide px-5 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {campaigns.map(c => (
                  <tr key={c.id} className="border-b border-[var(--color-hairline)] last:border-0 hover:bg-[var(--color-bg)] transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] font-medium text-[var(--color-ink)]">{c.name}</p>
                      <p className="text-[11px] text-[var(--color-muted)] mt-0.5">{c.audience}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={channelBadgeVariant(c.channel)}>{channelLabel(c.channel)}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={statusBadgeVariant(c.status)}>
                        {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] font-[var(--font-mono)] text-[var(--color-ink)]">{c.sent}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] font-[var(--font-mono)] text-[var(--color-ink)]">
                        {pct(c.opens, c.sent)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] font-[var(--font-mono)] text-[var(--color-ink)]">{c.replies}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] font-[var(--font-mono)] text-[var(--color-ink)]">{c.conversions}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast('Edit coming soon', 'info')}
                        >
                          <Edit2 size={12} /> Edit
                        </Button>
                        {c.status === 'active' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toast('Campaign paused', 'info')}
                          >
                            <PauseCircle size={12} /> Pause
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Campaign Composer */}
      <CampaignComposer open={composerOpen} onClose={() => setComposerOpen(false)} />

    </div>
  )
}
