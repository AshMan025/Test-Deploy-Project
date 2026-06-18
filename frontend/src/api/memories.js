import { API_BASE_URL } from './config'

async function handleResponse(response) {
  if (!response.ok) {
    let detail = 'Something went wrong. Please try again.'
    try {
      const body = await response.json()
      if (typeof body.detail === 'string') {
        detail = body.detail
      } else if (Array.isArray(body.detail)) {
        detail = body.detail.map((item) => item.msg).join(', ')
      }
    } catch {
      // Keep default message when response body is not JSON.
    }
    throw new Error(detail)
  }

  return response.json()
}

export async function fetchMemories() {
  const response = await fetch(`${API_BASE_URL}/api/memories`)
  return handleResponse(response)
}

export async function createMemory({ title, name, message }) {
  const response = await fetch(`${API_BASE_URL}/api/memories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, name, message }),
  })
  return handleResponse(response)
}
