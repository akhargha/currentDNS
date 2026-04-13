import { Link } from 'react-router-dom'

function DomainMatchCheckPage() {
  const pendingSignup = JSON.parse(sessionStorage.getItem('pendingSignup') || 'null')
  const domainMatched = Boolean(pendingSignup?.domainMatched)

  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-bold">Domain Match Check</h2>
      {!pendingSignup ? (
        <div className="alert alert-warning">
          <span>No signup context found. Please start from the signup page.</span>
        </div>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body">
            <h3 className="card-title">Matched Email Domain</h3>
            <p className="text-sm opacity-80">
              {domainMatched
                ? 'Email domain matches monitored domain. You can continue.'
                : 'This path is unavailable because the domains do not match.'}
            </p>
            <Link className="btn btn-primary w-fit" to="/signup/monitor-frequency" aria-disabled={!domainMatched}>
              Continue to Monitoring Setup
            </Link>
          </div>
        </div>
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body">
            <h3 className="card-title">Alternate Email Path</h3>
            <p className="text-sm opacity-80">
              {domainMatched
                ? 'You can skip this because your email already matches the domain.'
                : 'Alternate email path requires DNS TXT verification before signup completion.'}
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
