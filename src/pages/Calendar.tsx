import { useState } from 'react'
import { Video, Copy, Calendar, Clock, Link, Plus } from 'lucide-react'
import {
  Badge, Button, Card, Modal,
  Field, Input, Select, useToast, EmptyState,
} from '@/components/ui'
import { mockMeetings } from '@/data/mock'
import type { Meeting } from '@/data/mock'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtTime(s: string) {
  return new Date(s).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function meetingTypeVariant(t: Meeting['type']): 'purple' | 'blue' | 'amber' | 'success' {
  const map: Record<Meeting['type'], 'purple' | 'blue' | 'amber' | 'success'> = {
    discovery: 'purple', 'check-in': 'blue', review: 'amber', onboarding: 'success',
  }
  return map[t]
}

function meetingTypeLabel(t: Meeting['type']) {
  const map: Record<Meeting['type'], string> = {
    discovery: 'Discovery', 'check-in': 'Check-in', review: 'Review', onboarding: 'Onboarding',
  }
  return map[t]
}

// ─── Meeting Card ─────────────────────────────────────────────────────────────

function MeetingCard({ meeting }: { meeting: Meeting }) {
  const d = new Date(meeting.date)
  const dayNum = d.getDate()
  const dayName = d.toLocaleDateString('en-US', { weekday: 'short' })
  const month = d.toLocaleDateString('en-US', { month: 'short' })

  return (
    <Card className="flex items-start gap-5 hover:shadow-[var(--shadow-md)] transition-shadow">
      {/* Date Block */}
      <div className="flex-shrink-0 w-16 flex flex-col items-center bg-[var(--color-purple-soft)] rounded-[var(--radius-base)] py-3 px-2">
        <span className="text-[11px] font-semibold text-[var(--color-purple)] uppercase tracking-wide">{dayName}</span>
        <span className="text-[28px] font-bold font-[var(--font-display)] text-[var(--color-purple)] leading-none my-0.5">
          {dayNum}
        </span>
        <span className="text-[11px] font-medium text-[var(--color-purple)]">{month}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 py-0.5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <h3 className="text-[15px] font-semibold text-[var(--color-ink)]">{meeting.title}</h3>
            <p className="text-[13px] text-[var(--color-muted)] mt-0.5">{meeting.clientName}</p>
          </div>
          <Badge variant={meetingTypeVariant(meeting.type)}>{meetingTypeLabel(meeting.type)}</Badge>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[12px] text-[var(--color-muted)]">
            <Clock size={12} />
            <span>{fmtTime(meeting.date)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-[var(--color-muted)]">
            <Calendar size={12} />
            <span>{meeting.duration} min</span>
          </div>
          {meeting.link && (
            <a
              href={meeting.link}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-[12px] text-[var(--color-purple)] font-medium hover:underline ml-auto"
            >
              <Video size={12} /> Join Meeting
            </a>
          )}
        </div>
      </div>
    </Card>
  )
}

// ─── Booking Link Card ────────────────────────────────────────────────────────

function BookingLinkCard({
  title, description, url,
}: { title: string; description: string; url: string }) {
  const toast_ = useToast()

  function copyLink() {
    navigator.clipboard.writeText(url)
    toast_('Link copied!')
  }

  return (
    <Card className="flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-[var(--radius-base)] bg-[var(--color-purple-soft)] flex items-center justify-center flex-shrink-0">
          <Link size={15} className="text-[var(--color-purple)]" />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-[var(--color-ink)]">{title}</p>
          <p className="text-[12px] text-[var(--color-muted)] mt-0.5">{description}</p>
          <p className="text-[11px] font-[var(--font-mono)] text-[var(--color-faint)] mt-1 truncate max-w-[260px]">
            {url}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Button variant="secondary" size="sm" onClick={copyLink}>
          <Copy size={12} /> Copy
        </Button>
        <a href={url} target="_blank" rel="noreferrer">
          <Button variant="ghost" size="sm">Open</Button>
        </a>
      </div>
    </Card>
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
      toast('Please fill required fields', 'error')
      return
    }
    toast('Meeting scheduled!')
    setForm(EMPTY_FORM)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Schedule Meeting" width="max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Meeting Title *">
          <Input
            placeholder="Discovery Call"
            value={form.title}
            onChange={e => set('title', e.target.value)}
          />
        </Field>
        <Field label="Client Name *">
          <Input
            placeholder="Glow Beauty Bar"
            value={form.clientName}
            onChange={e => set('clientName', e.target.value)}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Date *">
            <Input
              type="date"
              value={form.date}
              onChange={e => set('date', e.target.value)}
            />
          </Field>
          <Field label="Time">
            <Input
              type="time"
              value={form.time}
              onChange={e => set('time', e.target.value)}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Duration (min)">
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
        <Field label="Meeting Link (optional)">
          <Input
            type="url"
            placeholder="https://meet.google.com/..."
            value={form.link}
            onChange={e => set('link', e.target.value)}
          />
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

export function CalendarPage() {
  const [scheduleOpen, setScheduleOpen] = useState(false)

  const BOOKING_LINKS = [
    {
      title: 'Discovery Call',
      description: '30-minute intro call to explore working together',
      url: 'https://calendly.com/bixllc/discovery',
    },
    {
      title: 'Check-in Call',
      description: '45-minute monthly check-in for active clients',
      url: 'https://calendly.com/bixllc/check-in',
    },
  ]

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold font-[var(--font-display)] text-[var(--color-ink)]">Calendar</h1>
          <p className="text-[13px] text-[var(--color-muted)] mt-0.5">
            {mockMeetings.length} upcoming meetings
          </p>
        </div>
        <Button variant="primary" onClick={() => setScheduleOpen(true)}>
          <Plus size={14} /> Schedule Meeting
        </Button>
      </div>

      {/* Upcoming Meetings */}
      <div>
        <h2 className="text-[15px] font-semibold text-[var(--color-ink)] mb-4">Upcoming Meetings</h2>
        {mockMeetings.length === 0 ? (
          <Card>
            <EmptyState
              icon={<Calendar size={24} />}
              title="No upcoming meetings"
              description="Schedule a meeting or share your booking link."
              action={
                <Button variant="primary" size="sm" onClick={() => setScheduleOpen(true)}>
                  <Plus size={13} /> Schedule Meeting
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {mockMeetings.map(m => <MeetingCard key={m.id} meeting={m} />)}
          </div>
        )}
      </div>

      {/* Booking Links */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[15px] font-semibold text-[var(--color-ink)]">Booking Links</h2>
          <p className="text-[12px] text-[var(--color-muted)]">Powered by Calendly</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {BOOKING_LINKS.map(bl => (
            <BookingLinkCard key={bl.title} {...bl} />
          ))}
        </div>
      </div>

      {/* Schedule Modal */}
      <ScheduleModal open={scheduleOpen} onClose={() => setScheduleOpen(false)} />

    </div>
  )
}
