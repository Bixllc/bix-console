import { useState } from 'react'
import {
  Filter, DollarSign, Flame, CheckCircle, Heart, UserPlus,
  Mail, MessageCircle, Phone, Calendar, ArrowRight, FileText,
  Zap, Wind, Sparkles,
} from 'lucide-react'
import {
  Button, StatCard, Drawer, Modal,
  Field, Input, Select, Textarea, useToast,
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

function sourceLabel(source: LeadSource): string {
  const map: Record<LeadSource, string> = {
    referral: 'Referral', website: 'Website form', 'cold-email': 'Imported list',
    instagram: 'Instagram', google: 'Google', sms: 'SMS',
  }
  return map[source]
}

// ─── Stage Config ─────────────────────────────────────────────────────────────

const STAGES: { key: LeadStage; label: string; dotColor: string }[] = [
  { key: 'new',       label: 'New',       dotColor: '#2E89E6' },
  { key: 'contacted', label: 'Contacted', dotColor: '#442061' },
  { key: 'qualified', label: 'Qualified', dotColor: '#B5810F' },
  { key: 'proposal',  label: 'Proposal',  dotColor: '#1E8A5E' },
  { key: 'won',       label: 'Won',       dotColor: '#2ECC8B' },
]

// ─── Temperature Badge ────────────────────────────────────────────────────────

function TempBadge({ temp }: { temp: 'hot' | 'warm' | 'cold' }) {
  if (temp === 'hot') return (
    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[var(--color-amber-soft)] text-[var(--color-amber)] flex-shrink-0">
      <Flame size={8} /> HOT
    </span>
  )
  if (temp === 'warm') return (
    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[var(--color-amber-soft)] text-[var(--color-amber)] flex-shrink-0">
      <Zap size={8} /> WARM
    </span>
  )
  return (
    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[var(--color-blue-soft)] text-[var(--color-blue)] flex-shrink-0">
      <Wind size={8} /> COLD
    </span>
  )
}

// ─── Activity Icon ────────────────────────────────────────────────────────────

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
      className="bg-[var(--color-surface)] rounded-[var(--radius-base)] border border-[var(--color-hairline)] p-4 cursor-pointer hover:shadow-[var(--shadow-md)] hover:border-[var(--color-purple)] transition-all duration-150"
    >
      {/* Top row: business name + temp badge */}
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <p className="text-[13px] font-semibold text-[var(--color-ink)] leading-tight">{lead.business}</p>
        <TempBadge temp={lead.temperature} />
      </div>
      {/* Contact · industry */}
      <p className="text-[12px] text-[var(--color-muted)] mb-2.5">{lead.contact} · {lead.industry}</p>
      {/* Value + icons + source */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-[var(--color-ink)] font-[var(--font-mono)]">{fmtMoney(lead.value)}</span>
          <Mail size={12} className="text-[var(--color-faint)]" />
          <MessageCircle size={12} className="text-[var(--color-faint)]" />
        </div>
        <span className="text-[11px] text-[var(--color-faint)]">{sourceLabel(lead.source)}</span>
      </div>
    </div>
  )
}

// ─── Lead Detail Drawer ───────────────────────────────────────────────────────

function LeadDrawer({ lead, onClose }: { lead: Lead | null; onClose: () => void }) {
  const moveLead = useConsoleStore(s => s.moveLead)
  const toast = useToast()

  if (!lead) return <Drawer open={false} onClose={onClose} title="" children={null} />

  function handleStageChange(stage: LeadStage) {
    moveLead(lead!.id, stage)
    toast(`Stage updated to ${stage}`, 'success')
  }

  return (
    <Drawer open title={lead.business} onClose={onClose} width="w-[480px]">
      <div className="flex flex-col gap-6 p-6">

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[20px] font-semibold text-[var(--color-ink)]">{lead.business}</h2>
            <p className="text-[13px] text-[var(--color-muted)] mt-0.5">{lead.industry}</p>
          </div>
          <TempBadge temp={lead.temperature} />
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Contact', value: lead.contact },
            { label: 'Email',   value: lead.email   },
            { label: 'Value',   value: fmtMoney(lead.value) },
            { label: 'Source',  value: sourceLabel(lead.source) },
            { label: 'Created', value: fmtDate(lead.createdAt) },
            { label: 'Stage',   value: STAGES.find(s => s.key === lead.stage)?.label ?? lead.stage },
          ].map(item => (
            <div key={item.label} className="bg-[var(--color-bg)] rounded-[var(--radius-base)] p-3">
              <p className="text-[11px] font-medium text-[var(--color-muted)] uppercase tracking-wide mb-0.5">{item.label}</p>
              <p className="text-[13px] font-medium text-[var(--color-ink)] truncate">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Stage selector */}
        <div>
          <p className="text-[12px] font-semibold text-[var(--color-muted)] uppercase tracking-wide mb-2">Move stage</p>
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

        {/* Activity timeline */}
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
      business: form.business, contact: form.contact, email: form.email,
      phone: form.phone || undefined,
      value: parseFloat(form.value) || 0,
      stage: form.stage, temperature: form.temperature,
      source: form.source, industry: form.industry,
      notes: form.notes || undefined,
      createdAt: now, updatedAt: now, activities: [],
    })
    toast('Lead added')
    setForm(EMPTY_FORM)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Add lead" width="max-w-xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Business Name *">
            <Input placeholder="TitanFit Studio" value={form.business} onChange={e => set('business', e.target.value)} />
          </Field>
          <Field label="Contact Name *">
            <Input placeholder="Rico Alvarez" value={form.contact} onChange={e => set('contact', e.target.value)} />
          </Field>
          <Field label="Email *">
            <Input type="email" placeholder="rico@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
          </Field>
          <Field label="Phone">
            <Input type="tel" placeholder="(214) 555-0192" value={form.phone} onChange={e => set('phone', e.target.value)} />
          </Field>
          <Field label="Est. Value ($)">
            <Input type="number" placeholder="5000" value={form.value} onChange={e => set('value', e.target.value)} />
          </Field>
          <Field label="Industry">
            <Input placeholder="Fitness" value={form.industry} onChange={e => set('industry', e.target.value)} />
          </Field>
          <Field label="Stage">
            <Select value={form.stage} onChange={e => set('stage', e.target.value as LeadStage)}>
              {STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </Select>
          </Field>
          <Field label="Temperature">
            <Select value={form.temperature} onChange={e => set('temperature', e.target.value as 'hot' | 'warm' | 'cold')}>
              <option value="hot">Hot</option>
              <option value="warm">Warm</option>
              <option value="cold">Cold</option>
            </Select>
          </Field>
          <div className="col-span-2">
            <Field label="Source">
              <Select value={form.source} onChange={e => set('source', e.target.value as LeadSource)}>
                <option value="website">Website form</option>
                <option value="referral">Referral</option>
                <option value="cold-email">Imported list</option>
                <option value="instagram">Instagram</option>
                <option value="google">Google</option>
                <option value="sms">SMS</option>
              </Select>
            </Field>
          </div>
        </div>
        <Field label="Notes">
          <Textarea placeholder="Any context about this lead..." value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} />
        </Field>
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--color-hairline)]">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary"><UserPlus size={14} /> Add Lead</Button>
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
  const toast = useToast()

  const openLeads    = leads.filter(l => l.stage !== 'won' && l.stage !== 'lost')
  const pipelineVal  = openLeads.reduce((s, l) => s + l.value, 0)
  const hotCount     = leads.filter(l => l.temperature === 'hot').length
  const wonThisMonth = leads.filter(l => l.stage === 'won' && l.updatedAt >= '2026-06-01').reduce((s, l) => s + l.value, 0)

  return (
    <div className="flex flex-col gap-5 min-h-0">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[22px] font-semibold font-[var(--font-display)] text-[var(--color-ink)]">Sales pipeline</h2>
          <p className="text-[13px] text-[var(--color-muted)] mt-0.5">
            Drag leads between stages · {leads.length} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => toast('Nurture flow coming soon', 'info')}>
            <Heart size={14} /> Nurture selected
          </Button>
          <Button variant="primary" onClick={() => setAddOpen(true)}>
            <UserPlus size={14} /> Add lead
          </Button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Open leads"
          value={openLeads.length}
          icon={<Filter size={16} />}
          accent="blue"
          deltaLabel="Active in pipeline"
        />
        <StatCard
          label="Pipeline value"
          value={'$' + (pipelineVal / 1000).toFixed(0) + 'k'}
          icon={<DollarSign size={16} />}
          accent="blue"
          deltaLabel="Excl. won & lost"
        />
        <StatCard
          label="Hot leads"
          value={hotCount}
          icon={<Flame size={16} />}
          accent="amber"
          deltaLabel="Ready to close"
        />
        <StatCard
          label="Won this month"
          value={'$' + (wonThisMonth / 1000).toFixed(1) + 'k'}
          icon={<CheckCircle size={16} />}
          accent="success"
          deltaLabel="Closed revenue"
        />
      </div>

      {/* Kanban */}
      <div className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1">
        {STAGES.map(({ key, label, dotColor }) => {
          const colLeads = leads.filter(l => l.stage === key)
          const colTotal = colLeads.reduce((s, l) => s + l.value, 0)

          return (
            <div
              key={key}
              className="flex-shrink-0 min-w-[280px] w-[280px] bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-hairline)] shadow-[var(--shadow-sm)] p-3"
            >
              {/* Column header */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dotColor }} />
                  <span className="text-[13px] font-semibold text-[var(--color-ink)]">{label}</span>
                </div>
                <span className="text-[11px] font-semibold bg-[rgba(20,16,31,0.06)] text-[var(--color-muted)] px-2 py-0.5 rounded-full">
                  {colLeads.length}
                </span>
              </div>
              {/* Column total */}
              <p className="text-[11px] text-[var(--color-muted)] mb-3 font-[var(--font-mono)]">
                {fmtMoney(colTotal)}
              </p>

              {/* Lead cards */}
              <div className="flex flex-col gap-2">
                {colLeads.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-[11px] text-[var(--color-faint)]">No leads</p>
                  </div>
                ) : (
                  colLeads.map(lead => (
                    <LeadCard key={lead.id} lead={lead} onClick={() => setSelectedLead(lead)} />
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Lead detail drawer */}
      <LeadDrawer lead={selectedLead} onClose={() => setSelectedLead(null)} />

      {/* Add lead modal */}
      <AddLeadModal open={addOpen} onClose={() => setAddOpen(false)} />

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
