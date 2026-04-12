import { Link } from 'react-router-dom'
import IntegrationGridPlaceholder from '../components/dashboard/IntegrationGridPlaceholder'
import ScanSummaryPlaceholder from '../components/dashboard/ScanSummaryPlaceholder'

function DashboardPage() {
  return (
    <section className="space-y-6">
      <h2 className="text-3xl font-bold">Dashboard</h2>
      {/* TODO: Load latest scan summary from backend on page load. */}
      <ScanSummaryPlaceholder />
      {/* TODO: Replace with live integration detection results from scheduled scans. */}
      <IntegrationGridPlaceholder />
      <div className="flex flex-wrap gap-2">
        <Link to="/dashboard/integrations" className="btn btn-outline">
          Open Integrations View
        </Link>
        <Link to="/dashboard/timeline" className="btn btn-outline">
          Open Timeline View
        </Link>
      </div>
    </section>
  )
}

export default DashboardPage
