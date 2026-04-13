import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'

function AppShell({ children }) {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <header className="navbar bg-base-100 shadow-sm px-6 border-b border-base-300">
        <div className="navbar-start">
          <Link to="/" className="btn btn-ghost text-xl font-bold tracking-tight">
            DNS Monitor
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex"></div>

        <div className="navbar-end gap-2">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="btn btn-ghost btn-sm">
                Dashboard
              </Link>
              <Link to="/settings/monitoring" className="btn btn-ghost btn-sm">
                Settings
              </Link>
              <button onClick={handleLogout} className="btn btn-outline btn-sm">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/auth/request-otp" className="btn btn-ghost btn-sm">
                Sign In
              </Link>
              <Link to="/signup" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        {children}
      </main>
    </div>
  )
}

export default AppShell
