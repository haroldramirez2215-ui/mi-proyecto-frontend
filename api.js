import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000/api';

// Función helper: hace fetch incluyendo el token JWT en el header
export const apiFetch = async (path, token, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };
  return fetch(`${API_URL}${path}`, { ...options, headers });
};

export default API_URL;
