// API Client Wrapper with JWT Authentication & Error Handling
import { showToast } from './components/toast.js';

const API_BASE = '/api';

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If body is FormData (e.g. file upload), let the browser set boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (!window.location.hash.startsWith('#/login')) {
        showToast('Session expired. Please log in again.', 'warning');
        window.location.hash = '#/login';
      }
      throw new Error('Unauthorized');
    }

    const json = await response.json();

    if (!response.ok || !json.success) {
      let errorMsg = json.message || 'An unexpected error occurred.';
      if (json.data && typeof json.data === 'object') {
        const fieldErrors = Object.values(json.data).join(', ');
        if (fieldErrors) errorMsg += ` (${fieldErrors})`;
      }
      throw new Error(errorMsg);
    }

    return json.data;
  } catch (error) {
    if (error.message !== 'Unauthorized') {
      showToast(error.message, 'error');
    }
    throw error;
  }
}

export const api = {
  get: (endpoint) => apiRequest(endpoint, { method: 'GET' }),
  post: (endpoint, body) => apiRequest(endpoint, {
    method: 'POST',
    body: body instanceof FormData ? body : JSON.stringify(body)
  }),
  put: (endpoint, body) => apiRequest(endpoint, {
    method: 'PUT',
    body: body instanceof FormData ? body : JSON.stringify(body)
  }),
  delete: (endpoint) => apiRequest(endpoint, { method: 'DELETE' })
};
