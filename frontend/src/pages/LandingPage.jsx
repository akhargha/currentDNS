import { Link } from 'react-router-dom'

function LandingPage() {
  return (
    <>
    <section className="hero rounded-box bg-base-100 border border-base-300">
      <div className="hero-content py-12 text-center">
        <div className="max-w-2xl space-y-4">
          <h2 className="text-4xl font-bold">DNS Identity Monitor</h2>
          <p className="opacity-80">
            Placeholder landing page for signup, OTP login, and dashboard entry.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link className="btn btn-primary" to="/signup">
              Start Signup
            </Link>
            <Link className="btn btn-outline" to="/auth/request-otp">
              Sign In with OTP
            </Link>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}

export default LandingPage
