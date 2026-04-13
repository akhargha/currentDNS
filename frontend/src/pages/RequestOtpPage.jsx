import AuthCardLayout from '../components/layout/AuthCardLayout'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import OtpRequestFormPlaceholder from '../components/forms/OtpRequestFormPlaceholder'
import { useAuth } from '../context/AuthContext'

function RequestOtpPage() {
  const { requestOtp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState(location.state?.email || '')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleRequestOtp = async () => {
    try {
      setLoading(true)
      setError('')
      await requestOtp(email)
      setMessage('OTP sent. Check your inbox.')
      navigate('/auth/verify-otp', { state: { email } })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] py-12">
      <AuthCardLayout
        title="Sign In with OTP"
        description="Enter your account email and we will send you a one-time password."
      >
        <OtpRequestFormPlaceholder
          email={email}
          onEmailChange={setEmail}
          onSubmit={handleRequestOtp}
          loading={loading}
          message={message}
          error={error}
        />
      </AuthCardLayout>
    </section>
  )
}

export default RequestOtpPage
