import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'

function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const data = await api.login({ email, password })
      login(data)
      const redirectTo = location.state?.from?.pathname || '/applications'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.data?.message || 'Login failed. Please check your details.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page narrow">
      <h1>Log in</h1>
      <p className="muted">Access your application tracker.</p>

      <form className="card" onSubmit={onSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error ? <div className="error">{error}</div> : null}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Login'}
        </button>
      </form>

      <p className="muted">
        Need an account? <Link to="/register">Register</Link>
      </p>
    </div>
  )
}

export default Login

