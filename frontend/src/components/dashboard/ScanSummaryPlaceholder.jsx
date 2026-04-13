import { Globe, Clock, Zap, AlertTriangle, Calendar } from 'lucide-react'

function ScanSummaryPlaceholder({ summary }) {
  if (!summary) {
    return (
      <section className="card bg-base-100 border border-base-300 w-full max-w-4xl shadow-sm">
        <div className="card-body p-8 flex items-center justify-center">
          <span className="loading loading-spinner loading-md"></span>
        </div>
      </section>
    )
  }

  const healthy = summary.broken_count === 0

  function formatDate(iso) {
    if (!iso) return '—'
    return new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <section className="card bg-base-100 border border-base-300 w-full max-w-4xl shadow-sm">
      <div className="card-body p-8 gap-8">
        
        <div className="text-left w-full">
          <h2 className="card-title text-2xl font-bold">Scan Summary</h2>
          <p className="text-sm opacity-60 mt-1">
            An overview of your domain's monitoring status and detected integrations.
          </p>
        </div>

        <div className="stats stats-vertical lg:stats-horizontal border border-base-300 bg-base-200 w-full overflow-hidden">
          
          <div className="stat px-6 py-4">
            <div className="stat-figure text-neutral opacity-30">
              <Globe size={24} />
            </div>
            <div className="stat-title text-xs uppercase tracking-widest font-bold">Monitored Target</div>
            <div className="stat-value text-base mt-1">{summary.domain}</div>
            <div className="stat-desc font-mono">{summary.email}</div>
          </div>

          <div className="stat px-6 py-4 border-l border-base-300">
            <div className="stat-figure text-neutral opacity-30">
              <Clock size={24} />
            </div>
            <div className="stat-title text-xs uppercase tracking-widest font-bold">Last Scan</div>
            <div className="stat-value text-base mt-1">{formatDate(summary.last_scan_at)}</div>
            <div className="stat-desc flex items-center gap-1">
              <Calendar size={12} /> Next: {formatDate(summary.next_scan_at)}
            </div>
          </div>

          <div className="stat px-6 py-4 border-l border-base-300">
            <div className="stat-figure text-neutral opacity-30">
              <Zap size={24} />
            </div>
            <div className="stat-title text-xs uppercase tracking-widest font-bold">Integrations</div>
            <div className="stat-value text-base mt-1">{summary.active_count} Active</div>
            <div className="stat-desc text-success font-medium">{summary.total_integrations} total tracked</div>
          </div>

          <div className="stat px-6 py-4 border-l border-base-300">
            <div className={`stat-figure ${healthy ? 'text-success' : 'text-error'}`}>
              <CheckCircle size={24} className="opacity-80" />
            </div>
            <div className="stat-title text-xs uppercase tracking-widest font-bold">Alert State</div>
            <div className={`stat-value text-base mt-1 uppercase font-bold tracking-tight ${healthy ? 'text-success' : 'text-error'}`}>
              {healthy ? 'Healthy' : `${summary.broken_count} Broken`}
            </div>
            <div className="stat-desc italic">{healthy ? 'No broken proofs' : 'Check timeline for details'}</div>
          </div>

        </div>

        <div className="alert bg-base-200 border-none text-sm">
          <AlertTriangle size={18} className="text-info" />
          <span>Detailed integration results are available in the full report below.</span>
        </div>
      </div>
    </section>
  )
}

function CheckCircle({ size, className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  )
}

export default ScanSummaryPlaceholder
