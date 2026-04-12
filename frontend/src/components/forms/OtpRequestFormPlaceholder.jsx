function OtpRequestFormPlaceholder() {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Request OTP Placeholder</h3>
      <label className="form-control w-full">
        <span className="label-text">Account email</span>
        <input
          type="email"
          placeholder="you@domain.com"
          className="input input-bordered w-full"
          readOnly
        />
      </label>
      <button className="btn btn-primary" type="button">
        Send OTP Email
      </button>
      <p className="text-sm opacity-80">Placeholder: show success/error state for OTP request.</p>
    </div>
  )
}

export default OtpRequestFormPlaceholder
