function OtpRequestFormPlaceholder() {
  return (
    <div className="flex justify-center">
      <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-full max-w-md border p-6 shadow-sm">
        <legend className="fieldset-legend text-base font-bold">Sign In</legend>

        <div className="text-left">
          <label className="label">Account email</label>
          <input 
            type="email" 
            className="input w-full" 
            placeholder="you@domain.com" 
          />
          
          <div className="mt-6 flex flex-col gap-4">
            <button className="btn btn-neutral w-full" type="button">
              Send OTP Email
            </button>
            
            {/* Informational area for status messages */}
            <div className="alert bg-base-200 border-none text-xs py-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>We'll send a one-time password to your inbox.</span>
            </div>
          </div>
        </div>
      </fieldset>
    </div>
  )
}

export default OtpRequestFormPlaceholder