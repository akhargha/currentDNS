import { useState, useEffect } from 'react'
import { api } from '../../lib/apiClient'

const INTEGRATION_LABELS = { bluesky: 'Bluesky', keybase: 'Keybase', github: 'GitHub Organization' }

function TimelinePlaceholder() {
  const [entries, setEntries] = useState(null)
  const [selectedSnapshot, setSelectedSnapshot] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/dashboard/timeline')
      .then(setEntries)
      .catch((e) => setError(e.message))
  }, [])

  if (error) return <div className="alert alert-error">{error}</div>
  if (!entries) return <div className="flex justify-center py-12"><span className="loading loading-spinner loading-md"></span></div>

  // Group entries by integration_type for the timeline view
  const grouped = {}
  for (const e of entries) {
    const t = e.integration_type
    if (!grouped[t]) grouped[t] = []
    grouped[t].push(e)
  }

  // Build timeline items per integration (derive first_seen, last_valid, broken)
  const timelineItems = Object.entries(grouped).map(([type, rows]) => {
    const sorted = [...rows].sort((a, b) => new Date(a.scanned_at) - new Date(b.scanned_at))
    const firstFound = sorted.find(r => r.status === 'found')
    const lastFound = [...sorted].reverse().find(r => r.status === 'found')
    const lastEntry = sorted[sorted.length - 1]
    const isBroken = lastEntry?.status === 'not_found' && firstFound

    return {
      id: type,
      integration: INTEGRATION_LABELS[type] || type,
      status: isBroken ? 'broken' : firstFound ? 'valid' : 'not_found',
      firstSeen: firstFound?.scanned_at || null,
      firstSeenTxt: firstFound?.txt_record || null,
      lastValid: lastFound?.scanned_at || null,
      lastValidTxt: lastFound?.txt_record || null,
      brokenAt: isBroken ? lastEntry.scanned_at : null,
      brokenTxt: isBroken ? lastEntry.txt_record : null,
    }
  })

  function formatDate(iso) {
    if (!iso) return '—'
    return new Date(iso).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const renderTimeline = (item) => {
    if (!item.firstSeen) {
      return (
        <div className="p-4 bg-base-200 rounded-lg border border-dashed border-base-300 text-center">
          <p className="text-xs opacity-50 uppercase tracking-widest font-bold">Status: Unverified</p>
          <p className="text-sm mt-1 text-error">No DNS records have been detected for this integration yet.</p>
        </div>
      )
    }

    const isBroken = item.status === 'broken'

    return (
      <ul className="timeline timeline-vertical timeline-compact">
        <li>
          <div className="timeline-middle"><CheckIcon className="text-success" /></div>
          <button 
            onClick={() => setSelectedSnapshot({ type: 'First Seen', record: item.firstSeenTxt, date: formatDate(item.firstSeen) })}
            className="timeline-start timeline-box text-xs hover:bg-base-200 transition-colors cursor-pointer text-left"
          >
            <span className="block font-bold opacity-50 uppercase text-[9px]">First Discovered</span>
            {formatDate(item.firstSeen)}
          </button>
          <hr className="bg-success" />
        </li>

        <li>
          <hr className="bg-success" />
          <div className="timeline-middle"><CheckIcon className="text-success" /></div>
          <button 
            onClick={() => setSelectedSnapshot({ type: 'Last Valid Confirmation', record: item.lastValidTxt, date: formatDate(item.lastValid) })}
            className="timeline-end timeline-box text-xs hover:bg-base-200 transition-colors cursor-pointer text-left"
          >
            <span className="block font-bold opacity-50 uppercase text-[9px]">Last Valid Check</span>
            {formatDate(item.lastValid)}
          </button>
          {isBroken && <hr className="bg-error" />}
        </li>

        {isBroken && (
          <li>
            <hr className="bg-error" />
            <div className="timeline-middle"><AlertIcon className="text-error" /></div>
            <button 
              onClick={() => setSelectedSnapshot({ type: 'Failure Snapshot', record: item.brokenTxt || 'N/A', date: formatDate(item.brokenAt) })}
              className="timeline-start timeline-box text-xs hover:bg-base-200 transition-colors cursor-pointer text-left border-error/30"
            >
              <span className="block font-bold text-error uppercase text-[9px]">Proof Broken At</span>
              {formatDate(item.brokenAt)}
            </button>
          </li>
        )}
      </ul>
    )
  }

  return (
    <section className="w-full max-w-3xl mx-auto space-y-8">
      <div className="text-left">
        <h2 className="text-2xl font-black text-neutral">Detailed logs</h2>
        <p className="text-sm opacity-50 mt-1">Click any event to view the DNS snapshot recorded at that time.</p>
      </div>

      <div className="grid gap-6">
        {timelineItems.map((item) => (
          <div key={item.id} className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">{item.integration}</h3>
                <div className={`badge badge-sm font-bold ${item.status === 'valid' ? 'badge-success' : item.status === 'broken' ? 'badge-error' : 'badge-ghost'} badge-outline`}>
                  {item.status}
                </div>
              </div>
              <div className="flex justify-center py-4">
                {renderTimeline(item)}
              </div>
            </div>
          </div>
        ))}
        {timelineItems.length === 0 && (
          <div className="text-center py-8 opacity-50">No scan data yet. Trigger a scan from the dashboard.</div>
        )}
      </div>

      {selectedSnapshot && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card bg-base-100 border border-base-300 shadow-2xl w-full max-w-md">
            <div className="card-body p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-neutral">{selectedSnapshot.type}</h4>
                  <p className="text-[10px] opacity-50 uppercase font-bold mt-1">{selectedSnapshot.date}</p>
                </div>
                <button onClick={() => setSelectedSnapshot(null)} className="btn btn-ghost btn-xs btn-circle">✕</button>
              </div>
              <div className="mt-4 p-4 bg-base-200 rounded-lg border border-base-300">
                <p className="text-[9px] font-bold opacity-40 uppercase mb-2">TXT Record Content</p>
                <code className="text-xs font-mono break-all text-neutral">{selectedSnapshot.record || 'N/A'}</code>
              </div>
              <button onClick={() => setSelectedSnapshot(null)} className="btn btn-neutral btn-sm mt-4 w-full">
                Close Snapshot
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

const CheckIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`h-5 w-5 ${className}`}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
  </svg>
)

const AlertIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`h-5 w-5 ${className}`}>
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
  </svg>
)

export default TimelinePlaceholder
