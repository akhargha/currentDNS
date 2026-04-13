import { Link } from 'react-router-dom'
import IntegrationGridPlaceholder from '../components/dashboard/IntegrationGridPlaceholder'
import ScanSummaryPlaceholder from '../components/dashboard/ScanSummaryPlaceholder'

function DashboardPage() {
  return (
    /* Centers the entire dashboard column */
    <section className="flex flex-col items-center justify-start min-h-screen py-8">
      <div className="w-full max-w-4xl space-y-10">
        
        {/* Dashboard Header - Left Aligned to the column */}
        <div className="text-left w-full px-4 lg:px-0">
          <h2 className="text-4xl font-black tracking-tight text-neutral">Dashboard</h2>
          <p className="text-sm opacity-50 mt-1">
            Real-time status of your domain proofs and service integrations.
          </p>
        </div>

        {/* Scan Summary Card */}
        <div className="w-full">
          <ScanSummaryPlaceholder />
        </div>

        {/* Integration Grid */}
        <div className="w-full">
          <IntegrationGridPlaceholder />
        </div>

        {/* Navigation Buttons - Centered to match the flow */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link to="/dashboard/integrations" className="btn btn-neutral px-8">
            Open Integrations View
          </Link>
          <Link to="/dashboard/timeline" className="btn btn-outline px-8 border-base-300">
            Open Timeline View
          </Link>
        </div>
      </div>
    </section>
  )
}

export default DashboardPage