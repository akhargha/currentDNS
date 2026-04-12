import { Link } from 'react-router-dom'

function DomainMatchCheckPage() {
  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-bold">Domain Match Check</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body">
            <h3 className="card-title">Matched Email Domain</h3>
            <p className="text-sm opacity-80">Placeholder: email domain equals monitored domain.</p>
            <Link className="btn btn-primary w-fit" to="/signup/monitor-frequency">
              Continue to Monitoring Setup
            </Link>
          </div>
        </div>
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body">
            <h3 className="card-title">Alternate Email Path</h3>
            <p className="text-sm opacity-80">
              Placeholder: require DNS TXT integration verification before completing signup.
            </p>
            <Link className="btn btn-outline w-fit" to="/signup/dns-verification">
              Start DNS Verification
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DomainMatchCheckPage
