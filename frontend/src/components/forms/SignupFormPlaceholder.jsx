function SignupFormPlaceholder({
  email,
  domain,
  onEmailChange,
  onDomainChange,
  onSubmit,
  loading,
  error,
}) {
  return (
    <div className="flex justify-center">
      <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-full max-w-md border p-6 shadow-sm">

        {/* Email Field */}
        <label className="label">Email address</label>
        <input 
          type="email" 
          className="input w-full" 
          placeholder="abc@example.com"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
        />

        {/* Domain Field */}
        <label className="label mt-2">Domain to monitor</label>
        <input 
          type="text" 
          className="input w-full" 
          placeholder="example.com"
          value={domain}
          onChange={(event) => onDomainChange(event.target.value)}
        />

        {/* Info Alert */}
        <div className="alert mt-4 text-xs py-2">
          <span>Note: Email domain should match the monitored domain.</span>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-3">
          <button className="btn btn-neutral w-full" type="button" onClick={onSubmit} disabled={loading}>
            {loading ? 'Checking...' : 'Continue'}
          </button>
        </div>
        {error ? <p className="text-sm text-error mt-2">{error}</p> : null}
      </fieldset>
    </div>
  )
}

export default SignupFormPlaceholder