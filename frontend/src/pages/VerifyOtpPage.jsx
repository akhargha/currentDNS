import AuthCardLayout from '../components/layout/AuthCardLayout'
import OtpVerifyFormPlaceholder from '../components/forms/OtpVerifyFormPlaceholder'

function VerifyOtpPage() {
  return (
    <AuthCardLayout
      title="Verify OTP"
      description="Enter the code sent to your monitor email and continue to dashboard."
    >
      <OtpVerifyFormPlaceholder />
    </AuthCardLayout>
  )
}

export default VerifyOtpPage
