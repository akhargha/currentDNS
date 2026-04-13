import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { api } from '../../lib/apiClient'

function OtpVerifyFormPlaceholder() {
  const [params] = useSearchParams()
  const email = params.get('email') || ''
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleVerify() {
    setError('')
    if (!code) { setError('Enter the 6-digit code.'); return }
    setLoading(true)
    try {
      const res = await api.post('/api/auth/verify-otp', { email, code })
      login(res.token, { id: res.user_id, email: res.email, domain: res.domain })
      navigate('/dashboard')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    try {
      await api.post('/api/auth/request-otp', { email })
    } catch { /* ignore */ }
  }

  return (
    <div className="w-full space-y-6">
      
      <div className="form-control w-full text-left">
        <label className="label py-1">
          <span className="label-text font-bold uppercase text-[10px] opacity-50 tracking-widest">
            6-Digit OTP Code
          </span>
        </label>
        <input 
          type="text" 
          placeholder="123456" 
          className="input input-bordered w-full font-mono text-center text-xl tracking-[0.3em] focus:border-neutral"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
        />
        <label className="label">
          <span className="label-text-alt opacity-40">Enter the code sent to {email || 'your email'}.</span>
        </label>
      </div>

      {error && (
        <div className="alert alert-error text-xs py-2">
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <button className="btn btn-neutral w-full" type="button" onClick={handleVerify} disabled={loading}>
          {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Verify and Sign In'}
        </button>
        
        <button className="btn btn-ghost btn-sm text-xs opacity-60 hover:opacity-100" type="button" onClick={handleResend}>
          Resend OTP
        </button>
      </div>
    </div>
  )
}

export default OtpVerifyFormPlaceholder
