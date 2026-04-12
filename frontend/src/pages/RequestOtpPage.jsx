import AuthCardLayout from '../components/layout/AuthCardLayout'
import OtpRequestFormPlaceholder from '../components/forms/OtpRequestFormPlaceholder'

function RequestOtpPage() {
  return (
    <AuthCardLayout
      title="Request OTP"
      description="Enter your email to receive a one-time login code."
    >
      <OtpRequestFormPlaceholder />
    </AuthCardLayout>
  )
}

export default RequestOtpPage
