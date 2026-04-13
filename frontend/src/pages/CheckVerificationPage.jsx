import { useSearchParams, useNavigate } from 'react-router-dom'
import VerificationStatusPlaceholder from '../components/verification/VerificationStatusPlaceholder'

function CheckVerificationPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const userId = params.get('user_id')

  function handleVerified() {
    navigate(`/signup/monitor-frequency?user_id=${userId}`)
  }

  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-4xl space-y-6">
        
        <VerificationStatusPlaceholder userId={userId} onVerified={handleVerified} />
        
      </div>
    </section>
  )
}

export default CheckVerificationPage
