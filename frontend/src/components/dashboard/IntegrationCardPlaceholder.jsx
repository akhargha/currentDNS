import { CheckCircle2, AlertCircle, Search, Hash, XCircle } from 'lucide-react'

const INTEGRATION_META = {
  bluesky: { name: 'Bluesky', description: 'DID proof in _atproto TXT record.', lookupHost: '_atproto.{domain}', matchPattern: 'did=...' },
  keybase: { name: 'Keybase', description: 'Site verification in apex TXT records.', lookupHost: '{domain} TXT', matchPattern: 'keybase-site-verification=...' },
  github:  { name: 'GitHub Org', description: 'Organization DNS proof under _gh-*-o subdomain.', lookupHost: '_gh-{org}-o.{domain}', matchPattern: 'TXT record exists' },
}

function IntegrationCardPlaceholder({ integration }) {
  const meta = INTEGRATION_META[integration.type] || { name: integration.type, description: '', lookupHost: '', matchPattern: '' }
  const isActive = integration.status === 'active'
  const isBroken = integration.status === 'broken'

  return (
    <article className="card bg-base-100 border border-base-300 shadow-sm transition-all hover:shadow-md">
      <div className="card-body p-5 gap-4">
        <div className="flex items-start justify-between">
          <div className="pr-2">
            <h3 className="text-lg font-bold leading-tight">{meta.name}</h3>
            <p className="text-xs opacity-50 mt-1 line-clamp-2 leading-relaxed">
              {meta.description}
            </p>
          </div>
          <div className="tooltip tooltip-left" data-tip={isActive ? 'Verified' : isBroken ? 'Proof Broken' : 'Not Found'}>
            {isActive && <CheckCircle2 className="text-success shrink-0" size={20} />}
            {isBroken && <AlertCircle className="text-error shrink-0" size={20} />}
            {!isActive && !isBroken && <XCircle className="text-base-300 shrink-0" size={20} />}
          </div>
        </div>

        <div className="space-y-3 rounded-xl bg-base-200 p-4 border border-base-300/50">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold opacity-40 mb-1">
              <Search size={12} />
              <span>Lookup Target</span>
            </div>
            <p className="font-mono text-[11px] truncate text-neutral" title={meta.lookupHost}>
              {meta.lookupHost}
            </p>
          </div>
          
          <div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-bold opacity-40 mb-1">
              <Hash size={12} />
              <span>{isActive ? 'Current TXT' : 'Match Pattern'}</span>
            </div>
            <p className="font-mono text-[11px] truncate text-neutral" title={integration.last_valid_txt || meta.matchPattern}>
              {integration.last_valid_txt || meta.matchPattern}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {isActive && (
            <div className="badge badge-success badge-outline gap-1 text-[10px] font-bold py-3">
              Active Proof
            </div>
          )}
          {isBroken && (
            <div className="badge badge-error badge-outline gap-1 text-[10px] font-bold py-3">
              <AlertCircle size={10} /> Broken
            </div>
          )}
          {!isActive && !isBroken && (
            <div className="badge badge-ghost badge-outline gap-1 text-[10px] font-bold py-3">
              Not Detected
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default IntegrationCardPlaceholder
