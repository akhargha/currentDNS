import { useSearchParams, useNavigate } from 'react-router-dom'
import DnsInstructionPlaceholder from '../components/verification/DnsInstructionPlaceholder'

function DnsVerificationPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const userId = params.get('user_id')
  const domain = params.get('domain')
  const token = params.get('token')

  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-4xl space-y-8 px-4">
        
        <DnsInstructionPlaceholder domain={domain} token={token} userId={userId} />

        <div className="flex justify-center">
          <button
            className="btn btn-neutral px-12"
            onClick={() => navigate(`/signup/check-verification?user_id=${userId}`)}
          >
            I Have Added the TXT Record
          </button>
        </div>
        
      </div>
    </section>
  )
}

export default DnsVerificationPage
