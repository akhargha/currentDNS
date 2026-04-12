function AuthCardLayout({ title, description, children }) {
  return (
    <section className="mx-auto max-w-2xl">
      <div className="card bg-base-100 shadow-sm border border-base-300">
        <div className="card-body gap-4">
          <h2 className="card-title">{title}</h2>
          <p className="text-sm opacity-80">{description}</p>
          {children}
        </div>
      </div>
    </section>
  )
}

export default AuthCardLayout
