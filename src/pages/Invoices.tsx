import { useState } from 'react'
import { RefreshCw, DollarSign, AlertTriangle, CheckCircle, Crown, Mail, Plus, Sparkles } from 'lucide-react'
import { Badge, Button, Card, StatCard, Modal, Field, Input, Select, useToast } from '@/components/ui'
import { useConsoleStore } from '@/store/useConsoleStore'
import type { Invoice, InvoiceStatus } from '@/data/mock'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtMoney(n: number) {
  return '$' + n.toLocaleString()
}

function fmtDueCol(inv: Invoice): string {
  const d = new Date(inv.dueAt)
  const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  if (inv.status === 'paid') return `Paid ${dateStr}`
  return dateStr
}

function getDisplayStatus(inv: Invoice): { label: string; variant: 'success' | 'amber' | 'danger' | 'blue' } {
  if (inv.status === 'paid')    return { label: 'Paid',        variant: 'success' }
  if (inv.status === 'overdue') return { label: 'Overdue',     variant: 'danger'  }
  // pending — check if past due
  const now = new Date()
  const due = new Date(inv.dueAt)
  if (due < now) return { label: 'Outstanding', variant: 'amber' }
  return { label: 'Upcoming', variant: 'blue' }
}

const INV_NUM_MAP: Record<string, string> = {
  inv1: 'INV-1051', inv2: 'INV-1050', inv3: 'INV-1048',
  inv4: 'INV-1047', inv5: 'INV-1045', inv6: 'INV-1042', inv7: 'INV-1039',
}
function invNum(id: string) { return INV_NUM_MAP[id] ?? 'INV-' + id.replace('inv', '').padStart(4, '0') }

// ─── MRR Bar Chart (CSS only) ─────────────────────────────────────────────────

const MRR_DATA = [
  { month: 'Jan', value: 6.5 }, { month: 'Feb', value: 6.5 }, { month: 'Mar', value: 6.5 },
  { month: 'Apr', value: 7.0 }, { month: 'May', value: 7.5 }, { month: 'Jun', value: 7.8 },
  { month: 'Jul', value: 8.0 }, { month: 'Aug', value: 8.2 }, { month: 'Sep', value: 8.5 },
  { month: 'Oct', value: 8.8 }, { month: 'Nov', value: 9.0 }, { month: 'Dec', value: 9.4 },
]
const MRR_MAX = 9.4

function MRRChart() {
  return (
    <div>
      <div className="flex items-end gap-1.5 h-[100px]">
        {MRR_DATA.map((d, i) => {
          const heightPct = (d.value / MRR_MAX) * 100
          const isLast = i === MRR_DATA.length - 1
          return (
            <div key={d.month} className="flex flex-col items-center gap-1 flex-1 min-w-0 h-full justify-end">
              <div
                className="w-full rounded-t-[3px] transition-all duration-300"
                style={{ height: `${heightPct}%`, background: isLast ? '#2E89E6' : '#2E1442' }}
                title={`${d.value}k`}
              />
            </div>
          )
        })}
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        {MRR_DATA.map(d => (
          <div key={d.month} className="flex-1 min-w-0 text-center">
            <span className="text-[9px] text-[var(--color-faint)]">{d.month}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Create Invoice Modal ─────────────────────────────────────────────────────

const EMPTY_FORM = { clientId: '', description: '', amount: '', status: 'pending' as InvoiceStatus, dueDate: '' }

function CreateInvoiceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const clients = useConsoleStore(s => s.clients)
  const toast = useToast()
  const [form, setForm] = useState(EMPTY_FORM)

  function set<K extends keyof typeof EMPTY_FORM>(k: K, v: typeof EMPTY_FORM[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.clientId || !form.amount || !form.description) {
      toast('Please fill in all required fields', 'error'); return
    }
    toast('Invoice created!')
    setForm(EMPTY_FORM)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Create invoice" width="max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Client *">
          <Select value={form.clientId} onChange={e => set('clientId', e.target.value)}>
            <option value="">Select a client...</option>
            {clients.map(c => <option key={c.id} value={c.id}>{c.company}</option>)}
          </Select>
        </Field>
        <Field label="Description *">
          <Input placeholder="Growth Plan — July" value={form.description} onChange={e => set('description', e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Amount ($) *">
            <Input type="number" placeholder="850" value={form.amount} onChange={e => set('amount', e.target.value)} />
          </Field>
          <Field label="Due date">
            <Input type="date" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
          </Field>
        </div>
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--color-hairline)]">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary"><Plus size={13} /> Create invoice</Button>
        </div>
      </form>
    </Modal>
  )
}

// ─── Invoices Page ────────────────────────────────────────────────────────────

type FilterTab = 'all' | 'due' | 'paid'

export function Invoices() {
  const invoices = useConsoleStore(s => s.invoices)
  const toast = useToast()
  const [filter, setFilter] = useState<FilterTab>('all')
  const [createOpen, setCreateOpen] = useState(false)

  const outstanding = invoices.filter(i => i.status === 'pending' || i.status === 'overdue').reduce((s, i) => s + i.amount, 0)
  const collected   = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)

  const filtered = invoices.filter(i => {
    if (filter === 'due')  return i.status === 'pending' || i.status === 'overdue'
    if (filter === 'paid') return i.status === 'paid'
    return true
  })

  const FILTER_TABS: { key: FilterTab; label: string }[] = [
    { key: 'all',  label: 'All'  },
    { key: 'due',  label: 'Due'  },
    { key: 'paid', label: 'Paid' },
  ]

  // Revenue by plan (static from design)
  const PLAN_REVENUE = [
    { label: 'Scale',   clients: 2, amount: 3600,  max: 4790, color: 'var(--color-purple)' },
    { label: 'Growth',  clients: 6, amount: 4790,  max: 4790, color: 'var(--color-blue)'   },
    { label: 'Starter', clients: 3, amount: 1050,  max: 4790, color: 'var(--color-muted)'  },
  ]

  return (
    <div className="flex flex-col gap-6">

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="MRR"           value="$9,440"              icon={<RefreshCw size={16} />}    accent="blue"    delta={8}   deltaLabel="+8.2% vs last month" />
        <StatCard label="Revenue (30d)" value="$23,800"             icon={<DollarSign size={16} />}   accent="success" delta={13}  deltaLabel="+12.6% vs last month" />
        <StatCard label="Outstanding"   value={fmtMoney(outstanding)} icon={<AlertTriangle size={16} />} accent="amber" deltaLabel="3 invoices" />
        <StatCard label="Collected (30d)" value={fmtMoney(collected)} icon={<CheckCircle size={16} />} accent="blue"  deltaLabel="Paid this month" />
      </div>

      {/* 2-column layout */}
      <div className="flex gap-5 items-start">

        {/* Left */}
        <div className="flex-[13] min-w-0 flex flex-col gap-5">

          {/* MRR bar chart */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[15px] font-semibold text-[var(--color-ink)]">Recurring revenue</h3>
              <span className="text-[11px] text-[var(--color-muted)]">12-month MRR ($k)</span>
            </div>
            <MRRChart />
          </Card>

          {/* Invoices table */}
          <Card padding={false}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-hairline)]">
              <h3 className="text-[15px] font-semibold text-[var(--color-ink)]">Invoices</h3>
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
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-hairline)]">
                  {['INVOICE', 'CLIENT', 'AMOUNT', 'DUE', 'STATUS'].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-[var(--color-faint)] uppercase tracking-wide px-5 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(inv => {
                  const ds = getDisplayStatus(inv)
                  return (
                    <tr
                      key={inv.id}
                      className="border-b border-[var(--color-hairline)] last:border-0 hover:bg-[var(--color-bg)] transition-colors cursor-pointer"
                      style={inv.status === 'overdue' ? { boxShadow: 'inset 3px 0 0 var(--color-danger)' } : undefined}
                    >
                      <td className="px-5 py-3.5">
                        <div>
                          <span className="text-[12px] font-semibold font-[var(--font-mono)] text-[var(--color-muted)]">{invNum(inv.id)}</span>
                          <p className="text-[11px] text-[var(--color-faint)] mt-0.5 truncate max-w-[160px]">{inv.description}</p>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="text-[13px] font-medium text-[var(--color-ink)]">{inv.clientName}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[14px] font-bold font-[var(--font-mono)] text-[var(--color-ink)]">{fmtMoney(inv.amount)}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-[13px] ${inv.status === 'overdue' ? 'text-[var(--color-danger)] font-medium' : 'text-[var(--color-muted)]'}`}>
                          {fmtDueCol(inv)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={ds.variant}>{ds.label}</Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Right */}
        <div className="flex-[7] min-w-0 flex flex-col gap-4">

          {/* Revenue by plan */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Crown size={14} className="text-[var(--color-purple)]" />
              <h3 className="text-[15px] font-semibold text-[var(--color-ink)]">Revenue by plan</h3>
            </div>
            <div className="flex flex-col gap-4">
              {PLAN_REVENUE.map(p => (
                <div key={p.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <span className="text-[13px] font-semibold text-[var(--color-ink)]">{p.label}</span>
                      <span className="text-[11px] text-[var(--color-muted)] ml-1.5">· {p.clients} clients</span>
                    </div>
                    <span className="text-[13px] font-bold font-[var(--font-mono)] text-[var(--color-ink)]">{fmtMoney(p.amount)}</span>
                  </div>
                  <div className="h-1.5 bg-[rgba(20,16,31,0.08)] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${(p.amount / p.max) * 100}%`, background: p.color }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Overdue alert */}
          <Card>
            <div className="flex items-start gap-3 mb-3">
              <AlertTriangle size={18} className="text-[var(--color-amber)] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[14px] font-bold text-[var(--color-ink)]">1 overdue invoice</p>
                <p className="text-[12px] text-[var(--color-muted)] mt-0.5">Apex Auto Detailing · $2,000 · 18 days late</p>
              </div>
            </div>
            <Button variant="secondary" className="w-full" onClick={() => toast('Reminder sent!', 'success')}>
              <Mail size={13} /> Send payment reminder
            </Button>
          </Card>

          {/* Create invoice */}
          <button
            onClick={() => setCreateOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-[var(--radius-lg)] text-[14px] font-semibold text-white transition-all hover:opacity-90"
            style={{ background: 'var(--color-purple-deep)' }}
          >
            <Plus size={16} /> Create invoice
          </button>

        </div>
      </div>

      <CreateInvoiceModal open={createOpen} onClose={() => setCreateOpen(false)} />

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
