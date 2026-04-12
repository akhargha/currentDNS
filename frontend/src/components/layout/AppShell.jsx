import { Link } from 'react-router-dom'

function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <header className="navbar bg-base-100 shadow-sm px-6 border-b border-base-300">
        <div className="navbar-start">
          {/* Brand Name - This acts as the "Home" link */}
          <Link to="/" className="btn btn-ghost text-xl font-bold tracking-tight">
            DNS Monitor
          </Link>
        </div>

        {/* navbar-center is empty now to keep the clean look, 
          but the div is kept to maintain the spacing logic of the DaisyUI layout 
        */}
        <div className="navbar-center hidden lg:flex"></div>

        <div className="navbar-end gap-2">
          {/* Primary Action Buttons */}
          <Link to="/auth/request-otp" className="btn btn-ghost btn-sm">
            Sign In
          </Link>
          <Link to="/signup" className="btn btn-primary btn-sm">
            Get Started
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        {children}
      </main>
    </div>
  )
}

export default AppShell