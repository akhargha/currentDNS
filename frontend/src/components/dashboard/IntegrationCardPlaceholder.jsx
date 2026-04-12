function IntegrationCardPlaceholder({ integration }) {
  return (
    <article className="card bg-base-100 border border-base-300">
      <div className="card-body">
        <div className="flex items-center justify-between gap-2">
          <h3 className="card-title">{integration.name}</h3>
          <span className="badge badge-success">Green Check Placeholder</span>
        </div>
        <p className="text-sm opacity-80">{integration.description}</p>
        <div className="rounded-box bg-base-200 p-3">
          <p className="text-xs uppercase opacity-70">TXT Lookup Target</p>
          <p className="font-mono text-sm">{integration.lookupHost}</p>
          <p className="text-xs opacity-70 mt-2">Expected pattern</p>
          <p className="font-mono text-sm">{integration.matchPattern}</p>
        </div>
        <div className="flex gap-2">
          <span className="badge badge-info">new proof found</span>
          <span className="badge badge-warning">proof missing</span>
        </div>
      </div>
    </article>
  )
}

export default IntegrationCardPlaceholder
