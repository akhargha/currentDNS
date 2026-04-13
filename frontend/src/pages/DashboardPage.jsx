import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/apiClient'
import IntegrationGridPlaceholder from '../components/dashboard/IntegrationGridPlaceholder'
import ScanSummaryPlaceholder from '../components/dashboard/ScanSummaryPlaceholder'

function DashboardPage() {
  const [summary, setSummary] = useState(null)
  const [integrations, setIntegrations] = useState(null)
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    api.get('/api/dashboard/summary').then(setSummary).catch(() => {})
    api.get('/api/dashboard/integrations').then(setIntegrations).catch(() => {})
  }, [])

  async function handleScan() {
    setScanning(true)
    try {
      const res = await api.post('/api/dashboard/scan')
      setIntegrations(res.results)
      api.get('/api/dashboard/summary').then(setSummary)
    } catch { /* ignore */ }
    finally { setScanning(false) }
  }

  return (
    <section className="flex flex-col items-center justify-start min-h-screen py-8">
      <div className="w-full max-w-4xl space-y-10">
        
        <div className="text-left w-full px-4 lg:px-0 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-black tracking-tight text-neutral">Dashboard</h2>
            <p className="text-sm opacity-50 mt-1">
              Real-time status of your domain proofs and service integrations.
            </p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={handleScan} disabled={scanning}>
            {scanning ? <span className="loading loading-spinner loading-sm"></span> : 'Run Scan Now'}
          </button>
        </div>

        <div className="w-full">
          <ScanSummaryPlaceholder summary={summary} />
        </div>

        <div className="w-full">
          <IntegrationGridPlaceholder integrations={integrations} />
        </div>

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
