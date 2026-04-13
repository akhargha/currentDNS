function TimelinePlaceholder({ events = [] }) {
  return (
    <section className="w-full max-w-3xl mx-auto space-y-8">
      <div className="text-left">
        <h2 className="text-2xl font-black text-neutral">Detailed logs</h2>
        <p className="text-sm opacity-50 mt-1">Timeline of proof changes and TXT snapshots.</p>
      </div>

      {events.length === 0 ? (
        <div className="alert">
          <span>No timeline events yet. Run a scan to generate proof history.</span>
        </div>
      ) : null}

      <div className="grid gap-6">
        {events.map((item) => (
          <div key={item.id} className="card bg-base-100 border border-base-300 shadow-sm">
            <div className="card-body p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">{item.integration_type}</h3>
                <div className="badge badge-sm badge-outline">{item.event_type}</div>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Identity:</strong> {item.identity_key}</p>
                <p><strong>Occurred:</strong> {item.occurred_at}</p>
                <p><strong>TXT Snapshot:</strong> <code>{item.txt_value || '-'}</code></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default TimelinePlaceholder