import { CheckCircle2, AlertCircle, Search, Hash } from 'lucide-react';

const INTEGRATION_META = {
  bluesky: {
    name: 'Bluesky',
    description: 'Detect DID proof in a TXT record for Bluesky domain verification.',
  },
  keybase: {
    name: 'Keybase',
    description: 'Detect keybase-site-verification proof in apex domain TXT records.',
  },
  github_org: {
    name: 'GitHub Organization',
    description: 'Detect organization DNS proof under the GitHub host naming pattern.',
  },
}

function IntegrationCardPlaceholder({ integration }) {
  const isValid = integration.status === 'valid'
  const isBroken = integration.status === 'broken'
  const meta = integration.integration_type ? INTEGRATION_META[integration.integration_type] : null
  const displayName = integration.name || meta?.name || integration.integration_type || 'Integration'
  const displayDescription = integration.description || meta?.description || 'DNS integration status'
  const displayLookupHost = integration.lookup_host || integration.lookupHost || '-'
  const displayMatchPattern = integration.last_txt_value || integration.matchPattern || '-'

  return (
    <article className="card bg-base-100 border border-base-300 shadow-sm transition-all hover:shadow-md">
      <div className="card-body p-5 gap-4">
        {/* Header: Title and Status Icon */}
        <div className="flex items-start justify-between">
          <div className="pr-2">
            <h3 className="text-lg font-bold leading-tight">{displayName}</h3>
            <p className="text-xs opacity-50 mt-1 line-clamp-2 leading-relaxed">
              {displayDescription}
            </p>
          </div>
          <div className="tooltip tooltip-left" data-tip={isValid ? 'Integration Verified' : 'Integration Missing/Broken'}>
            {isValid ? <CheckCircle2 className="text-success shrink-0" size={20} /> : <AlertCircle className="text-warning shrink-0" size={20} />}
          </div>
        </div>

        {/* Technical Details: Looking like data values */}
        <div className="space-y-3 rounded-xl bg-base-200 p-4 border border-base-300/50">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold opacity-40 mb-1">
              <Search size={12} />
              <span>Lookup Target</span>
            </div>
            <p className="font-mono text-[11px] truncate text-neutral" title={displayLookupHost}>
              {displayLookupHost}
            </p>
          </div>
          
          <div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold opacity-40 mb-1">
              <Hash size={12} />
              <span>Match Pattern</span>
            </div>
            <p className="font-mono text-[11px] truncate text-neutral" title={displayMatchPattern}>
              {displayMatchPattern}
            </p>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2 pt-1">
          {isValid ? <div className="badge badge-success badge-outline gap-1 text-[10px] font-bold py-3">Active Proof</div> : null}
          {isBroken ? (
            <div className="badge badge-error badge-outline gap-1 text-[10px] font-bold py-3">
              <AlertCircle size={10} /> Proof Broken
            </div>
          ) : null}
          {!isValid && !isBroken ? <div className="badge badge-warning badge-outline gap-1 text-[10px] font-bold py-3">Missing</div> : null}
        </div>
      </div>
    </article>
  )
}

export default IntegrationCardPlaceholder