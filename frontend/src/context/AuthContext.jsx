import { useState } from 'react'
import { AuthContext } from './authContextValue'

function loadInitialUser() {
  const saved = localStorage.getItem('cdns_user')
  const tok = localStorage.getItem('cdns_token')
  if (saved && tok) {
    try { return JSON.parse(saved) } catch { return null }
  }
  return null
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadInitialUser)
  const [token, setToken] = useState(() => localStorage.getItem('cdns_token'))
  // #region agent log
  fetch('http://127.0.0.1:7849/ingest/862d1fd4-dadb-4489-bd16-937c996fefab',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'55a164'},body:JSON.stringify({sessionId:'55a164',location:'AuthContext.jsx:AuthProvider',message:'AuthProvider mounted',data:{hasToken:!!token,hasUser:!!user},timestamp:Date.now(),runId:'post-fix',hypothesisId:'H1'})}).catch(()=>{});
  // #endregion

  function login(tokenValue, userData) {
    localStorage.setItem('cdns_token', tokenValue)
    localStorage.setItem('cdns_user', JSON.stringify(userData))
    setToken(tokenValue)
    setUser(userData)
  }

  function logout() {
    localStorage.removeItem('cdns_token')
    localStorage.removeItem('cdns_user')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
