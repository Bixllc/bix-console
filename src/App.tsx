import { Routes, Route } from 'react-router-dom'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { ToastProvider } from '@/components/ui'
import { Dashboard } from '@/pages/Dashboard'
import { Leads } from '@/pages/Leads'
import { Nurture } from '@/pages/Nurture'
import { Clients } from '@/pages/Clients'
import { Projects } from '@/pages/Projects'
import { Invoices } from '@/pages/Invoices'
import { CalendarPage } from '@/pages/Calendar'
import { SettingsPage } from '@/pages/Settings'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'var(--bx-sidebar) 1fr',
      height: '100vh',
      overflow: 'hidden',
      background: 'var(--bx-bg)',
    }}>
      <Sidebar />
      {/* col-span-full on mobile: sidebar is fixed (out of flow) so content must span both cols */}
      <div className="col-span-full lg:col-auto" style={{ display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflow: 'hidden' }}>
        <Topbar />
        {/* portal.css: .bx-view = flex:1, overflow-y:auto, padding 28 30 60 */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 30px 60px' }}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/"         element={<Layout><Dashboard /></Layout>} />
        <Route path="/leads"    element={<Layout><Leads /></Layout>} />
        <Route path="/nurture"  element={<Layout><Nurture /></Layout>} />
        <Route path="/clients"  element={<Layout><Clients /></Layout>} />
        <Route path="/projects" element={<Layout><Projects /></Layout>} />
        <Route path="/invoices" element={<Layout><Invoices /></Layout>} />
        <Route path="/calendar" element={<Layout><CalendarPage /></Layout>} />
        <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
      </Routes>
    </ToastProvider>
  )
}
