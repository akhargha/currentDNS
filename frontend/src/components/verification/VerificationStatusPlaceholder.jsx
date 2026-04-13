import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { api } from '../../lib/apiClient'

const stateConfig = {
  pending: { label: 'Pending', description: 'Awaiting DNS propagation / record check.', color: 'status-warning' },
  verified: { label: 'Verified', description: 'Required TXT token found, signup may continue.', color: 'status-success' },
  failed: { label: 'Failed', description: 'TXT token missing or incorrect.', color: 'status-error' },
}

function VerificationStatusPlaceholder({ userId, onVerified }) {
  const [status, setStatus] = useState('pending')
  const [checking, setChecking] = useState(false)

  async function handleCheck() {
    if (!userId) return
    setChecking(true)
    try {
      const res = await api.post('/api/signup/check-verification', { user_id: userId })
      setStatus(res.status)
      if (res.verified && onVerified) onVerified()
    } catch {
      setStatus('failed')
    } finally {
      setChecking(false)
    }
  }

  return (
    <section className="card bg-base-100 border border-base-300 w-full max-w-4xl shadow-sm">
      <div className="card-body p-8 gap-6">
        <div>
          <h3 className="card-title text-2xl font-bold">DNS Verification Status</h3>
          <p className="text-sm opacity-60 mt-1">Current progress of your domain ownership check.</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {Object.values(stateConfig).map((state) => (
            <div 
              key={state.label} 
              className={`flex items-center justify-between rounded-xl border p-4 ${
                state.label.toLowerCase() === status ? 'border-neutral bg-base-200' : 'border-base-200 bg-base-50/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <div aria-label={state.label} className={`status ${state.color} status-md`}></div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm uppercase tracking-wide">{state.label}</p>
                    {state.label.toLowerCase() === status && (
                      <span className="badge badge-neutral badge-xs">current</span>
                    )}
                  </div>
                  <p className="text-sm opacity-70">{state.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button className="btn btn-neutral flex-1" type="button" onClick={handleCheck} disabled={checking}>
            {checking ? <span className="loading loading-spinner loading-sm"></span> : 'I Have Added the TXT Record'}
          </button>
          <button className="btn btn-outline flex-1" type="button" onClick={handleCheck} disabled={checking}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Re-check DNS Verification
          </button>
        </div>
      </div>
    </section>
  )
}

export default VerificationStatusPlaceholder
