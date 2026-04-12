import { Link } from 'react-router-dom'
import DnsInstructionPlaceholder from '../components/verification/DnsInstructionPlaceholder'

function DnsVerificationPage() {
  return (
    // Centered container with a much larger maximum width
    <section className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="w-full max-w-4xl space-y-8 px-4">
        
        {/* The instruction block will now take up more horizontal space */}
        <DnsInstructionPlaceholder />

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