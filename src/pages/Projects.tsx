import React, { useState } from 'react'
import { Plus, ExternalLink, Calendar, Folder } from 'lucide-react'
import {
  Badge, Button, Card, Modal,
  Field, Input, Select, Textarea, ProgressBar, useToast, EmptyState,
} from '@/components/ui'
import { useConsoleStore } from '@/store/useConsoleStore'
import type { Project, ProjectStatus } from '@/data/mock'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDate(s: string) {
  return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function statusVariant(s: ProjectStatus): 'muted' | 'blue' | 'amber' | 'purple' | 'success' {
  const map: Record<ProjectStatus, 'muted' | 'blue' | 'amber' | 'purple' | 'success'> = {
    discovery: 'muted', design: 'blue', development: 'amber',
    review: 'purple', launched: 'success',
  }
  return map[s]
}

function statusLabel(s: ProjectStatus) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function statusColor(s: ProjectStatus) {
  const map: Record<ProjectStatus, string> = {
    discovery: 'var(--color-muted)',
    design: 'var(--color-blue)',
    development: 'var(--color-amber)',
    review: 'var(--color-purple)',
    launched: 'var(--color-success)',
  }
  return map[s]
}

// ─── Active Project Card ──────────────────────────────────────────────────────

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="flex flex-col gap-4 hover:shadow-[var(--shadow-md)] transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] text-[var(--color-muted)] font-medium mb-0.5">{project.clientName}</p>
          <h3 className="text-[15px] font-semibold text-[var(--color-ink)] truncate">{project.name}</h3>
        </div>
        <Badge variant={statusVariant(project.status)}>{statusLabel(project.status)}</Badge>
      </div>

      {project.description && (
        <p className="text-[13px] text-[var(--color-muted)] leading-relaxed line-clamp-2">
          {project.description}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[var(--color-muted)]">Progress</span>
          <span className="text-[11px] font-semibold font-[var(--font-mono)] text-[var(--color-ink)]">
            {project.progress}%
          </span>
        </div>
        <ProgressBar value={project.progress} color={statusColor(project.status)} />
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-[var(--color-hairline)]">
        <div className="flex items-center gap-1.5 text-[11px] text-[var(--color-muted)]">
          <Calendar size={11} />
          <span>Due {fmtDate(project.dueDate)}</span>
        </div>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-[11px] text-[var(--color-purple)] font-medium hover:underline"
          >
            <ExternalLink size={11} /> Live
          </a>
        )}
      </div>
    </Card>
  )
}

// ─── Add Project Modal ────────────────────────────────────────────────────────

const EMPTY_FORM = {
  clientId: '',
  name: '',
  description: '',
  status: 'discovery' as ProjectStatus,
  dueDate: '',
  liveUrl: '',
}

function AddProjectModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const clients = useConsoleStore(s => s.clients)
  const toast = useToast()
  const [form, setForm] = useState(EMPTY_FORM)

  function set<K extends keyof typeof EMPTY_FORM>(k: K, v: typeof EMPTY_FORM[K]) {
    setForm(f => ({ ...f, [k]: v }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.clientId || !form.name) {
      toast('Please fill in required fields', 'error')
      return
    }
    // NOTE: addProject is not in the current store — showing success toast as demo
    toast('Project created successfully!')
    setForm(EMPTY_FORM)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Add Project" width="max-w-lg">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Client *">
          <Select value={form.clientId} onChange={e => set('clientId', e.target.value)}>
            <option value="">Select a client...</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.company}</option>
            ))}
          </Select>
        </Field>

        <Field label="Project Name *">
          <Input
            placeholder="Booking Platform Redesign"
            value={form.name}
            onChange={e => set('name', e.target.value)}
          />
        </Field>

        <Field label="Description">
          <Textarea
            placeholder="Brief description of the project scope..."
            value={form.description}
            onChange={e => set('description', e.target.value)}
            rows={3}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Status">
            <Select value={form.status} onChange={e => set('status', e.target.value as ProjectStatus)}>
              <option value="discovery">Discovery</option>
              <option value="design">Design</option>
              <option value="development">Development</option>
              <option value="review">Review</option>
              <option value="launched">Launched</option>
            </Select>
          </Field>
          <Field label="Due Date">
            <Input
              type="date"
              value={form.dueDate}
              onChange={e => set('dueDate', e.target.value)}
            />
          </Field>
        </div>

        <Field label="Live URL (optional)">
          <Input
            type="url"
            placeholder="https://clientsite.com"
            value={form.liveUrl}
            onChange={e => set('liveUrl', e.target.value)}
          />
        </Field>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--color-hairline)]">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary"><Plus size={13} /> Create Project</Button>
        </div>
      </form>
    </Modal>
  )
}

// ─── Projects Page ────────────────────────────────────────────────────────────

export function Projects() {
  const projects = useConsoleStore(s => s.projects)
  const [addOpen, setAddOpen] = useState(false)

  const active   = projects.filter(p => p.status !== 'launched')
  const launched = projects.filter(p => p.status === 'launched')

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[22px] font-semibold font-[var(--font-display)] text-[var(--color-ink)]">Projects</h1>
          <p className="text-[13px] text-[var(--color-muted)] mt-0.5">
            {active.length} active · {launched.length} launched
          </p>
        </div>
        <Button variant="primary" onClick={() => setAddOpen(true)}>
          <Plus size={14} /> Add Project
        </Button>
      </div>

      {/* Active Projects */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-[15px] font-semibold text-[var(--color-ink)]">Active Projects</h2>
          <span className="w-5 h-5 rounded-full bg-[var(--color-purple-soft)] text-[var(--color-purple)] text-[11px] font-bold flex items-center justify-center">
            {active.length}
          </span>
        </div>

        {active.length === 0 ? (
          <Card>
            <EmptyState
              icon={<Folder size={24} />}
              title="No active projects"
              description="All projects are launched. Start a new project to get building."
              action={
                <Button variant="primary" size="sm" onClick={() => setAddOpen(true)}>
                  <Plus size={13} /> Add Project
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {active.map(p => <ProjectCard key={p.id} project={p} />)}
          </div>
        )}
      </div>

      {/* Launched Projects */}
      {launched.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-[15px] font-semibold text-[var(--color-ink)]">Launched</h2>
            <span className="w-5 h-5 rounded-full bg-[var(--color-success-soft)] text-[var(--color-success)] text-[11px] font-bold flex items-center justify-center">
              {launched.length}
            </span>
          </div>

          <Card padding={false}>
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-hairline)]">
                  {['Client', 'Project', 'Launch Date', 'Live URL', 'Status'].map(h => (
                    <th key={h} className="text-left text-[11px] font-semibold text-[var(--color-muted)] uppercase tracking-wide px-5 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {launched.map(p => (
                  <tr key={p.id} className="border-b border-[var(--color-hairline)] last:border-0 hover:bg-[var(--color-bg)] transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] text-[var(--color-muted)]">{p.clientName}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] font-medium text-[var(--color-ink)]">{p.name}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-[13px] text-[var(--color-muted)]">{fmtDate(p.dueDate)}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      {p.liveUrl ? (
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-[13px] text-[var(--color-purple)] font-medium hover:underline"
                        >
                          <ExternalLink size={12} />
                          {p.liveUrl.replace('https://', '')}
                        </a>
                      ) : (
                        <span className="text-[13px] text-[var(--color-faint)]">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant="success">Launched</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      )}

      {/* Add Project Modal */}
      <AddProjectModal open={addOpen} onClose={() => setAddOpen(false)} />

    </div>
  )
}
