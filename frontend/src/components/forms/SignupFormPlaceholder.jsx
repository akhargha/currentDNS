import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/apiClient'

function SignupFormPlaceholder() {
  const [email, setEmail] = useState('')
  const [domain, setDomain] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit() {
    setError('')
    if (!email || !domain) { setError('Both fields are required.'); return }
    setLoading(true)
    try {
      const res = await api.post('/api/signup', { email, domain })
      if (res.email_matches_domain) {
        navigate(`/signup/monitor-frequency?user_id=${res.user_id}`)
      } else {
        navigate(`/signup/dns-verification?user_id=${res.user_id}&domain=${domain}&token=${res.verification_token}`)
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleAlternate() {
    setError('')
    if (!email || !domain) { setError('Both fields are required.'); return }
    setLoading(true)
    try {
      const res = await api.post('/api/signup', { email, domain })
      navigate(`/signup/dns-verification?user_id=${res.user_id}&domain=${domain}&token=${res.verification_token}`)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center">
      <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-full max-w-md border p-6 shadow-sm">

        <label className="label">Email address</label>
        <input 
          type="email" 
          className="input w-full" 
          placeholder="abc@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="label mt-2">Domain to monitor</label>
        <input 
          type="text" 
          className="input w-full" 
          placeholder="example.com"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />

        <div className="alert mt-4 text-xs py-2">
          <span>Note: Email domain should match the monitored domain.</span>
        </div>

        {error && (
          <div className="alert alert-error mt-2 text-xs py-2">
            <span>{error}</span>
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3">
          <button className="btn btn-neutral w-full" type="button" onClick={handleSubmit} disabled={loading}>
            {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Continue'}
          </button>
          <button className="btn btn-ghost btn-sm" type="button" onClick={handleAlternate} disabled={loading}>
            Use alternate email with DNS verification
          </button>
        </div>
      </fieldset>
    </div>
  )
}

export default SignupFormPlaceholder
