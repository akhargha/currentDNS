import { useState } from 'react';
import { timelineMock } from '../../mock/timelineMock';

function TimelinePlaceholder() {
  // State to track which snapshot is being viewed
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);

  const renderTimeline = (item) => {
    const isBroken = item.status === 'broken';
    const neverSeen = !item.firstSeen;

    if (neverSeen) {
      return (
        <div className="p-4 bg-base-200 rounded-lg border border-dashed border-base-300 text-center">
          <p className="text-xs opacity-50 uppercase tracking-widest font-bold">Status: Unverified</p>
          <p className="text-sm mt-1 text-error">No DNS records have been detected for this integration yet.</p>
        </div>
      );
    }

    return (
      <ul className="timeline timeline-vertical timeline-compact">
        {/* EVENT 1: DISCOVERY */}
        <li>
          <div className="timeline-middle">
            <CheckIcon className="text-success" />
          </div>
          <button 
            onClick={() => setSelectedSnapshot({ type: 'First Seen', record: item.txtRecord, date: item.firstSeen })}
            className="timeline-start timeline-box text-xs hover:bg-base-200 transition-colors cursor-pointer text-left"
          >
            <span className="block font-bold opacity-50 uppercase text-[9px]">First Discovered</span>
            {item.firstSeen}
          </button>
          <hr className="bg-success" />
        </li>

        {/* EVENT 2: LAST VALID */}
        <li>
          <hr className="bg-success" />
          <div className="timeline-middle">
            <CheckIcon className="text-success" />
          </div>
          <button 
            onClick={() => setSelectedSnapshot({ type: 'Last Valid Confirmation', record: item.txtRecord, date: item.lastValid })}
            className="timeline-end timeline-box text-xs hover:bg-base-200 transition-colors cursor-pointer text-left"
          >
            <span className="block font-bold opacity-50 uppercase text-[9px]">Last Valid Check</span>
            {item.lastValid}
          </button>
          {isBroken && <hr className="bg-error" />}
        </li>

        {/* EVENT 3: BROKEN (Only shows if brokenAt exists) */}
        {isBroken && (
          <li>
            <hr className="bg-error" />
            <div className="timeline-middle">
              <AlertIcon className="text-error" />
            </div>
            <button 
              onClick={() => setSelectedSnapshot({ type: 'Failure Snapshot', record: 'randommissing-verification=tpksgarap', date: item.brokenAt })}
              className="timeline-start timeline-box text-xs hover:bg-base-200 transition-colors cursor-pointer text-left border-error/30"
            >
              <span className="block font-bold text-error uppercase text-[9px]">Proof Broken At</span>
              {item.brokenAt}
            </button>
          </li>
        )}
      </ul>
    );
  };

  return (
    <section className="w-full max-w-3xl mx-auto space-y-8">
      <div className="text-left">
        <h2 className="text-2xl font-black text-neutral">Detailed logs</h2>
        <p className="text-sm opacity-50 mt-1">Click any event to view the DNS snapshot recorded at that time.</p>
      </div>

      <div className="grid gap-6">
        {timelineMock.map((item) => (
          <div key={item.id} className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">{item.integration}</h3>
                <div className={`badge badge-sm font-bold ${item.status === 'valid' ? 'badge-success' : 'badge-error'} badge-outline`}>
                  {item.status}
                </div>
              </div>
              
              <div className="flex justify-center py-4">
                {renderTimeline(item)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SNAPSHOT VIEWER MODAL/CARD */}
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
                <code className="text-xs font-mono break-all text-neutral">{selectedSnapshot.record}</code>
              </div>
              <button onClick={() => setSelectedSnapshot(null)} className="btn btn-neutral btn-sm mt-4 w-full">
                Close Snapshot
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// Simple Inline Icons
const CheckIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`h-5 w-5 ${className}`}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
  </svg>
);

const AlertIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`h-5 w-5 ${className}`}>
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
  </svg>
);

export default TimelinePlaceholder;