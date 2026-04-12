import { Link } from 'react-router-dom'
import FrequencySelectorPlaceholder from '../components/forms/FrequencySelectorPlaceholder'

function MonitorFrequencyPage() {
  return (
    <section className="space-y-4">
      <h2 className="text-3xl font-bold">Set Monitoring Frequency</h2>
      <p className="opacity-80">Choose an interval from 6 hours to 1 month.</p>
      <FrequencySelectorPlaceholder />
      <Link className="btn btn-primary" to="/dashboard">
        Continue to Dashboard
      </Link>
    </section>
  )
}

export default MonitorFrequencyPage
