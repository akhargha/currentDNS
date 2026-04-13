import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import FrequencySelectorPlaceholder from '../components/forms/FrequencySelectorPlaceholder'
import { api } from '../lib/apiClient'

function MonitorFrequencyPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const userId = params.get('user_id')
  const [loading, setLoading] = useState(false)

  async function handleSave(frequency) {
    if (!userId) return
    setLoading(true)
    try {
      await api.post('/api/signup/set-frequency', { user_id: userId, frequency })
      navigate('/auth/request-otp')
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div className="w-full max-w-4xl space-y-8">

        <FrequencySelectorPlaceholder onSave={handleSave} loading={loading} />

        <p className="text-sm opacity-50">
          After saving, you'll be redirected to sign in with your email.
        </p>

      </div>
    </section>
  )
}

export default MonitorFrequencyPage
