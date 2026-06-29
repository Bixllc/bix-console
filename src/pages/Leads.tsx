import { useState } from 'react'
import {
  Plus, AtSign, Globe, Mail, MessageSquare, Users,
  Phone, FileText, ArrowRight, Calendar,
} from 'lucide-react'
import {
  Badge, Button, Drawer, Modal,
  Field, Input, Select, Textarea,
  useToast,
} from '@/components/ui'
import { useConsoleStore } from '@/store/useConsoleStore'
import type { Lead, LeadStage, LeadSource, Activity } from '@/data/mock'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtMoney(n: number) {
  return '$' + n.toLocaleString()
}

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const STAGES: { key: LeadStage; label: string }[] = [
  { key: 'new',       label: 'New'       },
  { key: 'contacted', label: 'Contacted' },
  { key: 'qualified', label: 'Qualified' },
  { key: 'proposal',  label: 'Proposal'  },
  { key: 'won',       label: 'Won'       },
]

const stageBadgeVariant: Record<LeadStage | 'lost', 'purple' | 'blue' | 'success' | 'amber' | 'danger' | 'muted'> = {
  new: 'muted', contacted: 'blue', qualified: 'amber',
  proposal: 'purple', won: 'success', lost: 'danger',
}

const columnBg: Record<string, string> = {
  new:       'bg-[rgba(20,16,31,0.03)]',
  contacted: 'bg-[var(--color-blue-soft)]',
  qualified: 'bg-[var(--color-amber-soft)]',
  proposal:  'bg-[var(--color-purple-soft)]',
  won:       'bg-[var(--color-success-soft)]',
}

function TempDot({ temp }: { temp: 'hot' | 'warm' | 'cold' }) {
  const color = temp === 'hot'
    ? 'bg-[var(--color-danger)]'
    : temp === 'warm'
    ? 'bg-[var(--color-amber)]'
    : 'bg-[var(--color-blue)]'
  return <span className={`w-2 h-2 rounded-full ${color} flex-shrink-0`} title={temp} />
}

function SourceIcon({ source }: { source: LeadSource }) {
  const cls = 'w-3.5 h-3.5 text-[var(--color-faint)]'
  switch (source) {
    case 'instagram':  return <AtSign className={cls} />
    case 'google':     return <Globe className={cls} />
    case 'cold-email': return <Mail className={cls} />
    case 'website':    return <Globe className={cls} />
    case 'sms':        return <MessageSquare className={cls} />
    case 'referral':   return <Users className={cls} />
    default:           return <FileText className={cls} />
  }
}

function ActivityIcon({ type }: { type: Activity['type'] }) {
  const cls = 'w-3.5 h-3.5'
  switch (type) {
    case 'email':        return <Mail className={cls} />
    case 'call':         return <Phone className={cls} />
    case 'meeting':      return <Calendar className={cls} />
    case 'stage-change': return <ArrowRight className={cls} />
    default:             return <FileText className={cls} />
  }
}

// ─── Lead Card ───────────────────────────────────────────────────────────────

function LeadCard({ lead, onClick }: { lead: Lead; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-[var(--color-surface)] rounded-[var(--radius-base)] border border-[var(--color-hairline)] shadow-[var(--shadow-sm)] p-3 cursor-pointer hover:shadow-[var(--shadow-md)] hover:border-[var(--color-purple)] transition-all duration-150 group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-[13px] font-semibold text-[var(--color-ink)] leading-tight group-hover:text-[var(--color-purple)] transition-colors">
          {lead.business}
        </p>
        <TempDot temp={lead.temperature} />
      </div>
      <p className="text-[11px] text-[var(--color-muted)] mb-2">{lead.contact}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <SourceIcon source={lead.source} />
          <span className="text-[11px] font-semibold font-[var(--font-mono)] text-[var(--color-ink)]">
            {fmtMoney(lead.value)}
          </span>
        </div>
        <Badge variant={stageBadgeVariant[lead.stage]}>{STAGES.find(s => s.key === lead.stage)?.label}</Badge>
      </div>
    </div>
  )
}

// ─── Lead Drawer ─────────────────────────────────────────────────────────────

function LeadDrawer({ lead, onClose }: { lead: Lead | null; onClose: () => void }) {
  const moveLead = useConsoleStore(s => s.moveLead)
  const toast = useToast()

  if (!lead) return <Drawer open={false} onClose={onClose} title="" children={null} />

  function handleStageChange(stage: LeadStage) {
    moveLead(lead!.id, stage)
    toast(`Stage updated to ${stage}`, 'success')
  }

  return (
    <Drawer open title={lead.business} onClose={onClose} width="w-[520px]">
      <div className="flex flex-col gap-6 p-6">

        {/* Header info */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-[18px] font-semibold text-[var(--color-ink)]">{lead.business}</h3>
            <p className="text-[13px] text-[var(--color-muted)] mt-0.5">{lead.industry}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={stageBadgeVariant[lead.stage]}>
              {STAGES.find(s => s.key === lead.stage)?.label}
            </Badge>
            <TempDot temp={lead.temperature} />
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Contact',  value: lead.contact },
            { label: 'Email',    value: lead.email },
            { label: 'Phone',    value: lead.phone ?? '—' },
            { label: 'Value',    value: fmtMoney(lead.value) },
            { label: 'Source',   value: lead.source },
            { label: 'Created',  value: fmtDate(lead.createdAt) },
          ].map(item => (
            <div key={item.label} className="bg-[var(--color-bg)] rounded-[var(--radius-base)] p-3">
              <p className="text-[11px] font-medium text-[var(--color-muted)] uppercase tracking-wide mb-0.5">
                {item.label}
              </p>
              <p className="text-[13px] font-medium text-[var(--color-ink)] truncate">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Stage Selector */}
        <div>
          <p className="text-[12px] font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-2">
            Move Stage
          </p>
          <div className="grid grid-cols-5 gap-1.5">
            {STAGES.map(s => (
              <button
                key={s.key}
                onClick={() => handleStageChange(s.key)}
                className={`text-[11px] font-medium py-1.5 px-2 rounded-[var(--radius-sm)] border transition-all duration-150 ${
                  lead.stage === s.key
                    ? 'border-[var(--color-purple)] bg-[var(--color-purple)] text-white'
                    : 'border-[var(--color-hairline)] bg-[var(--color-bg)] text-[var(--color-muted)] hover:border-[var(--color-purple)] hover:text-[var(--color-purple)]'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        {lead.notes && (
          <div>
            <p className="text-[12px] font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-2">Notes</p>
            <p className="text-[13px] text-[var(--color-ink)] bg-[var(--color-bg)] rounded-[var(--radius-base)] p-3 leading-relaxed">
              {lead.notes}
            </p>
          </div>
        )}

        {/* Activity Timeline */}
        <div>
          <p className="text-[12px] font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-3">
            Activity ({lead.activities.length})
          </p>
          {lead.activities.length === 0 ? (
            <p className="text-[13px] text-[var(--color-faint)] text-center py-4">No activity recorded yet</p>
          ) : (
            <div className="flex flex-col gap-3">
              {lead.activities.map((a, i) => (
                <div key={a.id} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-[var(--color-purple-soft)] text-[var(--color-purple)] flex items-center justify-center flex-shrink-0">
                      <ActivityIcon type={a.type} />
                    </div>
                    {i < lead.activities.length - 1 && (
                      <div className="w-px flex-1 bg-[var(--color-hairline)] my-1 min-h-[16px]" />
                    )}
                  </div>
                  <div className="pb-3 flex-1 min-w-0">
                    <p className="text-[13px] text-[var(--color-ink)] leading-snug">{a.content}</p>
                    <p className="text-[11px] text-[var(--color-faint)] mt-0.5">{fmtDate(a.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </Drawer>
  )
}

// ─── Add Lead Modal ───────────────────────────────────────────────────────────

const EMPTY_FORM = {
  business: '', contact: '', email: '', phone: '', value: '',
  stage: 'new' as LeadStage, temperature: 'warm' as 'hot' | 'warm' | 'cold',
  source: 'website' as LeadSource, industry: '', notes: '',
}

function AddLeadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addLead = useConsoleStore(s => s.addLead)
  const toast = useToast()
  const [form, setForm] = useState(EMPTY_FORM)

  function set<K extends keyof typeof EMPTY_FORM>(k: K, v: typeof EMPTY_FORM[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.business || !form.contact || !form.email) {
      toast('Please fill in all required fields', 'error')
      return
    }
    const now = new Date().toISOString().split('T')[0]
    addLead({
      id: 'l' + Date.now(),
      business: form.business,
      contact: form.contact,
      email: form.email,
      phone: form.phone || undefined,
      value: parseFloat(form.value) || 0,
      stage: form.stage,
      temperature: form.temperature,
      source: form.source,
      industry: form.industry,
      notes: form.notes || undefined,
      createdAt: now,
      updatedAt: now,
      activities: [],
    })
    toast('Lead added successfully')
    setForm(EMPTY_FORM)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Add New Lead" width="max-w-xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Business Name *">
            <Input
              placeholder="Glow Beauty Bar"
              value={form.business}
              onChange={e => set('business', e.target.value)}
            />
          </Field>
          <Field label="Contact Name *">
            <Input
              placeholder="Maya Johnson"
              value={form.contact}
              onChange={e => set('contact', e.target.value)}
            />
          </Field>
          <Field label="Email *">
            <Input
              type="email"
              placeholder="maya@example.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
            />
          </Field>
          <Field label="Phone">
            <Input
              type="tel"
              placeholder="(214) 555-0192"
              value={form.phone}
              onChange={e => set('phone', e.target.value)}
            />
          </Field>
          <Field label="Est. Value ($)">
            <Input
              type="number"
              placeholder="3500"
              value={form.value}
              onChange={e => set('value', e.target.value)}
            />
          </Field>
          <Field label="Industry">
            <Input
              placeholder="Beauty"
              value={form.industry}
              onChange={e => set('industry', e.target.value)}
            />
          </Field>
          <Field label="Stage">
            <Select value={form.stage} onChange={e => set('stage', e.target.value as LeadStage)}>
              {STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </Select>
          </Field>
          <Field label="Temperature">
            <Select value={form.temperature} onChange={e => set('temperature', e.target.value as 'hot' | 'warm' | 'cold')}>
              <option value="hot">🔥 Hot</option>
              <option value="warm">🟡 Warm</option>
              <option value="cold">🔵 Cold</option>
            </Select>
          </Field>
          <Field label="Source">
            <Select value={form.source} onChange={e => set('source', e.target.value as LeadSource)}>
              <option value="referral">Referral</option>
              <option value="instagram">Instagram</option>
              <option value="google">Google</option>
              <option value="cold-email">Cold Email</option>
              <option value="website">Website</option>
              <option value="sms">SMS</option>
            </Select>
          </Field>
        </div>
        <Field label="Notes">
          <Textarea
            placeholder="Any context about this lead..."
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            rows={3}
          />
        </Field>
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--color-hairline)]">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary"><Plus size={14} /> Add Lead</Button>
        </div>
      </form>
    </Modal>
  )
}

// ─── Leads Page ───────────────────────────────────────────────────────────────

export function Leads() {
  const leads = useConsoleStore(s => s.leads)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [addOpen, setAddOpen] = useState(false)

  return (
    <div className="flex flex-col gap-5 min-h-0">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold font-[var(--font-display)] text-[var(--color-ink)]">
            Lead Pipeline
          </h1>
          <p className="text-[13px] text-[var(--color-muted)] mt-0.5">
            {leads.length} leads · ${leads.reduce((s, l) => s + l.value, 0).toLocaleString()} total pipeline
          </p>
        </div>
        <Button variant="primary" onClick={() => setAddOpen(true)}>
          <Plus size={14} /> Add Lead
        </Button>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
        {STAGES.map(({ key, label }) => {
          const colLeads = leads.filter(l => l.stage === key)
          const colTotal = colLeads.reduce((s, l) => s + l.value, 0)

          return (
            <div
              key={key}
              className={`flex-shrink-0 w-[260px] rounded-[var(--radius-lg)] p-3 ${columnBg[key]} border border-[var(--color-hairline)]`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant={stageBadgeVariant[key]}>{label}</Badge>
                  <span className="text-[12px] font-semibold font-[var(--font-mono)] text-[var(--color-muted)]">
                    {colLeads.length}
                  </span>
                </div>
                <span className="text-[11px] font-medium text-[var(--color-faint)] font-[var(--font-mono)]">
                  {fmtMoney(colTotal)}
                </span>
              </div>

              {/* Lead Cards */}
              <div className="flex flex-col gap-2">
                {colLeads.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-[11px] text-[var(--color-faint)]">No leads</p>
                  </div>
                ) : (
                  colLeads.map(lead => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      onClick={() => setSelectedLead(lead)}
                    />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Lead Detail Drawer */}
      <LeadDrawer lead={selectedLead} onClose={() => setSelectedLead(null)} />

      {/* Add Lead Modal */}
      <AddLeadModal open={addOpen} onClose={() => setAddOpen(false)} />

    </div>
  )
}
