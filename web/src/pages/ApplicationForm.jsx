import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { api } from '../api/client'
import { useAuth } from '../context/AuthContext'

const STATUS_OPTIONS = ['Applied', 'Interview', 'Rejected', 'Offer']

function normalizeDate(value) {
  if (!value) return ''
  return value.slice(0, 10)
}

function ApplicationForm() {
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()
  const isEdit = Boolean(id)

  const existing = location.state?.application

  const [form, setForm] = useState({
    company: '',
    role: '',
    status: 'Applied',
    appliedDate: '',
    deadline: '',
    notes: '',
  })
  const [loading, setLoading] = useState(isEdit)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const title = useMemo(() => (isEdit ? 'Edit application' : 'Add application'), [isEdit])

  useEffect(() => {
    if (!isEdit) return

    if (existing) {
      setForm({
        company: existing.company || '',
        role: existing.role || '',
        status: existing.status || 'Applied',
        appliedDate: normalizeDate(existing.appliedDate),
        deadline: normalizeDate(existing.deadline),
        notes: existing.notes || '',
      })
      setLoading(false)
      return
    }

    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const list = await api.getApplications(token)
        const match = Array.isArray(list)
          ? list.find((item) => (item.id || item._id || item.applicationId) === id)
          : null
        if (match) {
          setForm({
            company: match.company || '',
            role: match.role || '',
            status: match.status || 'Applied',
            appliedDate: normalizeDate(match.appliedDate),
            deadline: normalizeDate(match.deadline),
            notes: match.notes || '',
          })
        } else {
          setError('Application not found.')
        }
      } catch (err) {
        if (err.status === 401 || err.status === 403) {
          logout()
          navigate('/login')
          return
        }
        setError(err.data?.message || 'Failed to load application.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [isEdit, existing, id, token, logout, navigate])

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const payload = {
      ...form,
      appliedDate: form.appliedDate || null,
      deadline: form.deadline || null,
    }

    try {
      if (isEdit) {
        await api.updateApplication(token, id, payload)
      } else {
        await api.createApplication(token, payload)
      }
      navigate('/applications')
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        logout()
        navigate('/login')
        return
      }
      setError(err.data?.message || 'Could not save the application.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    const ok = window.confirm('Delete this application?')
    if (!ok) return
    setDeleteLoading(true)
    setError('')

    try {
      await api.deleteApplication(token, id)
      navigate('/applications')
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        logout()
        navigate('/login')
        return
      }
      setError(err.data?.message || 'Failed to delete application.')
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="info">Loading application...</div>
      </div>
    )
  }

  return (
    <div className="page narrow">
      <h1>{title}</h1>
      <form className="card" onSubmit={onSubmit}>
        <label>
          Company
          <input
            type="text"
            value={form.company}
            onChange={handleChange('company')}
            required
          />
        </label>
        <label>
          Role
          <input type="text" value={form.role} onChange={handleChange('role')} required />
        </label>
        <label>
          Status
          <select value={form.status} onChange={handleChange('status')}>
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label>
          Applied date
          <input
            type="date"
            value={form.appliedDate}
            onChange={handleChange('appliedDate')}
          />
        </label>
        <label>
          Deadline
          <input type="date" value={form.deadline} onChange={handleChange('deadline')} />
        </label>
        <label>
          Notes
          <textarea value={form.notes} onChange={handleChange('notes')} rows={4} />
        </label>

        {error ? <div className="error">{error}</div> : null}

        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            className="secondary"
            onClick={() => navigate('/applications')}
            disabled={submitting}
          >
            Cancel
          </button>
          {isEdit ? (
            <button
              type="button"
              className="danger"
              onClick={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? 'Deleting...' : 'Delete'}
            </button>
          ) : null}
        </div>
      </form>
    </div>
  )
}

export default ApplicationForm

