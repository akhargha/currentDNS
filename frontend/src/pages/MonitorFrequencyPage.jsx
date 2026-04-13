import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FrequencySelectorPlaceholder from '../components/forms/FrequencySelectorPlaceholder'
import { apiRequest } from '../lib/apiClient'

function MonitorFrequencyPage() {
  const navigate = useNavigate()
  const pendingSignup = JSON.parse(sessionStorage.getItem('pendingSignup') || 'null')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSaveFrequency = async (intervalMinutes) => {
    if (!pendingSignup?.domainId) {
      setError('No pending signup found.')
      return
    }
    try {
      setSaving(true)
      setError('')
      await apiRequest('/signup/set-monitoring-frequency', {
        method: 'POST',
        body: { domain_id: pendingSignup.domainId, interval_minutes: intervalMinutes },
      })
      navigate('/auth/request-otp', { state: { email: pendingSignup.email } })
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    /* Centers everything vertically and horizontally */
    <section className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div className="w-full max-w-4xl space-y-8">

        {/* The Wide Slider Card */}
        <FrequencySelectorPlaceholder onSave={handleSaveFrequency} loading={saving} />
        {error ? <div className="alert alert-error"><span>{error}</span></div> : null}

      </div>
    </section>
  )
}

export default MonitorFrequencyPage