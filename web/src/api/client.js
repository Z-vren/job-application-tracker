const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

async function handleResponse(response) {
  const contentType = response.headers.get('content-type')
  const isJson = contentType && contentType.includes('application/json')
  const data = isJson ? await response.json() : null

  if (!response.ok) {
    const error = new Error(data?.message || 'Request failed')
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  return handleResponse(response)
}

export const api = {
  async login(credentials) {
    return request('/auth/login', { method: 'POST', body: credentials })
  },
  async register(values) {
    return request('/auth/register', { method: 'POST', body: values })
  },
  async getApplications(token) {
    return request('/applications', { token })
  },
  async createApplication(token, values) {
    return request('/applications', { method: 'POST', token, body: values })
  },
  async updateApplication(token, id, values) {
    return request(`/applications/${id}`, { method: 'PUT', token, body: values })
  },
  async deleteApplication(token, id) {
    return request(`/applications/${id}`, { method: 'DELETE', token })
  },
}

export { API_BASE_URL }

