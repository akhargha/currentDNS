import { Link } from 'react-router-dom'
import VerificationStatusPlaceholder from '../components/verification/VerificationStatusPlaceholder'

function CheckVerificationPage() {
  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-bold">Check DNS Verification</h2>
      <p className="opacity-80">
        Placeholder: query DNS and confirm expected TXT token exists.
      </p>
      {/* TODO: Call backend endpoint to verify TXT token on button click. */}
      <VerificationStatusPlaceholder />
      <Link className="btn btn-primary" to="/signup/monitor-frequency">
        Continue if Verified
      </Link>
    </section>
  )
}

export default CheckVerificationPage
