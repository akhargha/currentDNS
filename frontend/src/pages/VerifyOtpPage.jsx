import AuthCardLayout from '../components/layout/AuthCardLayout'
import OtpVerifyFormPlaceholder from '../components/forms/OtpVerifyFormPlaceholder'

function VerifyOtpPage() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] py-12">
      <AuthCardLayout
        title="Verify OTP"
        description="Enter the 6-digit code sent to your monitor email to continue."
      >
        <OtpVerifyFormPlaceholder />
      </AuthCardLayout>
    </section>
  )
}

export default VerifyOtpPage
