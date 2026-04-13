import { useState } from 'react'
import { api } from '../../lib/apiClient'

function DnsInstructionPlaceholder({ domain, token, userId }) {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const host = `_verifydns.${domain || 'domain.com'}`
  const value = token || 'loading...'

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  const CopyButton = ({ text }) => (
    <button 
      onClick={() => copyToClipboard(text)}
      className="btn btn-ghost btn-xs btn-square ml-2 opacity-50 hover:opacity-100"
      title="Copy to clipboard"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
    </button>
  )

  async function handleSendEmail() {
    if (!userId) return
    setSending(true)
    try {
      await api.post('/api/signup/send-verification', { user_id: userId })
      setSent(true)
    } catch { /* ignore */ }
    finally { setSending(false) }
  }

  return (
    <section className="card bg-base-100 border border-base-300 w-full shadow-sm">
      <div className="card-body p-8 gap-8">
        <div>
          <h3 className="card-title text-2xl font-bold mb-2">DNS TXT Verification</h3>
          <p className="text-sm opacity-70">
            Please add the following TXT record to your DNS configuration to verify your domain ownership.
          </p>
        </div>

        <div className="stats stats-vertical lg:stats-horizontal border border-base-300 bg-base-200 w-full">
          <div className="stat px-6 py-4">
            <div className="stat-title text-xs uppercase tracking-widest font-bold">TXT Host</div>
            <div className="stat-value text-lg flex items-center font-mono">
              {host}
              <CopyButton text={host} />
            </div>
          </div>

          <div className="stat px-6 py-4">
            <div className="stat-title text-xs uppercase tracking-widest font-bold">TXT Value</div>
            <div className="stat-value text-lg flex items-center font-mono">
              {value}
              <CopyButton text={value} />
            </div>
          </div>
        </div>

        <div className="alert bg-base-200 border-none text-sm italic opacity-80">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>It may take a few minutes for the TXT record to propagate.</span>
        </div>

        <div className="flex justify-center">
          <button className="btn btn-outline btn-sm" onClick={handleSendEmail} disabled={sending || sent}>
            {sent ? 'Instructions emailed!' : sending ? 'Sending...' : 'Email me these instructions'}
          </button>
        </div>
      </div>
    </section>
  )
}

export default DnsInstructionPlaceholder
