import { apiRequest } from './httpClient';

export function registerUser({ nombre, email, password }) {
  return apiRequest('/api/auth/registro', {
    method: 'POST',
    body: { nombre, email, password },
  });
}

export function loginUser({ email, password }) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

export function getProfile(token) {
  return apiRequest('/api/auth/perfil', { token });
}
