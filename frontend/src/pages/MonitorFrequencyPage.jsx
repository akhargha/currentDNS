import { Link } from 'react-router-dom'
import FrequencySelectorPlaceholder from '../components/forms/FrequencySelectorPlaceholder'

function MonitorFrequencyPage() {
  return (
    /* Centers everything vertically and horizontally */
    <section className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div className="w-full max-w-4xl space-y-8">

        {/* The Wide Slider Card */}
        <FrequencySelectorPlaceholder />

        {/* Action Link */}
        <div className="flex justify-center">
          <Link className="btn btn-neutral px-12" to="/dashboard">
            Continue to Dashboard
          </Link>
        </div>

      </div>
    </section>
  )
}

export default MonitorFrequencyPage