import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import DnsInstructionPlaceholder from '../components/verification/DnsInstructionPlaceholder'
import { apiRequest } from '../lib/apiClient'

function DnsVerificationPage() {
  const pendingSignup = JSON.parse(sessionStorage.getItem('pendingSignup') || 'null')
  const [challenge, setChallenge] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadChallenge = async () => {
      if (!pendingSignup?.domainId) {
        setError('No pending signup context found.')
        setLoading(false)
        return
      }
      try {
        const response = await apiRequest('/signup/send-dns-verification-email', {
          method: 'POST',
          body: { domain_id: pendingSignup.domainId },
        })
        setChallenge(response)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadChallenge()
  }, [pendingSignup?.domainId])

  return (
    // Centered container with a much larger maximum width
    <section className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-4xl space-y-8 px-4">
        
        {/* The instruction block will now take up more horizontal space */}
        {!loading && challenge ? (
          <DnsInstructionPlaceholder
            verifyHost={challenge.verify_host}
            expectedToken={challenge.expected_token}
            statusMessage={challenge.message}
          />
        ) : null}
        {loading ? <div className="alert"><span>Sending verification instructions...</span></div> : null}
        {error ? <div className="alert alert-error"><span>{error}</span></div> : null}

        <div className="flex justify-center">
          {/* Button kept at a reasonable size so it isn't too wide on desktops */}
          <Link className="btn btn-neutral px-12" to="/signup/check-verification">
            I Have Added the TXT Record
          </Link>
        </div>
        
      </div>
    </section>
  )
}

export default DnsVerificationPage