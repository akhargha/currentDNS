import { Copy } from 'lucide-react'; // Optional: if you have lucide-react, or use the SVG below

function DnsInstructionPlaceholder() {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Minimal feedback - you could replace this with a toast
    console.log("Copied:", text);
  };

  const CopyButton = ({ text }) => (
    <button 
      onClick={() => copyToClipboard(text)}
      className="btn btn-ghost btn-xs btn-square ml-2 opacity-50 hover:opacity-100"
      title="Copy to clipboard"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
    </button>
  );

  return (
    <section className="card bg-base-100 border border-base-300 w-full shadow-sm">
      <div className="card-body p-8 gap-8">
        {/* Header Section */}
        <div>
          <h3 className="card-title text-2xl font-bold mb-2">DNS TXT Verification</h3>
          <p className="text-sm opacity-70">
            Please add the following TXT record to your DNS configuration to verify your domain ownership.
          </p>
        </div>

        {/* The Stats Layout - Looking like values, not fields */}
        <div className="stats stats-vertical lg:stats-horizontal border border-base-300 bg-base-200 w-full">
          <div className="stat px-6 py-4">
            <div className="stat-title text-xs uppercase tracking-widest font-bold">TXT Host</div>
            <div className="stat-value text-lg flex items-center font-mono">
              _verifydns.domain.com
              <CopyButton text="_verifydns.domain.com" />
            </div>
          </div>

          <div className="stat px-6 py-4">
            <div className="stat-title text-xs uppercase tracking-widest font-bold">TXT Value</div>
            <div className="stat-value text-lg flex items-center font-mono">
              random-token-12345
              <CopyButton text="random-token-12345" />
            </div>
          </div>
        </div>

        {/* Alert Section */}
        <div className="alert bg-base-200 border-none text-sm italic opacity-80">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Propagation may take a few minutes. Ensure the TXT record is visible globally.</span>
        </div>
      </div>
    </section>
  )
}

export default DnsInstructionPlaceholder