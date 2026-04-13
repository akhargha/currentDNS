import { Link } from 'react-router-dom'
import { useState } from 'react'
import VerificationStatusPlaceholder from '../components/verification/VerificationStatusPlaceholder'
import { apiRequest } from '../lib/apiClient'

function CheckVerificationPage() {
  const pendingSignup = JSON.parse(sessionStorage.getItem('pendingSignup') || 'null')
  const [verificationState, setVerificationState] = useState('pending')
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const checkVerification = async () => {
    if (!pendingSignup?.domainId) {
      setError('No pending signup found.')
      return
    }
    try {
      setLoading(true)
      setError('')
      const response = await apiRequest('/signup/check-dns-verification', {
        method: 'POST',
        body: { domain_id: pendingSignup.domainId },
      })
      setRecords(response.txt_records || [])
      setVerificationState(response.verified ? 'verified' : 'failed')
    } catch (err) {
      setError(err.message)
      setVerificationState('failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    /* Centers the card vertically and horizontally */
    <section className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-4xl space-y-6">
        
        {/* The status card we updated previously */}
        <VerificationStatusPlaceholder
          verificationState={verificationState}
          onCheck={checkVerification}
          loading={loading}
          records={records}
        />
        {error ? <div className="alert alert-error"><span>{error}</span></div> : null}
        
        <div className="flex justify-end">
          {/* Using btn-neutral to stay consistent with your theme */}
          <Link
            className={`btn btn-neutral px-10 ${verificationState !== 'verified' ? 'btn-disabled' : ''}`}
            to="/signup/monitor-frequency"
          >
            Continue if Verified
          </Link>
        </div>

      </div>
    </section>
  )
}

export default CheckVerificationPage