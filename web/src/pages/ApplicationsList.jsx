import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'

function ApplicationsList() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const normalizedApplications = useMemo(
    () =>
      applications.map((app) => ({
        ...app,
        id: app.id || app._id || app.applicationId,
      })),
    [applications],
  )

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await api.getApplications(token)
        setApplications(Array.isArray(data) ? data : [])
      } catch (err) {
        if (err.status === 401 || err.status === 403) {
          logout()
          navigate('/login')
          return
        }
        setError(err.data?.message || 'Failed to load applications.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [token, logout, navigate])

  const confirmAndDelete = async (id) => {
    const ok = window.confirm('Delete this application?')
    if (!ok) return
    setDeletingId(id)
    setError('')

    try {
      await api.deleteApplication(token, id)
      setApplications((prev) => prev.filter((item) => (item.id || item._id) !== id))
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        logout()
        navigate('/login')
        return
      }
      setError(err.data?.message || 'Failed to delete application.')
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (value) => {
    if (!value) return '—'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleDateString()
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Applications</h1>
          <p className="muted">Manage your job applications.</p>
        </div>
        <button onClick={() => navigate('/applications/new')}>Add application</button>
      </div>

      {loading ? <div className="info">Loading applications...</div> : null}
      {error ? <div className="error">{error}</div> : null}

      {!loading && normalizedApplications.length === 0 ? (
        <div className="card">
          <p>No applications yet.</p>
          <button onClick={() => navigate('/applications/new')}>Add your first</button>
        </div>
      ) : null}

      <div className="list">
        {normalizedApplications.map((app) => (
          <div className="list-item" key={app.id}>
            <div className="list-item__main">
              <div className="list-item__title">
                <strong>{app.company}</strong> — {app.role}
              </div>
              <div className="list-item__meta">
                <span className="pill">{app.status}</span>
                <span className="muted">Applied: {formatDate(app.appliedDate)}</span>
              </div>
            </div>
            <div className="list-item__actions">
              <button
                className="secondary"
                onClick={() =>
                  navigate(`/applications/${app.id}/edit`, { state: { application: app } })
                }
              >
                Edit
              </button>
              <button
                className="danger"
                onClick={() => confirmAndDelete(app.id)}
                disabled={deletingId === app.id}
              >
                {deletingId === app.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ApplicationsList

