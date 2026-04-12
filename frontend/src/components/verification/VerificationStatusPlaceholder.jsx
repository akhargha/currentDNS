const states = [
  { label: 'Pending', description: 'Awaiting DNS propagation / record check.' },
  { label: 'Verified', description: 'Required TXT token found, signup may continue.' },
  { label: 'Failed', description: 'TXT token missing or incorrect.' },
]

function VerificationStatusPlaceholder() {
  return (
    <section className="card bg-base-100 border border-base-300">
      <div className="card-body">
        <h3 className="card-title">Verification Status Placeholder</h3>
        <div className="space-y-2">
          {states.map((state) => (
            <div key={state.label} className="rounded-box border p-3">
              <p className="font-medium">{state.label}</p>
              <p className="text-sm opacity-80">{state.description}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button className="btn btn-primary" type="button">
            I Have Added the TXT Record
          </button>
          <button className="btn btn-outline" type="button">
            Re-check DNS Verification
          </button>
        </div>
      </div>
    </section>
  )
}

export default VerificationStatusPlaceholder
