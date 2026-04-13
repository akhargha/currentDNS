/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import { apiRequest } from '../lib/apiClient'

const AuthContext = createContext(null)
const TOKEN_KEY = 'currentdns_token'
const EMAIL_KEY = 'currentdns_email'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY))
  const [email, setEmail] = useState(localStorage.getItem(EMAIL_KEY))
  const [userId, setUserId] = useState(null)

  const isAuthenticated = Boolean(token)

  const requestOtp = async (emailValue) => apiRequest('/auth/request-otp', { method: 'POST', body: { email: emailValue } })

  const verifyOtp = async (emailValue, code) => {
    const response = await apiRequest('/auth/verify-otp', {
      method: 'POST',
      body: { email: emailValue, code },
    })
    setToken(response.token)
    setEmail(response.email)
    setUserId(response.user_id)
    localStorage.setItem(TOKEN_KEY, response.token)
    localStorage.setItem(EMAIL_KEY, response.email)
    return response
  }

  const logout = () => {
    setToken(null)
    setEmail(null)
    setUserId(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(EMAIL_KEY)
  }

  const value = useMemo(
    () => ({
      token,
      email,
      userId,
      isAuthenticated,
      requestOtp,
      verifyOtp,
      logout,
    }),
    [token, email, userId, isAuthenticated],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
