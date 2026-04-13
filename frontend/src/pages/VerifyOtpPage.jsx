import AuthCardLayout from '../components/layout/AuthCardLayout'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import OtpVerifyFormPlaceholder from '../components/forms/OtpVerifyFormPlaceholder'
import { useAuth } from '../context/AuthContext'

function VerifyOtpPage() {
  const { verifyOtp, requestOtp } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [email] = useState(location.state?.email || localStorage.getItem('currentdns_email') || '')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleVerify = async () => {
    try {
      setLoading(true)
      setError('')
      await verifyOtp(email, code)
      setMessage('Verified. Redirecting...')
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!email) {
      setError('Missing email for OTP resend.')
      return
    }
    try {
      await requestOtp(email)
      setMessage('OTP resent.')
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    /* Centers the auth card vertically and horizontally */
    <section className="flex flex-col items-center justify-center min-h-[80vh] py-12">
      <AuthCardLayout
        title="Verify OTP"
        description="Enter the 6-digit code sent to your monitor email to continue."
      >
        <OtpVerifyFormPlaceholder
          code={code}
          onCodeChange={setCode}
          onSubmit={handleVerify}
          onResend={handleResend}
          loading={loading}
          message={message}
          error={error}
        />
      </AuthCardLayout>
    </section>
  )
}

export default VerifyOtpPage