function ScanSummaryPlaceholder() {
  return (
    <section className="card bg-base-100 border border-base-300">
      <div className="card-body">
        <h2 className="card-title">Initial Scan Summary Placeholder</h2>
        <ul className="list-disc pl-5 space-y-1 text-sm opacity-90">
          <li>Monitored domain and current monitor email.</li>
          <li>Last scan timestamp and next scheduled scan timestamp.</li>
          <li>Total integrations currently detected.</li>
          <li>Latest alert state (if any proof has broken).</li>
        </ul>
      </div>
    </section>
  )
}

export default ScanSummaryPlaceholder
