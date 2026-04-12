import { timelineMock } from '../../mock/timelineMock'

function TimelinePlaceholder() {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Proof Change Timeline Placeholder</h2>
      <div className="space-y-3">
        {timelineMock.map((item) => (
          <article key={item.id} className="card bg-base-100 border border-base-300">
            <div className="card-body">
              <div className="flex items-center justify-between gap-2">
                <h3 className="card-title">{item.integration}</h3>
                <span className="badge badge-outline">{item.status}</span>
              </div>
              <div className="grid gap-2 text-sm md:grid-cols-2">
                <p>
                  <strong>First seen:</strong> {item.firstSeen}
                </p>
                <p>
                  <strong>Latest valid:</strong> {item.lastValid}
                </p>
                <p>
                  <strong>Broken at:</strong> {item.brokenAt || 'N/A'}
                </p>
                <p>
                  <strong>TXT snapshot:</strong> <code>{item.txtRecord}</code>
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default TimelinePlaceholder
