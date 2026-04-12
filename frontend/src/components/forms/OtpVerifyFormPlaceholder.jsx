function OtpVerifyFormPlaceholder() {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Verify OTP Placeholder</h3>
      <label className="form-control w-full">
        <span className="label-text">6-digit OTP code</span>
        <input type="text" placeholder="123456" className="input input-bordered w-full" readOnly />
      </label>
      <div className="flex gap-2">
        <button className="btn btn-primary" type="button">
          Verify and Sign In
        </button>
        <button className="btn btn-ghost" type="button">
          Resend OTP
        </button>
      </div>
      <p className="text-sm opacity-80">Placeholder: redirect to dashboard on successful OTP.</p>
    </div>
  )
}

export default OtpVerifyFormPlaceholder
