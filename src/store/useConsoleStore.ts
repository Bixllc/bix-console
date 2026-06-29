import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  Lead, LeadStage, Client, Invite, Project, Invoice, Campaign,
  mockLeads, mockClients, mockInvites, mockProjects, mockInvoices, mockCampaigns
} from '@/data/mock'

interface ConsoleStore {
  // Leads
  leads: Lead[]
  moveLead: (id: string, stage: LeadStage) => void
  addLead: (lead: Lead) => void
  updateLead: (id: string, patch: Partial<Lead>) => void

  // Clients
  clients: Client[]
  invites: Invite[]
  addInvite: (invite: Invite) => void
  updateInvite: (id: string, patch: Partial<Invite>) => void

  // Projects
  projects: Project[]

  // Invoices
  invoices: Invoice[]

  // Campaigns
  campaigns: Campaign[]
  addCampaign: (c: Campaign) => void

  // UI
  sidebarOpen: boolean
  setSidebarOpen: (v: boolean) => void
  activeDrawer: string | null
  setActiveDrawer: (id: string | null) => void
}

export const useConsoleStore = create<ConsoleStore>()(
  persist(
    (set) => ({
      leads: mockLeads,
      moveLead: (id, stage) =>
        set(s => ({ leads: s.leads.map(l => l.id === id ? { ...l, stage, updatedAt: new Date().toISOString() } : l) })),
      addLead: (lead) => set(s => ({ leads: [lead, ...s.leads] })),
      updateLead: (id, patch) =>
        set(s => ({ leads: s.leads.map(l => l.id === id ? { ...l, ...patch } : l) })),

      clients: mockClients,
      invites: mockInvites,
      addInvite: (invite) => set(s => ({ invites: [invite, ...s.invites] })),
      updateInvite: (id, patch) =>
        set(s => ({ invites: s.invites.map(i => i.id === id ? { ...i, ...patch } : i) })),

      projects: mockProjects,
      invoices: mockInvoices,
      campaigns: mockCampaigns,
      addCampaign: (c) => set(s => ({ campaigns: [c, ...s.campaigns] })),

      sidebarOpen: true,
      setSidebarOpen: (v) => set({ sidebarOpen: v }),
      activeDrawer: null,
      setActiveDrawer: (id) => set({ activeDrawer: id }),
    }),
    { name: 'bix-console', partialize: (s) => ({ leads: s.leads, invites: s.invites, campaigns: s.campaigns }) }
  )
)
