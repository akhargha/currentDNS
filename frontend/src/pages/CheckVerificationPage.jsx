import { Link } from 'react-router-dom'
import VerificationStatusPlaceholder from '../components/verification/VerificationStatusPlaceholder'

function CheckVerificationPage() {
  return (
    /* Centers the card vertically and horizontally */
    <section className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* The status card we updated previously */}
        <VerificationStatusPlaceholder />
        
        <div className="flex justify-end">
          {/* Using btn-neutral to stay consistent with your theme */}
          <Link className="btn btn-neutral px-10" to="/signup/monitor-frequency">
            Continue if Verified
          </Link>
        </div>

      </div>
    </section>
  )
}

export default CheckVerificationPage