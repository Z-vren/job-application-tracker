import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)
const AUTH_STORAGE_KEY = 'job-tracker-auth'

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed?.token) {
          setToken(parsed.token)
          setUser(parsed.user || null)
        }
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    }
    setInitializing(false)
  }, [])

  const login = (authData) => {
    setToken(authData.token)
    setUser(authData.user || null)
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ token: authData.token, user: authData.user || null }),
    )
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }

  const value = useMemo(
    () => ({
      token,
      user,
      initializing,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, user, initializing],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}

