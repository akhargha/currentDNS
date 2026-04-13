const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

function getHeaders(token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: getHeaders(token),
    body: body ? JSON.stringify(body) : undefined,
  })

  if (!response.ok) {
    let detail = 'Request failed'
    try {
      const payload = await response.json()
      detail = payload.detail || payload.message || detail
    } catch {
      detail = response.statusText || detail
    }
    throw new Error(detail)
  }

  if (response.status === 204) {
    return null
  }
  return response.json()
}

export { API_BASE_URL }
