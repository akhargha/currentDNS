import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import CheckVerificationPage from './pages/CheckVerificationPage'
import DashboardPage from './pages/DashboardPage'
import DnsVerificationPage from './pages/DnsVerificationPage'
import DomainMatchCheckPage from './pages/DomainMatchCheckPage'
import IntegrationsPage from './pages/IntegrationsPage'
import LandingPage from './pages/LandingPage'
import MonitoringSettingsPage from './pages/MonitoringSettingsPage'
import MonitorFrequencyPage from './pages/MonitorFrequencyPage'
import RequestOtpPage from './pages/RequestOtpPage'
import SignupPage from './pages/SignupPage'
import TimelinePage from './pages/TimelinePage'
import VerifyOtpPage from './pages/VerifyOtpPage'

function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signup/domain-match-check" element={<DomainMatchCheckPage />} />
        <Route path="/signup/dns-verification" element={<DnsVerificationPage />} />
        <Route path="/signup/check-verification" element={<CheckVerificationPage />} />
        <Route path="/signup/monitor-frequency" element={<MonitorFrequencyPage />} />
        <Route path="/auth/request-otp" element={<RequestOtpPage />} />
        <Route path="/auth/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/integrations" element={<IntegrationsPage />} />
        <Route path="/dashboard/timeline" element={<TimelinePage />} />
        <Route path="/settings/monitoring" element={<MonitoringSettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  )
}

export default App
