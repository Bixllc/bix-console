import { useState } from 'react'
import { Play, Mail, Clock, Link2, Copy, Plus, Sparkles, CheckCircle } from 'lucide-react'
import { Badge, Button, Card, Modal, Field, Input, Select, useToast } from '@/components/ui'
import { mockMeetings } from '@/data/mock'
import type { Meeting } from '@/data/mock'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getDayAbbrev(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
}

function getDayNum(dateStr: string): number {
  return new Date(dateStr).getDate()
}

function fmtTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

type BadgeVariant = 'blue' | 'amber' | 'purple' | 'success'

function meetingBadge(type: Meeting['type']): { label: string; variant: BadgeVariant } {
  const map: Record<Meeting['type'], { label: string; variant: BadgeVariant }> = {
    discovery: { label: 'Discovery', variant: 'blue'    },
    review:    { label: 'Sales',     variant: 'amber'   },
    'check-in':{ label: 'Client',    variant: 'purple'  },
    onboarding:{ label: 'Kickoff',   variant: 'success' },
  }
  return map[type]
}

// ─── Meeting Row ──────────────────────────────────────────────────────────────

function MeetingRow({ meeting }: { meeting: Meeting }) {
  const badge = meetingBadge(meeting.type)

  return (
    <div className="flex items-center gap-5 px-5 py-4 border-b border-[var(--color-hairline)] last:border-0">
      {/* Date block */}
      <div className="flex flex-col items-center w-[52px] flex-shrink-0">
        <span className="text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wide leading-none">
          {getDayAbbrev(meeting.date)}
        </span>
        <span className="text-[28px] font-bold font-[var(--font-display)] text-[var(--color-ink)] leading-tight">
          {getDayNum(meeting.date)}
        </span>
      </div>

      {/* Divider */}
      <div className="w-px h-10 bg-[var(--color-hairline)] flex-shrink-0" />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-[14px] font-semibold text-[var(--color-ink)] truncate">{meeting.title}</p>
          <span className="text-[13px] text-[var(--color-muted)]">— {meeting.clientName}</span>
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>
        <p className="text-[12px] text-[var(--color-muted)]">
          {fmtTime(meeting.date)} · {meeting.duration} min
          {meeting.contact ? ` · with ${meeting.contact}` : ''}
        </p>
      </div>

      {/* Action */}
      {meeting.link ? (
        <a href={meeting.link} target="_blank" rel="noreferrer">
          <Button variant="secondary" size="sm">
            <Play size={11} /> Join
          </Button>
        </a>
      ) : (
        <Button variant="secondary" size="sm" onClick={() => {}}>
          <Mail size={11} /> Invite
        </Button>
      )}
    </div>
  )
}

// ─── Schedule Meeting Modal ───────────────────────────────────────────────────

const EMPTY_FORM = {
  title: '', clientName: '', date: '', time: '', duration: '30',
  type: 'discovery' as Meeting['type'], link: '',
}

function ScheduleModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const toast = useToast()
  const [form, setForm] = useState(EMPTY_FORM)

  function set<K extends keyof typeof EMPTY_FORM>(k: K, v: typeof EMPTY_FORM[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title || !form.clientName || !form.date) {
      toast('Please fill required fields', 'error'); return
    }
    toast('Meeting scheduled!')
    setForm(EMPTY_FORM)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Schedule meeting" width="max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Meeting title *">
          <Input placeholder="Discovery call" value={form.title} onChange={e => set('title', e.target.value)} />
        </Field>
        <Field label="Client name *">
          <Input placeholder="TitanFit Studio" value={form.clientName} onChange={e => set('clientName', e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Date *">
            <Input type="date" value={form.date} onChange={e => set('date', e.target.value)} />
          </Field>
          <Field label="Time">
            <Input type="time" value={form.time} onChange={e => set('time', e.target.value)} />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Duration">
            <Select value={form.duration} onChange={e => set('duration', e.target.value)}>
              <option value="15">15 min</option>
              <option value="30">30 min</option>
              <option value="45">45 min</option>
              <option value="60">60 min</option>
            </Select>
          </Field>
          <Field label="Type">
            <Select value={form.type} onChange={e => set('type', e.target.value as Meeting['type'])}>
              <option value="discovery">Discovery</option>
              <option value="check-in">Check-in</option>
              <option value="review">Review</option>
              <option value="onboarding">Onboarding</option>
            </Select>
          </Field>
        </div>
        <Field label="Meeting link (optional)">
          <Input type="url" placeholder="https://meet.google.com/..." value={form.link} onChange={e => set('link', e.target.value)} />
        </Field>
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--color-hairline)]">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary"><Plus size={13} /> Schedule</Button>
        </div>
      </form>
    </Modal>
  )
}

// ─── Calendar Page ────────────────────────────────────────────────────────────

const BOOKING_LINKS = [
  { name: 'Discovery call',    duration: '30 min', url: 'https://calendly.com/bixllc/discovery'  },
  { name: 'Strategy session',  duration: '45 min', url: 'https://calendly.com/bixllc/strategy'   },
  { name: 'Project kickoff',   duration: '60 min', url: 'https://calendly.com/bixllc/kickoff'    },
]

export function CalendarPage() {
  const [scheduleOpen, setScheduleOpen] = useState(false)
  const toast = useToast()

  function copyLink(url: string) {
    navigator.clipboard.writeText(url)
    toast('Link copied!')
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Hero */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold font-[var(--font-display)] text-[var(--color-ink)]">Calendar</h1>
          <p className="text-[13px] text-[var(--color-muted)] mt-0.5">
            5 meetings this week · synced with Google Calendar
          </p>
        </div>
        <Button variant="primary" onClick={() => setScheduleOpen(true)}>
          <Plus size={14} /> Schedule meeting
        </Button>
      </div>

      {/* 2-column layout */}
      <div className="flex gap-5 items-start">

        {/* Left: Upcoming meetings */}
        <div className="flex-[13] min-w-0">
          <Card padding={false}>
            <div className="px-5 py-4 border-b border-[var(--color-hairline)]">
              <h3 className="text-[15px] font-semibold text-[var(--color-ink)]">Upcoming meetings</h3>
            </div>
            {mockMeetings.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-[13px] text-[var(--color-faint)]">No upcoming meetings</p>
                <Button variant="primary" size="sm" className="mt-3" onClick={() => setScheduleOpen(true)}>
                  <Plus size={13} /> Schedule
                </Button>
              </div>
            ) : (
              mockMeetings.map(m => <MeetingRow key={m.id} meeting={m} />)
            )}
          </Card>
        </div>

        {/* Right: Booking links + Google Calendar */}
        <div className="flex-[7] min-w-0 flex flex-col gap-4">

          {/* Booking links */}
          <Card padding={false}>
            <div className="flex items-center gap-2 px-5 py-4 border-b border-[var(--color-hairline)]">
              <Link2 size={14} className="text-[var(--color-purple)]" />
              <h3 className="text-[15px] font-semibold text-[var(--color-ink)]">Booking links</h3>
            </div>
            {BOOKING_LINKS.map(bl => (
              <div key={bl.name} className="flex items-center gap-3 px-5 py-3.5 border-b border-[var(--color-hairline)] last:border-0">
                <div className="w-8 h-8 rounded-[var(--radius-base)] bg-[var(--color-purple-soft)] flex items-center justify-center flex-shrink-0">
                  <Clock size={13} className="text-[var(--color-purple)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[var(--color-ink)]">{bl.name}</p>
                  <p className="text-[11px] text-[var(--color-muted)] mt-0.5">{bl.duration}</p>
                </div>
                <button
                  onClick={() => copyLink(bl.url)}
                  className="p-1.5 rounded-[var(--radius-sm)] text-[var(--color-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-ink)] transition-colors"
                >
                  <Copy size={13} />
                </button>
              </div>
            ))}
          </Card>

          {/* Google Calendar */}
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[var(--radius-base)] bg-[var(--color-bg)] border border-[var(--color-hairline)] flex items-center justify-center flex-shrink-0">
                  <Link2 size={14} className="text-[var(--color-muted)]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-semibold text-[var(--color-ink)]">Google Calendar</p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[var(--color-success-soft)] text-[var(--color-success)] px-2 py-0.5 rounded-full">
                      <CheckCircle size={9} /> Synced
                    </span>
                  </div>
                  <p className="text-[12px] text-[var(--color-muted)] mt-0.5">Connected</p>
                </div>
              </div>
            </div>
          </Card>

        </div>
      </div>

      {/* Schedule Modal */}
      <ScheduleModal open={scheduleOpen} onClose={() => setScheduleOpen(false)} />

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
