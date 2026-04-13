import { Globe, Clock, Zap, AlertTriangle, Calendar } from 'lucide-react';

function ScanSummaryPlaceholder() {
  return (
    <section className="card bg-base-100 border border-base-300 w-full max-w-4xl shadow-sm">
      <div className="card-body p-8 gap-8">
        
        {/* Header - Stays Left Aligned */}
        <div className="text-left w-full">
          <h2 className="card-title text-2xl font-bold">Scan Summary</h2>
          <p className="text-sm opacity-60 mt-1">
            An overview of your domain's monitoring status and detected integrations.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="stats stats-vertical lg:stats-horizontal border border-base-300 bg-base-200 w-full overflow-hidden">
          
          {/* Domain Info */}
          <div className="stat px-6 py-4">
            <div className="stat-figure text-neutral opacity-30">
              <Globe size={24} />
            </div>
            <div className="stat-title text-xs uppercase tracking-widest font-bold">Monitored Target</div>
            <div className="stat-value text-base mt-1">example.com</div>
            <div className="stat-desc font-mono">admin@example.com</div>
          </div>

          {/* Timing Info */}
          <div className="stat px-6 py-4 border-l border-base-300">
            <div className="stat-figure text-neutral opacity-30">
              <Clock size={24} />
            </div>
            <div className="stat-title text-xs uppercase tracking-widest font-bold">Last Scan</div>
            <div className="stat-value text-base mt-1">Oct 24, 14:20</div>
            <div className="stat-desc flex items-center gap-1">
              <Calendar size={12} /> Next: Oct 25, 14:20
            </div>
          </div>

          {/* Integrations */}
          <div className="stat px-6 py-4 border-l border-base-300">
            <div className="stat-figure text-neutral opacity-30">
              <Zap size={24} />
            </div>
            <div className="stat-title text-xs uppercase tracking-widest font-bold">Integrations</div>
            <div className="stat-value text-base mt-1">12 Detected</div>
            <div className="stat-desc text-success font-medium">All active</div>
          </div>

          {/* Alert Status */}
          <div className="stat px-6 py-4 border-l border-base-300">
            <div className="stat-figure text-success">
              <CheckCircle size={24} className="opacity-80" />
            </div>
            <div className="stat-title text-xs uppercase tracking-widest font-bold">Alert State</div>
            <div className="stat-value text-base mt-1 text-success uppercase font-bold tracking-tight">
              Healthy
            </div>
            <div className="stat-desc italic">No broken proofs</div>
          </div>

        </div>

        {/* Footer Alert */}
        <div className="alert bg-base-200 border-none text-sm">
          <AlertTriangle size={18} className="text-info" />
          <span>Detailed integration results are available in the full report below.</span>
        </div>
      </div>
    </section>
  )
}

// Helper for the icon used in Alert State
function CheckCircle({ size, className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}

export default ScanSummaryPlaceholder;