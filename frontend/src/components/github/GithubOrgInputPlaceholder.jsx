function GithubOrgInputPlaceholder() {
  return (
    <section className="card bg-base-100 border border-base-300">
      <div className="card-body">
        <h3 className="card-title">GitHub Organization Input Placeholder</h3>
        <label className="form-control w-full">
          <span className="label-text">Organization Name</span>
          <input type="text" className="input input-bordered w-full" placeholder="my-org" readOnly />
        </label>
        <p className="text-sm opacity-80">
          Placeholder lookup host: <code>_gh-&lt;organizationname&gt;-o.domain.com</code>
        </p>
        <button className="btn btn-primary w-fit" type="button">
          Save Organization
        </button>
      </div>
    </section>
  )
}

export default GithubOrgInputPlaceholder
