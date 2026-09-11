// Keep the API origin in one place. Endpoints below include their `/api` prefix.
const API_BASE_URL = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '');

export const clearAuth = () => {
  localStorage.removeItem('ai_scholars_token');
  localStorage.removeItem('ai_scholars_user');
  window.dispatchEvent(new Event('ai-scholars-auth-expired'));
};

const buildUrl = (path) => `${API_BASE_URL}${path}`;
export const assetUrl = (path) => {
  if (!path) return '';
  if (/^(https?:|data:)/i.test(path)) return path;
  const normalizedPath = path.startsWith('/')
    ? path
    : path.includes('/')
      ? `/${path}`
      : `/upload/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export const apiFetch = async (path, options = {}) => {
  const token = localStorage.getItem('ai_scholars_token');

  const response = await fetch(buildUrl(path), {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();
  let payload = {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { message: 'The server returned an invalid response.' };
  }

  if (!response.ok) {
    if (response.status === 401 && token && !path.startsWith('/api/auth/login') && !path.startsWith('/api/auth/register')) clearAuth();
    throw new Error(payload.message || 'Request failed');
  }

  return payload;
};

export const apiUpload = async (path, formData, method = 'POST') => {
  const token = localStorage.getItem('ai_scholars_token');

  const response = await fetch(buildUrl(path), {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  const text = await response.text();
  let payload = {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { message: 'The server returned an invalid response.' };
  }

  if (!response.ok) {
    if (response.status === 401 && token) clearAuth();
    throw new Error(payload.message || 'Upload failed');
  }

  return payload;
};

export default API_BASE_URL;
