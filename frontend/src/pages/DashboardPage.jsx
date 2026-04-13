import { Link } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import IntegrationGridPlaceholder from '../components/dashboard/IntegrationGridPlaceholder'
import ScanSummaryPlaceholder from '../components/dashboard/ScanSummaryPlaceholder'
import { useAuth } from '../context/AuthContext'
import { apiRequest } from '../lib/apiClient'

function DashboardPage() {
  const { token } = useAuth()
  const [summary, setSummary] = useState(null)
  const [integrations, setIntegrations] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const [summaryResponse, integrationsResponse] = await Promise.all([
        apiRequest('/dashboard/summary', { token }),
        apiRequest('/dashboard/integrations', { token }),
      ])
      setSummary(summaryResponse)
      setIntegrations(integrationsResponse.integrations || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [token])

  const runScanNow = async () => {
    if (!summary?.domain?.id) return
    await apiRequest('/dashboard/run-scan-now', {
      method: 'POST',
      token,
      body: { domain_id: summary.domain.id },
    })
    await loadDashboard()
  }

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

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
          <ScanSummaryPlaceholder summary={summary} />
        </div>

        {/* Integration Grid */}
        <div className="w-full">
          <IntegrationGridPlaceholder integrations={integrations} />
        </div>
        {loading ? <div className="alert"><span>Loading dashboard...</span></div> : null}
        {error ? <div className="alert alert-error"><span>{error}</span></div> : null}

        {/* Navigation Buttons - Centered to match the flow */}
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <button type="button" className="btn btn-neutral px-8" onClick={runScanNow} disabled={loading}>
            Run Scan Now
          </button>
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