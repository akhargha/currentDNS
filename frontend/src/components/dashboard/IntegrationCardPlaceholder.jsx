import { CheckCircle2, AlertCircle, Search, Hash } from 'lucide-react';

function IntegrationCardPlaceholder({ integration }) {
  return (
    <article className="card bg-base-100 border border-base-300 shadow-sm transition-all hover:shadow-md">
      <div className="card-body p-5 gap-4">
        {/* Header: Title and Status Icon */}
        <div className="flex items-start justify-between">
          <div className="pr-2">
            <h3 className="text-lg font-bold leading-tight">{integration.name}</h3>
            <p className="text-xs opacity-50 mt-1 line-clamp-2 leading-relaxed">
              {integration.description}
            </p>
          </div>
          <div className="tooltip tooltip-left" data-tip="Integration Verified">
            <CheckCircle2 className="text-success shrink-0" size={20} />
          </div>
        </div>

        {/* Technical Details: Looking like data values */}
        <div className="space-y-3 rounded-xl bg-base-200 p-4 border border-base-300/50">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold opacity-40 mb-1">
              <Search size={12} />
              <span>Lookup Target</span>
            </div>
            <p className="font-mono text-[11px] truncate text-neutral" title={integration.lookupHost}>
              {integration.lookupHost}
            </p>
          </div>
          
          <div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold opacity-40 mb-1">
              <Hash size={12} />
              <span>Match Pattern</span>
            </div>
            <p className="font-mono text-[11px] truncate text-neutral" title={integration.matchPattern}>
              {integration.matchPattern}
            </p>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2 pt-1">
          <div className="badge badge-success badge-outline gap-1 text-[10px] font-bold py-3">
             Active Proof
          </div>
          {/* Example of how a missing proof might look */}
          {/* <div className="badge badge-warning badge-outline gap-1 text-[10px] font-bold py-3">
             <AlertCircle size={10} /> Missing
          </div> */}
        </div>
      </div>
    </article>
  )
}

export default IntegrationCardPlaceholder