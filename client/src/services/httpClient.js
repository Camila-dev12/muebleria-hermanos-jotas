export const API_URL = process.env.REACT_APP_API_URL || '';
export const TOKEN_STORAGE_KEY = 'mhj_auth_token';

function buildHeaders(body, token) {
  const headers = {};
  if (body) headers['Content-Type'] = 'application/json';

  const authToken = token ?? localStorage.getItem(TOKEN_STORAGE_KEY);
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  return headers;
}

export async function apiRequest(endpoint, { method = 'GET', body, token } = {}) {
  let response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: buildHeaders(body, token),
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('No pudimos conectarnos con el servidor. Probá de nuevo en unos minutos.');
  }

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(result?.error?.message || 'Ocurrió un error inesperado.');
    error.status = response.status;
    throw error;
  }

  if (!result) {
    throw new Error('No pudimos conectarnos con el servidor. Probá de nuevo en unos minutos.');
  }

  return result.data;
}
