import { RefreshCw } from 'lucide-react';

function VerificationStatusPlaceholder({ verificationState, onCheck, loading, records }) {
  const states = [
    {
      label: 'Pending',
      description: 'Awaiting DNS propagation / record check.',
      color: verificationState === 'pending' ? 'status-warning' : 'status-neutral',
    },
    {
      label: 'Verified',
      description: 'Required TXT token found, signup may continue.',
      color: verificationState === 'verified' ? 'status-success' : 'status-neutral',
    },
    {
      label: 'Failed',
      description: 'TXT token missing or incorrect.',
      color: verificationState === 'failed' ? 'status-error' : 'status-neutral',
    },
  ]

  return (
    <section className="card bg-base-100 border border-base-300 w-full max-w-4xl shadow-sm">
      <div className="card-body p-8 gap-6">
        <div>
          <h3 className="card-title text-2xl font-bold">DNS Verification Status</h3>
          <p className="text-sm opacity-60 mt-1">Current progress of your domain ownership check.</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {states.map((state) => (
            <div 
              key={state.label} 
              className="flex items-center justify-between rounded-xl border border-base-200 p-4 bg-base-50/50"
            >
              <div className="flex items-center gap-4">
                {/* The DaisyUI Status Dot */}
                <div aria-label={state.label} className={`status ${state.color} status-md`}></div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm uppercase tracking-wide">{state.label}</p>
                  </div>
                  <p className="text-sm opacity-70">{state.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button className="btn btn-neutral flex-1" type="button" onClick={onCheck} disabled={loading}>
            {loading ? 'Checking...' : 'I Have Added the TXT Record'}
          </button>
          <button className="btn btn-outline flex-1" type="button" onClick={onCheck} disabled={loading}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Re-check DNS Verification
          </button>
        </div>
        {records?.length ? (
          <div className="mt-2 text-sm">
            <p className="font-semibold">Observed TXT records:</p>
            <ul className="list-disc list-inside">
              {records.map((record) => (
                <li key={record}>{record}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default VerificationStatusPlaceholder