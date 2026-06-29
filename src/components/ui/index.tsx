import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

// ─── Badge ────────────────────────────────────────────────────────────────────

type BadgeVariant = 'purple' | 'blue' | 'success' | 'amber' | 'danger' | 'muted' | 'ghost'

const badgeStyles: Record<BadgeVariant, string> = {
  purple:  'bg-[var(--color-purple-soft)] text-[var(--color-purple)]',
  blue:    'bg-[var(--color-blue-soft)] text-[var(--color-blue)]',
  success: 'bg-[var(--color-success-soft)] text-[var(--color-success)]',
  amber:   'bg-[var(--color-amber-soft)] text-[var(--color-amber)]',
  danger:  'bg-[var(--color-danger-soft)] text-[var(--color-danger)]',
  muted:   'bg-[rgba(20,16,31,0.06)] text-[var(--color-muted)]',
  ghost:   'border border-[var(--color-hairline)] text-[var(--color-muted)]',
}

export function Badge({ variant = 'muted', children, className = '' }: {
  variant?: BadgeVariant; children: React.ReactNode; className?: string
}) {
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold font-[var(--font-sans)] px-2 py-0.5 rounded-[var(--radius-pill)] ${badgeStyles[variant]} ${className}`}>
      {children}
    </span>
  )
}

// ─── Button ───────────────────────────────────────────────────────────────────

type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

const btnStyles: Record<BtnVariant, string> = {
  primary:   'bg-[var(--color-purple)] text-white hover:bg-[var(--color-purple-deep)] shadow-sm',
  secondary: 'bg-white border border-[var(--color-hairline)] text-[var(--color-ink)] hover:bg-[var(--color-bg)]',
  ghost:     'text-[var(--color-muted)] hover:bg-[rgba(20,16,31,0.05)] hover:text-[var(--color-ink)]',
  danger:    'bg-[var(--color-danger-soft)] text-[var(--color-danger)] hover:bg-[rgba(194,64,47,0.15)]',
}

export function Button({ variant = 'secondary', size = 'md', children, className = '', ...props }: {
  variant?: BtnVariant; size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode; className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const sizeClass = size === 'sm' ? 'text-[12px] px-3 py-1.5 gap-1.5' : size === 'lg' ? 'text-[15px] px-5 py-2.5 gap-2' : 'text-[13px] px-4 py-2 gap-2'
  return (
    <button
      className={`inline-flex items-center justify-center font-[var(--font-sans)] font-medium rounded-[var(--radius-base)] transition-all duration-200 cursor-pointer ${sizeClass} ${btnStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export function Card({ children, className = '', padding = true }: {
  children: React.ReactNode; className?: string; padding?: boolean
}) {
  return (
    <div className={`bg-[var(--color-surface)] rounded-[var(--radius-lg)] border border-[var(--color-hairline)] shadow-[var(--shadow-sm)] ${padding ? 'p-5' : ''} ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, action }: {
  title: string; subtitle?: string; action?: React.ReactNode
}) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div>
        <h3 className="text-[15px] font-semibold text-[var(--color-ink)] leading-tight">{title}</h3>
        {subtitle && <p className="text-[12px] text-[var(--color-muted)] mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

export function StatCard({ label, value, delta, deltaLabel, icon, accent = 'purple' }: {
  label: string; value: string | number; delta?: number; deltaLabel?: string
  icon?: React.ReactNode; accent?: 'purple' | 'blue' | 'success' | 'amber' | 'danger'
}) {
  const accentColor: Record<string, string> = {
    purple: 'var(--color-purple)', blue: 'var(--color-blue)',
    success: 'var(--color-success)', amber: 'var(--color-amber)', danger: 'var(--color-danger)'
  }
  const accentSoft: Record<string, string> = {
    purple: 'var(--color-purple-soft)', blue: 'var(--color-blue-soft)',
    success: 'var(--color-success-soft)', amber: 'var(--color-amber-soft)', danger: 'var(--color-danger-soft)'
  }
  const isPositive = (delta ?? 0) >= 0

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        {icon && (
          <div className="w-9 h-9 rounded-[var(--radius-base)] flex items-center justify-center"
            style={{ background: accentSoft[accent], color: accentColor[accent] }}>
            {icon}
          </div>
        )}
        {delta !== undefined && (
          <span className={`text-[11px] font-semibold font-[var(--font-mono)] px-2 py-0.5 rounded-[var(--radius-pill)] ${isPositive ? 'bg-[var(--color-success-soft)] text-[var(--color-success)]' : 'bg-[var(--color-danger-soft)] text-[var(--color-danger)]'}`}>
            {isPositive ? '+' : ''}{delta}%
          </span>
        )}
      </div>
      <div>
        <div className="text-[26px] font-semibold font-[var(--font-mono)] text-[var(--color-ink)] leading-none">{value}</div>
        <div className="text-[12px] text-[var(--color-muted)] mt-1">{label}</div>
        {deltaLabel && <div className="text-[11px] text-[var(--color-faint)] mt-0.5">{deltaLabel}</div>}
      </div>
    </Card>
  )
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

export function ProgressBar({ value, color = 'var(--color-purple)' }: {
  value: number; color?: string
}) {
  return (
    <div className="h-1.5 bg-[rgba(20,16,31,0.08)] rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${value}%`, background: color }} />
    </div>
  )
}

// ─── Toggle ───────────────────────────────────────────────────────────────────

export function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${checked ? 'bg-[var(--color-purple)]' : 'bg-[rgba(20,16,31,0.15)]'}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-0.5'}`} />
    </button>
  )
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export function Modal({ open, onClose, title, children, width = 'max-w-lg' }: {
  open: boolean; onClose: () => void; title?: string
  children: React.ReactNode; width?: string
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[var(--color-ink)]/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className={`relative bg-[var(--color-surface)] rounded-[var(--radius-xl)] shadow-[var(--shadow-xl)] w-full ${width} max-h-[90vh] overflow-y-auto`}>
        {title && (
          <div className="flex items-center justify-between p-6 pb-0">
            <h2 className="text-[18px] font-semibold text-[var(--color-ink)]">{title}</h2>
            <button onClick={onClose} className="p-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--color-bg)] text-[var(--color-muted)] transition-colors">
              <X size={16} />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

// ─── Drawer ───────────────────────────────────────────────────────────────────

export function Drawer({ open, onClose, title, children, width = 'w-[480px]' }: {
  open: boolean; onClose: () => void; title?: string
  children: React.ReactNode; width?: string
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  return (
    <>
      <div className={`fixed inset-0 z-40 bg-[var(--color-ink)]/30 transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <div className={`fixed right-0 top-0 bottom-0 z-50 ${width} bg-[var(--color-surface)] shadow-[var(--shadow-xl)] flex flex-col transition-transform duration-240 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-hairline)]">
            <h2 className="text-[16px] font-semibold text-[var(--color-ink)]">{title}</h2>
            <button onClick={onClose} className="p-1.5 rounded-[var(--radius-sm)] hover:bg-[var(--color-bg)] text-[var(--color-muted)] transition-colors">
              <X size={16} />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </>
  )
}

// ─── Form Field ───────────────────────────────────────────────────────────────

export function Field({ label, children, hint }: {
  label: string; children: React.ReactNode; hint?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] font-medium text-[var(--color-ink)]">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-[var(--color-muted)]">{hint}</p>}
    </div>
  )
}

const inputBase = 'w-full h-10 px-3 bg-[var(--color-bg)] border border-[var(--color-hairline)] rounded-[var(--radius-base)] text-[13px] text-[var(--color-ink)] placeholder:text-[var(--color-faint)] outline-none focus:border-[var(--color-purple)] focus:shadow-[0_0_0_3px_var(--color-purple-soft)] transition-all duration-150 font-[var(--font-sans)]'

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={inputBase} {...props} />
}

export function Select({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`${inputBase} cursor-pointer`} {...props}>
      {children}
    </select>
  )
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${inputBase} h-auto py-2.5 resize-none`} rows={3} {...props} />
}

// ─── Segmented Control ────────────────────────────────────────────────────────

export function SegmentedControl<T extends string>({ options, value, onChange }: {
  options: { label: string; value: T }[]
  value: T; onChange: (v: T) => void
}) {
  return (
    <div className="inline-flex items-center bg-[rgba(20,16,31,0.06)] rounded-[var(--radius-base)] p-0.5 gap-0.5">
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={`text-[12px] font-medium px-3 py-1.5 rounded-[10px] transition-all duration-180 ${value === o.value ? 'bg-white shadow-sm text-[var(--color-ink)]' : 'text-[var(--color-muted)] hover:text-[var(--color-ink)]'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

// ─── Toast (context) ──────────────────────────────────────────────────────────

interface ToastItem { id: number; message: string; type: 'success' | 'error' | 'info' }

const ToastContext = React.createContext<(msg: string, type?: ToastItem['type']) => void>(() => {})
export const useToast = () => React.useContext(ToastContext)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])
  const counter = useRef(0)

  const show = (message: string, type: ToastItem['type'] = 'success') => {
    const id = ++counter.current
    setToasts(t => [...t, { id, message, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500)
  }

  const typeStyle: Record<string, string> = {
    success: 'bg-[var(--color-success)] text-white',
    error:   'bg-[var(--color-danger)] text-white',
    info:    'bg-[var(--color-ink)] text-white',
  }

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`text-[13px] font-medium px-4 py-2.5 rounded-[var(--radius-base)] shadow-[var(--shadow-lg)] pointer-events-auto animate-[fadeSlideUp_0.2s_ease] ${typeStyle[t.type]}`}>
            {t.message}
          </div>
        ))}
      </div>
      <style>{`@keyframes fadeSlideUp { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:none } }`}</style>
    </ToastContext.Provider>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

export function EmptyState({ icon, title, description, action }: {
  icon?: React.ReactNode; title: string; description?: string; action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
      {icon && <div className="text-[var(--color-faint)] mb-1">{icon}</div>}
      <p className="text-[15px] font-semibold text-[var(--color-ink)]">{title}</p>
      {description && <p className="text-[13px] text-[var(--color-muted)] max-w-xs">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
