const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const buildUrl = (path) => `${API_BASE_URL}${path}`;
export const assetUrl = (path) => path ? (path.startsWith('http') ? path : `${API_BASE_URL}${path}`) : '';

export const apiFetch = async (path, options = {}) => {
  const token = localStorage.getItem('ai_scholars_token');

  const response = await fetch(buildUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};

  if (!response.ok) {
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
  const payload = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(payload.message || 'Upload failed');
  }

  return payload;
};

export default API_BASE_URL;
