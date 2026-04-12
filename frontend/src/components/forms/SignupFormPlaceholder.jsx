function SignupFormPlaceholder() {
  return (
    <div className="flex justify-center">
      <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-full max-w-md border p-6 shadow-sm">

        {/* Email Field */}
        <label className="label">Email address</label>
        <input 
          type="email" 
          className="input w-full" 
          placeholder="abc@example.com" 
        />

        {/* Domain Field */}
        <label className="label mt-2">Domain to monitor</label>
        <input 
          type="text" 
          className="input w-full" 
          placeholder="example.com" 
        />

        {/* Info Alert */}
        <div className="alert mt-4 text-xs py-2">
          <span>Note: Email domain should match the monitored domain.</span>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <button className="btn btn-neutral w-full" type="button">
            Continue
          </button>
          <button className="btn btn-ghost btn-sm" type="button">
            Use alternate email with DNS verification
          </button>
        </div>
      </fieldset>
    </div>
  )
}

export default SignupFormPlaceholder