// ─── Types ────────────────────────────────────────────────────────────────────

export type LeadStage = 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'
export type LeadTemp  = 'hot' | 'warm' | 'cold'
export type LeadSource = 'referral' | 'instagram' | 'google' | 'cold-email' | 'website' | 'sms'

export interface Lead {
  id: string
  business: string
  contact: string
  email: string
  phone?: string
  value: number
  stage: LeadStage
  temperature: LeadTemp
  source: LeadSource
  industry: string
  notes?: string
  createdAt: string
  updatedAt: string
  activities: Activity[]
}

export interface Activity {
  id: string
  type: 'note' | 'email' | 'call' | 'meeting' | 'stage-change'
  content: string
  createdAt: string
}

export type ClientStatus = 'active' | 'paused' | 'churned'
export type ClientPlan   = 'starter' | 'growth' | 'pro' | 'enterprise'
export type ProjectStatus = 'discovery' | 'design' | 'development' | 'review' | 'launched'
export type InviteStatus  = 'pending' | 'accepted'

export interface Client {
  id: string
  name: string
  company: string
  email: string
  plan: ClientPlan
  mrr: number
  status: ClientStatus
  healthScore: number
  projectProgress: number
  projectStatus: ProjectStatus
  joinedAt: string
  website?: string
  industry: string
}

export interface Invite {
  id: string
  name: string
  company: string
  email: string
  plan: ClientPlan
  note?: string
  status: InviteStatus
  inviteLink: string
  sentAt: string
}

export interface Project {
  id: string
  clientId: string
  clientName: string
  name: string
  status: ProjectStatus
  progress: number
  dueDate: string
  liveUrl?: string
  description?: string
}

export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'draft'

export interface Invoice {
  id: string
  clientId: string
  clientName: string
  amount: number
  status: InvoiceStatus
  issuedAt: string
  dueAt: string
  description: string
}

export type CampaignStatus  = 'active' | 'draft' | 'scheduled' | 'completed' | 'paused'
export type CampaignChannel = 'email' | 'sms' | 'drip' | 'cold-email' | 'social-dm'

export interface Campaign {
  id: string
  name: string
  channel: CampaignChannel
  status: CampaignStatus
  audience: string
  sent: number
  opens: number
  clicks: number
  replies: number
  conversions: number
  createdAt: string
}

export interface Meeting {
  id: string
  title: string
  clientName: string
  date: string
  duration: number
  type: 'discovery' | 'check-in' | 'review' | 'onboarding'
  link?: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const mockLeads: Lead[] = [
  {
    id: 'l1', business: 'Glow Beauty Bar', contact: 'Maya Johnson',
    email: 'maya@glowbeautybar.com', phone: '(214) 555-0192', value: 3500,
    stage: 'proposal', temperature: 'hot', source: 'instagram', industry: 'Beauty',
    notes: 'Needs booking system + rebrand. DM'd us via Instagram. Ready to move.',
    createdAt: '2026-06-10', updatedAt: '2026-06-28',
    activities: [
      { id: 'a1', type: 'note', content: 'Initial DM received. Very interested.', createdAt: '2026-06-10' },
      { id: 'a2', type: 'call', content: 'Discovery call — 30 min. Budget confirmed $3-4k.', createdAt: '2026-06-15' },
      { id: 'a3', type: 'email', content: 'Sent proposal deck.', createdAt: '2026-06-20' },
    ]
  },
  {
    id: 'l2', business: 'Trez Barber Studio', contact: 'Tre Williams',
    email: 'tre@trezbarber.com', value: 2800,
    stage: 'qualified', temperature: 'warm', source: 'referral', industry: 'Grooming',
    createdAt: '2026-06-14', updatedAt: '2026-06-26',
    activities: [
      { id: 'a4', type: 'note', content: 'Referred by Smoove Skin Studio client.', createdAt: '2026-06-14' },
    ]
  },
  {
    id: 'l3', business: 'Coastal Eats', contact: 'Sara Obi',
    email: 'sara@coastaleats.co', value: 4200,
    stage: 'contacted', temperature: 'warm', source: 'google', industry: 'Food & Bev',
    createdAt: '2026-06-18', updatedAt: '2026-06-25',
    activities: []
  },
  {
    id: 'l4', business: 'Apex Fitness', contact: 'Darnell King',
    email: 'darnell@apexfit.com', value: 5000,
    stage: 'new', temperature: 'cold', source: 'cold-email', industry: 'Fitness',
    createdAt: '2026-06-22', updatedAt: '2026-06-22',
    activities: []
  },
  {
    id: 'l5', business: 'Luxe Lash Co', contact: 'Nia Carter',
    email: 'nia@luxelash.co', value: 2200,
    stage: 'won', temperature: 'hot', source: 'instagram', industry: 'Beauty',
    createdAt: '2026-06-01', updatedAt: '2026-06-20',
    activities: []
  },
  {
    id: 'l6', business: 'Peak Legal Group', contact: 'James Owusu',
    email: 'james@peaklegal.com', value: 6500,
    stage: 'new', temperature: 'cold', source: 'website', industry: 'Legal',
    createdAt: '2026-06-25', updatedAt: '2026-06-25',
    activities: []
  },
  {
    id: 'l7', business: 'Bloom Floral', contact: 'Keisha Davis',
    email: 'keisha@bloomfloral.co', value: 1800,
    stage: 'contacted', temperature: 'warm', source: 'sms', industry: 'Retail',
    createdAt: '2026-06-19', updatedAt: '2026-06-24',
    activities: []
  },
]

export const mockClients: Client[] = [
  { id: 'c1', name: 'Yolanda Smoove', company: 'Smoove Skin Studio', email: 'yolanda@smooveskinstudio.com', plan: 'pro', mrr: 297, status: 'active', healthScore: 92, projectProgress: 100, projectStatus: 'launched', joinedAt: '2025-11-01', website: 'https://smooveskinstudio.com', industry: 'Beauty' },
  { id: 'c2', name: 'LyvWel Team', company: 'LyvWel', email: 'hello@lyvwel.com', plan: 'growth', mrr: 197, status: 'active', healthScore: 85, projectProgress: 100, projectStatus: 'launched', joinedAt: '2025-12-15', website: 'https://lyvwel.com', industry: 'Wellness' },
  { id: 'c3', name: 'Marcus Young', company: 'Young Talent Agency', email: 'marcus@yngtlntagency.com', plan: 'starter', mrr: 97, status: 'active', healthScore: 78, projectProgress: 100, projectStatus: 'launched', joinedAt: '2026-01-20', industry: 'Media' },
  { id: 'c4', name: 'Pon Di Rio', company: 'Pon Di Rio River Cottages', email: 'info@pondiriorivercottagesja.com', plan: 'growth', mrr: 197, status: 'active', healthScore: 88, projectProgress: 100, projectStatus: 'launched', joinedAt: '2026-02-10', industry: 'Hospitality' },
  { id: 'c5', name: 'David Nelson', company: 'Nelson Home Improvement', email: 'david@nelsonhomeimprovementllc.com', plan: 'starter', mrr: 97, status: 'active', healthScore: 72, projectProgress: 100, projectStatus: 'launched', joinedAt: '2026-03-05', industry: 'Home Services' },
]

export const mockInvites: Invite[] = [
  { id: 'i1', name: 'Maya Johnson', company: 'Glow Beauty Bar', email: 'maya@glowbeautybar.com', plan: 'growth', note: 'Referral from Smoove', status: 'pending', inviteLink: 'https://bix-marketing-site.vercel.app/set-password.html?token=abc123', sentAt: '2026-06-28' },
]

export const mockProjects: Project[] = [
  { id: 'p1', clientId: 'c1', clientName: 'Smoove Skin Studio', name: 'Booking Platform', status: 'launched', progress: 100, dueDate: '2026-01-15', liveUrl: 'https://smooveskinstudio.com' },
  { id: 'p2', clientId: 'c2', clientName: 'LyvWel', name: 'E-Commerce Store', status: 'launched', progress: 100, dueDate: '2026-02-01', liveUrl: 'https://lyvwel.com' },
  { id: 'p3', clientId: 'c3', clientName: 'Young Talent Agency', name: 'Agency Website', status: 'launched', progress: 100, dueDate: '2026-03-01' },
  { id: 'p4', clientId: 'c4', clientName: 'Pon Di Rio', name: 'Villa Booking Platform', status: 'launched', progress: 100, dueDate: '2026-03-20', liveUrl: 'https://pondiriorivercottagesja.com' },
  { id: 'p5', clientId: 'c5', clientName: 'Nelson Home Improvement', name: 'Lead Gen Website', status: 'launched', progress: 100, dueDate: '2026-04-10' },
]

export const mockInvoices: Invoice[] = [
  { id: 'inv1', clientId: 'c1', clientName: 'Smoove Skin Studio', amount: 2400, status: 'paid', issuedAt: '2025-11-01', dueAt: '2025-11-15', description: 'Website & Booking Platform — Build Fee' },
  { id: 'inv2', clientId: 'c2', clientName: 'LyvWel', amount: 1800, status: 'paid', issuedAt: '2025-12-15', dueAt: '2025-12-30', description: 'E-Commerce Development' },
  { id: 'inv3', clientId: 'c1', clientName: 'Smoove Skin Studio', amount: 297, status: 'paid', issuedAt: '2026-06-01', dueAt: '2026-06-01', description: 'Monthly Retainer — June' },
  { id: 'inv4', clientId: 'c2', clientName: 'LyvWel', amount: 197, status: 'pending', issuedAt: '2026-06-01', dueAt: '2026-07-01', description: 'Monthly Retainer — June' },
  { id: 'inv5', clientId: 'c3', clientName: 'Young Talent Agency', amount: 97, status: 'overdue', issuedAt: '2026-05-01', dueAt: '2026-06-01', description: 'Monthly Retainer — May' },
  { id: 'inv6', clientId: 'c4', clientName: 'Pon Di Rio', amount: 2800, status: 'paid', issuedAt: '2026-02-10', dueAt: '2026-02-24', description: 'Booking Platform — Build Fee' },
]

export const mockCampaigns: Campaign[] = [
  { id: 'cam1', name: 'Beauty Industry Outreach', channel: 'cold-email', status: 'active', audience: 'Beauty & Wellness', sent: 142, opens: 71, clicks: 28, replies: 12, conversions: 3, createdAt: '2026-06-01' },
  { id: 'cam2', name: 'Instagram DM Blast', channel: 'social-dm', status: 'completed', audience: 'Local Businesses', sent: 89, opens: 89, clicks: 34, replies: 21, conversions: 5, createdAt: '2026-05-15' },
  { id: 'cam3', name: 'Client Onboarding Drip', channel: 'drip', status: 'active', audience: 'New Clients', sent: 24, opens: 22, clicks: 18, replies: 4, conversions: 0, createdAt: '2026-06-10' },
  { id: 'cam4', name: 'Q3 SMS Follow-up', channel: 'sms', status: 'draft', audience: 'Hot Leads', sent: 0, opens: 0, clicks: 0, replies: 0, conversions: 0, createdAt: '2026-06-25' },
]

export const mockMeetings: Meeting[] = [
  { id: 'm1', title: 'Discovery Call', clientName: 'Glow Beauty Bar', date: '2026-06-30T14:00:00', duration: 30, type: 'discovery', link: 'https://calendly.com/bixllc' },
  { id: 'm2', title: 'Monthly Check-in', clientName: 'Smoove Skin Studio', date: '2026-07-02T10:00:00', duration: 45, type: 'check-in' },
  { id: 'm3', title: 'Project Review', clientName: 'LyvWel', date: '2026-07-05T15:00:00', duration: 60, type: 'review' },
]

// ─── KPI helpers ──────────────────────────────────────────────────────────────

export const kpis = {
  mrr: mockClients.reduce((s, c) => s + (c.status === 'active' ? c.mrr : 0), 0),
  pipelineValue: mockLeads.filter(l => l.stage !== 'lost').reduce((s, l) => s + l.value, 0),
  newLeadsThisMonth: mockLeads.filter(l => l.createdAt >= '2026-06-01').length,
  winRate: Math.round(mockLeads.filter(l => l.stage === 'won').length / mockLeads.filter(l => ['won','lost'].includes(l.stage)).length * 100) || 0,
  activeClients: mockClients.filter(c => c.status === 'active').length,
  overdueInvoices: mockInvoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount, 0),
}
