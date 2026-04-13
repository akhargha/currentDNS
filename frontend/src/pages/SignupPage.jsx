import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SignupFormPlaceholder from '../components/forms/SignupFormPlaceholder'
import { apiRequest } from '../lib/apiClient'

function SignupPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [domain, setDomain] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleStartSignup = async () => {
    try {
      setLoading(true)
      setError('')
      const response = await apiRequest('/signup/start', {
        method: 'POST',
        body: { email, domain },
      })
      sessionStorage.setItem(
        'pendingSignup',
        JSON.stringify({
          email,
          domain,
          domainId: response.domain_id,
          domainMatched: response.domain_matched,
        }),
      )
      navigate('/signup/domain-match-check')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    // min-h-[70vh] gives it enough height to feel centered on the page
    <section className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div className="max-w-md w-full space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Sign Up</h2>
          <p className="opacity-80 mt-2">
            Enter the email you want to receive updates on and the website you want to monitor.
          </p>
        </div>

        <SignupFormPlaceholder
          email={email}
          domain={domain}
          onEmailChange={setEmail}
          onDomainChange={setDomain}
          onSubmit={handleStartSignup}
          loading={loading}
          error={error}
        />
      </div>
    </section>
  )
}

export default SignupPage