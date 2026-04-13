import { useState } from 'react';

function GithubOrgInputPlaceholder({ initialOrg = '', onSave, loading }) {
  const [org, setOrg] = useState(initialOrg);

  return (
    <section className="card bg-base-100 border border-base-300 w-full max-w-3xl shadow-sm">
      <div className="card-body p-8 gap-6">
        
        {/* Header - Reduced margin/size slightly */}
        <div className="text-left w-full">
          <h3 className="card-title text-xl font-bold">GitHub Organization</h3>
          <p className="text-xs opacity-60 mt-0.5">
            Monitor DNS proofs for your organization.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          {/* Input Area */}
          <div className="form-control w-full text-left">
            <label className="label py-1">
              <span className="label-text font-bold uppercase text-[10px] opacity-50 tracking-widest">
                Organization Name
              </span>
            </label>
            <input 
              type="text" 
              className="input input-bordered input-md w-full font-mono text-sm" 
              placeholder="e.g. acme-corp" 
              value={org}
              onChange={(e) => setOrg(e.target.value)}
            />
          </div>

          {/* Verification Preview Box - More compact padding */}
          <div className="rounded-lg bg-base-200 p-4 border border-base-300/50 text-left">
            <p className="text-[9px] uppercase font-bold opacity-40 tracking-widest mb-2">
              DNS Lookup Host
            </p>
            <code className="text-xs font-mono text-neutral break-all bg-base-300/30 px-1 rounded">
              _gh-{org || "organization"}-o.domain.com
            </code>
          </div>
        </div>

        {/* Centered Button - Reduced top margin */}
        <div className="flex justify-center mt-2">
          <button className="btn btn-neutral btn-sm px-10 h-10 gap-2" type="button" onClick={() => onSave(org)} disabled={loading || !org.trim()}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
              <polyline points="17 21 17 13 7 13 7 21"/>
              <polyline points="7 3 7 8 15 8"/>
            </svg>
            {loading ? 'Saving...' : 'Save Organization'}
          </button>
        </div>
      </div>
    </section>
  )
}

export default GithubOrgInputPlaceholder