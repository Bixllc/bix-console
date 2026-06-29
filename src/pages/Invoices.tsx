import { useState } from 'react'
import { Plus, DollarSign, Clock, AlertCircle, FileText } from 'lucide-react'
import {
  Badge, Button, Card, StatCard, Modal,
  Field, Input, Select, useToast, EmptyState,
  SegmentedControl,
} from '@/components/ui'
import { useConsoleStore } from '@/store/useConsoleStore'
import type { InvoiceStatus } from '@/data/mock'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtMoney(n: number) {
  return '$' + n.toLocaleString()
}

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function statusVariant(s: InvoiceStatus): 'success' | 'amber' | 'danger' | 'muted' {
  const map: Record<InvoiceStatus, 'success' | 'amber' | 'danger' | 'muted'> = {
    paid: 'success', pending: 'amber', overdue: 'danger', draft: 'muted',
  }
  return map[s]
}

function statusLabel(s: InvoiceStatus) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

type FilterTab = 'all' | InvoiceStatus

const FILTER_OPTIONS: { label: string; value: FilterTab }[] = [
  { label: 'All', value: 'all' },
  { label: 'Paid', value: 'paid' },
  { label: 'Pending', value: 'pending' },
  { label: 'Overdue', value: 'overdue' },
]

// ─── Create Invoice Modal ─────────────────────────────────────────────────────

const EMPTY_FORM = {
  clientId: '',
  description: '',
  amount: '',
  status: 'pending' as InvoiceStatus,
  dueDate: '',
}

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
      toast('Please fill in all required fields', 'error')
      return
    }
    // NOTE: addInvoice is not in the current store — showing success toast as demo
    toast('Invoice created!')
    setForm(EMPTY_FORM)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Create Invoice" width="max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Client *">
          <Select value={form.clientId} onChange={e => set('clientId', e.target.value)}>
            <option value="">Select a client...</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.company}</option>
            ))}
          </Select>
        </Field>

        <Field label="Description *">
          <Input
            placeholder="Monthly Retainer — July"
            value={form.description}
            onChange={e => set('description', e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Amount ($) *">
            <Input
              type="number"
              placeholder="297"
              value={form.amount}
              onChange={e => set('amount', e.target.value)}
            />
          </Field>
          <Field label="Status">
            <Select value={form.status} onChange={e => set('status', e.target.value as InvoiceStatus)}>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </Select>
          </Field>
        </div>

        <Field label="Due Date">
          <Input
            type="date"
            value={form.dueDate}
            onChange={e => set('dueDate', e.target.value)}
          />
        </Field>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--color-hairline)]">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary"><Plus size={13} /> Create Invoice</Button>
        </div>
      </form>
    </Modal>
  )
}

// ─── Invoices Page ────────────────────────────────────────────────────────────

export function Invoices() {
  const invoices = useConsoleStore(s => s.invoices)
  const [filter, setFilter] = useState<FilterTab>('all')
  const [createOpen, setCreateOpen] = useState(false)

  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0)
  const totalPending = invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0)
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0)

  const filtered = filter === 'all' ? invoices : invoices.filter(i => i.status === filter)

  // Invoice number display
  function invNum(id: string) {
    return 'INV-' + id.replace('inv', '').padStart(4, '0')
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold font-[var(--font-display)] text-[var(--color-ink)]">Invoices</h1>
          <p className="text-[13px] text-[var(--color-muted)] mt-0.5">{invoices.length} total invoices</p>
        </div>
        <Button variant="primary" onClick={() => setCreateOpen(true)}>
          <Plus size={14} /> Create Invoice
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Total Revenue"
          value={fmtMoney(totalRevenue)}
          icon={<DollarSign size={16} />}
          accent="success"
          deltaLabel="Paid invoices"
        />
        <StatCard
          label="Pending"
          value={fmtMoney(totalPending)}
          icon={<Clock size={16} />}
          accent="amber"
          deltaLabel={`${invoices.filter(i => i.status === 'pending').length} awaiting`}
        />
        <StatCard
          label="Overdue"
          value={fmtMoney(totalOverdue)}
          icon={<AlertCircle size={16} />}
          accent="danger"
          deltaLabel={`${invoices.filter(i => i.status === 'overdue').length} need attention`}
        />
      </div>

      {/* Filter Tabs + Table */}
      <Card padding={false}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-hairline)]">
          <SegmentedControl
            options={FILTER_OPTIONS}
            value={filter}
            onChange={setFilter}
          />
          <span className="text-[12px] text-[var(--color-muted)]">
            {filtered.length} invoice{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<FileText size={24} />}
            title="No invoices"
            description={`No ${filter === 'all' ? '' : filter + ' '}invoices found.`}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-hairline)]">
                  {['Invoice #', 'Client', 'Description', 'Amount', 'Status', 'Issued', 'Due'].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wide px-5 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(inv => (
                  <tr
                    key={inv.id}
                    className={`border-b border-[var(--color-hairline)] last:border-0 hover:bg-[var(--color-bg)] transition-colors relative ${inv.status === 'overdue' ? 'overdue-row' : ''}`}
                    style={inv.status === 'overdue' ? { boxShadow: 'inset 3px 0 0 var(--color-danger)' } : undefined}
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-[12px] font-semibold font-[var(--font-mono)] text-[var(--color-muted)]">
                        {invNum(inv.id)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] font-medium text-[var(--color-ink)]">{inv.clientName}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] text-[var(--color-muted)] max-w-[220px] truncate">{inv.description}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[14px] font-semibold font-[var(--font-mono)] text-[var(--color-ink)]">
                        {fmtMoney(inv.amount)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={statusVariant(inv.status)}>{statusLabel(inv.status)}</Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[13px] text-[var(--color-muted)]">{fmtDate(inv.issuedAt)}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-[13px] ${inv.status === 'overdue' ? 'text-[var(--color-danger)] font-medium' : 'text-[var(--color-muted)]'}`}>
                        {fmtDate(inv.dueAt)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <CreateInvoiceModal open={createOpen} onClose={() => setCreateOpen(false)} />

    </div>
  )
}
