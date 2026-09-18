const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const payload = await response.json().catch(() => ({}))

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || 'Unable to complete that request.')
  }

  return payload
}

export const api = {
  getDemoUser: () => request('/users/demo', { method: 'POST' }),
  getProblems: (params) => request(`/problems?${new URLSearchParams(params)}`),
  getProblem: (id) => request(`/problems/${id}`),
  getAttempts: (userId, params = {}) => request(`/attempts/${userId}?${new URLSearchParams(params)}`),
  createAttempt: (attempt) => request('/attempts', { method: 'POST', body: JSON.stringify(attempt) }),
}
