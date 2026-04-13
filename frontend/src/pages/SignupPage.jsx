import SignupFormPlaceholder from '../components/forms/SignupFormPlaceholder'

function SignupPage() {
  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div className="max-w-md w-full space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Sign Up</h2>
          <p className="opacity-80 mt-2">
            Enter the email you want to receive updates on and the website you want to monitor.
          </p>
        </div>

        <SignupFormPlaceholder />
      </div>
    </section>
  )
}

export default SignupPage
