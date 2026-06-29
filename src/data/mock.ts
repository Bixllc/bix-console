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
export type ClientPlan   = 'starter' | 'growth' | 'scale'
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
  launchedAt?: string
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
  recipients?: number
}

export interface Meeting {
  id: string
  title: string
  clientName: string
  contact?: string
  date: string
  duration: number
  type: 'discovery' | 'check-in' | 'review' | 'onboarding'
  link?: string
}

export interface Sequence {
  id: string
  name: string
  steps: number
  enrolled: number
  status: 'active' | 'paused'
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const mockLeads: Lead[] = [
  // NEW stage
  { id: 'l1', business: 'Maple & Thread Boutique', contact: 'Hannah Cole', email: 'hannah@maplethread.co', value: 6200, stage: 'new', temperature: 'warm', source: 'website', industry: 'Retail', createdAt: '2026-06-20', updatedAt: '2026-06-28', activities: [] },
  { id: 'l2', business: 'Northside Pediatrics', contact: 'Dr. Lena Park', email: 'lena@northsidepeds.com', value: 11000, stage: 'new', temperature: 'hot', source: 'referral', industry: 'Healthcare', createdAt: '2026-06-22', updatedAt: '2026-06-29', activities: [
    { id: 'a1', type: 'note', content: 'Referred by Smoove Skin Studio. Ready to move.', createdAt: '2026-06-22' },
  ]},
  { id: 'l3', business: 'Crave Donuts', contact: 'Marcus Webb', email: 'marcus@cravedonuts.com', value: 4200, stage: 'new', temperature: 'cold', source: 'cold-email', industry: 'Food', createdAt: '2026-06-25', updatedAt: '2026-06-25', activities: [] },
  // CONTACTED stage
  { id: 'l4', business: 'Summit Roofing', contact: 'Joe Hartman', email: 'joe@summitroofing.com', value: 9500, stage: 'contacted', temperature: 'warm', source: 'website', industry: 'Home Services', createdAt: '2026-06-18', updatedAt: '2026-06-26', activities: [] },
  { id: 'l5', business: 'Bloom Florals', contact: 'Wendy Sato', email: 'wendy@bloomflorals.co', value: 5400, stage: 'contacted', temperature: 'cold', source: 'cold-email', industry: 'Retail', createdAt: '2026-06-19', updatedAt: '2026-06-24', activities: [] },
  // QUALIFIED stage
  { id: 'l6', business: 'TitanFit Studio', contact: 'Rico Alvarez', email: 'rico@titanfit.com', value: 14000, stage: 'qualified', temperature: 'hot', source: 'referral', industry: 'Fitness', createdAt: '2026-06-14', updatedAt: '2026-06-27', activities: [
    { id: 'a2', type: 'call', content: 'Discovery call done. Budget confirmed $12-15k.', createdAt: '2026-06-20' },
  ]},
  { id: 'l7', business: 'Cedar & Sage Spa', contact: 'Bianca Ross', email: 'bianca@cedarsage.com', value: 7800, stage: 'qualified', temperature: 'warm', source: 'website', industry: 'Wellness', createdAt: '2026-06-16', updatedAt: '2026-06-25', activities: [] },
  // PROPOSAL stage
  { id: 'l8', business: 'Harborview Realty', contact: 'Glen Tucker', email: 'glen@harborviewrealty.com', value: 18000, stage: 'proposal', temperature: 'hot', source: 'cold-email', industry: 'Real Estate', createdAt: '2026-06-10', updatedAt: '2026-06-28', activities: [
    { id: 'a3', type: 'email', content: 'Proposal deck sent. Awaiting response.', createdAt: '2026-06-25' },
  ]},
  { id: 'l9', business: 'Pour Decisions Bar', contact: 'Tara Quinn', email: 'tara@pourdecisions.com', value: 6900, stage: 'proposal', temperature: 'warm', source: 'website', industry: 'Hospitality', createdAt: '2026-06-17', updatedAt: '2026-06-26', activities: [] },
  // WON stage
  { id: 'l10', business: 'Greenline Movers', contact: 'Otis Reed', email: 'otis@greenlinemovers.com', value: 8200, stage: 'won', temperature: 'hot', source: 'referral', industry: 'Logistics', createdAt: '2026-06-01', updatedAt: '2026-06-24', activities: [] },
  { id: 'l11', business: 'Sunny Days Childcare', contact: 'Paula Meredith', email: 'paula@sunnydayscare.com', value: 5600, stage: 'won', temperature: 'warm', source: 'website', industry: 'Childcare', createdAt: '2026-06-05', updatedAt: '2026-06-20', activities: [] },
]

export const mockClients: Client[] = [
  { id: 'c1',  name: 'Anisha Carter',   company: 'Smoove Skin Studio',  email: 'anisha@smooveskinstudio.com',  plan: 'growth',  mrr: 850,  status: 'active', healthScore: 98, projectProgress: 72,  projectStatus: 'development', joinedAt: '2025-09-01', industry: 'Med Spa'       },
  { id: 'c2',  name: 'Derek Mills',     company: 'Ironside Gym',        email: 'derek@ironsidegym.com',        plan: 'scale',   mrr: 1800, status: 'active', healthScore: 95, projectProgress: 88,  projectStatus: 'development', joinedAt: '2025-10-15', industry: 'Fitness'       },
  { id: 'c3',  name: 'Rosa Delgado',    company: 'La Mesa Cantina',     email: 'rosa@lamesacantina.com',        plan: 'growth',  mrr: 850,  status: 'active', healthScore: 91, projectProgress: 64,  projectStatus: 'development', joinedAt: '2025-11-01', industry: 'Restaurant'    },
  { id: 'c4',  name: 'Dr. Aaron Pace',  company: 'BrightSmile Dental',  email: 'aaron@brightsmile.com',         plan: 'growth',  mrr: 850,  status: 'active', healthScore: 99, projectProgress: 100, projectStatus: 'launched',    joinedAt: '2026-01-10', industry: 'Dental'        },
  { id: 'c5',  name: 'Nina Brooks',     company: 'Coastal Realty Co.',  email: 'nina@coastalrealty.com',        plan: 'scale',   mrr: 1800, status: 'active', healthScore: 87, projectProgress: 45,  projectStatus: 'design',      joinedAt: '2025-12-01', industry: 'Real Estate'   },
  { id: 'c6',  name: 'Tony Vu',         company: 'PetPals Grooming',    email: 'tony@petpalsgrooming.com',      plan: 'starter', mrr: 350,  status: 'active', healthScore: 94, projectProgress: 100, projectStatus: 'launched',    joinedAt: '2025-12-15', industry: 'Pet Services'  },
  { id: 'c7',  name: 'Sam Ortega',      company: 'Verde Landscaping',   email: 'sam@verdelandscaping.com',      plan: 'growth',  mrr: 850,  status: 'active', healthScore: 82, projectProgress: 58,  projectStatus: 'development', joinedAt: '2026-02-01', industry: 'Home Services' },
  { id: 'c8',  name: 'Maya Lin',        company: 'The Daily Grind',     email: 'maya@thedailygrind.com',        plan: 'starter', mrr: 350,  status: 'active', healthScore: 96, projectProgress: 100, projectStatus: 'launched',    joinedAt: '2025-11-15', industry: 'Coffee Shop'   },
  { id: 'c9',  name: 'Chris Boone',     company: 'Apex Auto Detailing', email: 'chris@apexautodetailing.com',   plan: 'growth',  mrr: 850,  status: 'active', healthScore: 64, projectProgress: 30,  projectStatus: 'design',      joinedAt: '2026-03-01', industry: 'Automotive'    },
  { id: 'c10', name: 'Priya Anand',     company: 'Lumen Yoga',          email: 'priya@lumenyoga.com',           plan: 'starter', mrr: 350,  status: 'active', healthScore: 93, projectProgress: 100, projectStatus: 'launched',    joinedAt: '2025-10-01', industry: 'Wellness'      },
  { id: 'c11', name: 'Evelyn Reyes',    company: 'Stonemark Law',       email: 'evelyn@stonemarklaw.com',       plan: 'growth',  mrr: 540,  status: 'active', healthScore: 90, projectProgress: 76,  projectStatus: 'development', joinedAt: '2026-04-01', industry: 'Legal'         },
]

export const mockInvites: Invite[] = [
  { id: 'i1', name: 'Rico Alvarez', company: 'TitanFit Studio', email: 'rico@titanfit.com', plan: 'growth', note: 'Hot lead converting to client', status: 'pending', inviteLink: 'https://bix.agency/portal/set-password?token=abc123', sentAt: '2026-06-28' },
]

export const mockProjects: Project[] = [
  // Active builds
  { id: 'p1',  clientId: 'c1',  clientName: 'Smoove Skin Studio',  name: 'Website + Booking',  status: 'development', progress: 72,  dueDate: '2026-07-30' },
  { id: 'p2',  clientId: 'c2',  clientName: 'Ironside Gym',        name: 'Membership portal',  status: 'development', progress: 88,  dueDate: '2026-07-15' },
  { id: 'p3',  clientId: 'c3',  clientName: 'La Mesa Cantina',     name: 'Online ordering',    status: 'development', progress: 64,  dueDate: '2026-08-01' },
  { id: 'p4',  clientId: 'c5',  clientName: 'Coastal Realty Co.',  name: 'Listings platform',  status: 'design',      progress: 45,  dueDate: '2026-08-15' },
  { id: 'p5',  clientId: 'c7',  clientName: 'Verde Landscaping',   name: 'Quote system',       status: 'development', progress: 58,  dueDate: '2026-07-20' },
  { id: 'p6',  clientId: 'c9',  clientName: 'Apex Auto Detailing', name: 'Booking + payments', status: 'design',      progress: 30,  dueDate: '2026-09-01' },
  { id: 'p7',  clientId: 'c11', clientName: 'Stonemark Law',       name: 'Firm website',       status: 'development', progress: 76,  dueDate: '2026-07-10' },
  // Recently launched
  { id: 'p8',  clientId: 'c4',  clientName: 'BrightSmile Dental',  name: 'Website + intake',   status: 'launched',    progress: 100, dueDate: '2026-01-15', liveUrl: 'https://brightsmile.com',     launchedAt: '2026-01-01' },
  { id: 'p9',  clientId: 'c6',  clientName: 'PetPals Grooming',    name: 'Booking site',       status: 'launched',    progress: 100, dueDate: '2025-12-20', liveUrl: 'https://petpalsgrooming.com', launchedAt: '2025-12-01' },
  { id: 'p10', clientId: 'c8',  clientName: 'The Daily Grind',     name: 'Website refresh',    status: 'launched',    progress: 100, dueDate: '2025-11-10', liveUrl: 'https://thedailygrind.com',   launchedAt: '2025-11-01' },
  { id: 'p11', clientId: 'c10', clientName: 'Lumen Yoga',          name: 'Class schedule',     status: 'launched',    progress: 100, dueDate: '2025-10-20', liveUrl: 'https://lumenyoga.com',       launchedAt: '2025-10-01' },
]

export const mockInvoices: Invoice[] = [
  { id: 'inv1', clientId: 'c1',  clientName: 'Smoove Skin Studio',  amount: 850,  status: 'pending', issuedAt: '2026-06-25', dueAt: '2026-07-01', description: 'Growth Plan — July'         },
  { id: 'inv2', clientId: 'c2',  clientName: 'Ironside Gym',        amount: 1800, status: 'pending', issuedAt: '2026-06-20', dueAt: '2026-06-28', description: 'Scale Plan — June'          },
  { id: 'inv3', clientId: 'c5',  clientName: 'Coastal Realty Co.',  amount: 3200, status: 'pending', issuedAt: '2026-06-20', dueAt: '2026-06-28', description: 'Milestone 2 — listings'     },
  { id: 'inv4', clientId: 'c3',  clientName: 'La Mesa Cantina',     amount: 850,  status: 'paid',    issuedAt: '2026-06-01', dueAt: '2026-06-22', description: 'Growth Plan — June'         },
  { id: 'inv5', clientId: 'c4',  clientName: 'BrightSmile Dental',  amount: 850,  status: 'paid',    issuedAt: '2026-06-01', dueAt: '2026-06-17', description: 'Growth Plan — June'         },
  { id: 'inv6', clientId: 'c9',  clientName: 'Apex Auto Detailing', amount: 2000, status: 'overdue', issuedAt: '2026-05-20', dueAt: '2026-06-10', description: 'Project deposit'            },
  { id: 'inv7', clientId: 'c7',  clientName: 'Verde Landscaping',   amount: 1600, status: 'paid',    issuedAt: '2026-05-25', dueAt: '2026-06-04', description: 'Milestone 1'                },
]

export const mockCampaigns: Campaign[] = [
  { id: 'cam1', name: 'June re-engagement — cold leads', channel: 'cold-email', status: 'completed', audience: 'Cold leads',        sent: 240, opens: 99,  clicks: 30, replies: 14, conversions: 3, createdAt: '2026-06-24' },
  { id: 'cam2', name: 'New lead welcome',                channel: 'drip',       status: 'active',    audience: 'New website leads', sent: 128, opens: 75,  clicks: 40, replies: 22, conversions: 4, createdAt: '2026-06-10' },
  { id: 'cam3', name: 'Proposal follow-up nudge',        channel: 'email',      status: 'scheduled', audience: 'Proposal stage',    sent: 0,   opens: 0,   clicks: 0,  replies: 0,  conversions: 0, createdAt: '2026-06-28' },
  { id: 'cam4', name: 'Booking reminder blast',          channel: 'sms',        status: 'completed', audience: 'Warm leads',        sent: 88,  opens: 83,  clicks: 0,  replies: 31, conversions: 5, createdAt: '2026-06-22' },
  { id: 'cam5', name: 'Gym owners cold outreach',        channel: 'cold-email', status: 'active',    audience: 'Fitness',           sent: 47,  opens: 17,  clicks: 8,  replies: 8,  conversions: 1, createdAt: '2026-06-15' },
  { id: 'cam6', name: 'Instagram DM — local salons',     channel: 'social-dm',  status: 'draft',     audience: 'Salons',            sent: 0,   opens: 0,   clicks: 0,  replies: 0,  conversions: 0, createdAt: '2026-06-27' },
  { id: 'cam7', name: 'Spring launch newsletter',        channel: 'email',      status: 'completed', audience: 'All leads',         sent: 412, opens: 160, clicks: 45, replies: 9,  conversions: 2, createdAt: '2026-06-08' },
]

export const mockMeetings: Meeting[] = [
  { id: 'm1', title: 'Discovery',         clientName: 'TitanFit Studio',   contact: 'Rico Alvarez',  date: '2026-06-27T10:00:00', duration: 30, type: 'discovery',  link: 'https://meet.google.com/abc' },
  { id: 'm2', title: 'Proposal review',   clientName: 'Harborview Realty', contact: 'Glen Tucker',   date: '2026-06-27T14:30:00', duration: 45, type: 'review',     link: 'https://meet.google.com/def' },
  { id: 'm3', title: 'Booking walkthrough',clientName: 'Smoove Skin',      contact: 'Anisha Carter', date: '2026-06-28T11:00:00', duration: 30, type: 'check-in',   link: 'https://meet.google.com/ghi' },
  { id: 'm4', title: 'Kickoff',            clientName: 'Greenline Movers', contact: 'Otis Reed',     date: '2026-07-01T09:30:00', duration: 60, type: 'onboarding', link: 'https://meet.google.com/jkl' },
  { id: 'm5', title: 'Strategy',           clientName: 'Coastal Realty',   contact: 'Nina Brooks',   date: '2026-07-02T13:00:00', duration: 45, type: 'check-in' },
]

export const mockSequences: Sequence[] = [
  { id: 's1', name: 'New lead welcome',   steps: 4, enrolled: 34, status: 'active' },
  { id: 's2', name: 'Proposal follow-up', steps: 3, enrolled: 6,  status: 'active' },
  { id: 's3', name: 'Cold re-engagement', steps: 2, enrolled: 0,  status: 'paused' },
]

// ─── KPI helpers ──────────────────────────────────────────────────────────────

export const kpis = {
  mrr: 9440,
  pipelineValue: 83000,
  newLeadsThisMonth: 9,
  winRate: 100,
  activeClients: 10,
  overdueInvoices: 2000,
}
