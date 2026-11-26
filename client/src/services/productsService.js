import { API_URL, apiRequest } from './httpClient';

export function getProducts() {
  return apiRequest('/api/productos?limit=50');
}

export function getProduct(id) {
  return apiRequest(`/api/productos/${id}`);
}

export function createProduct(product) {
  return apiRequest('/api/productos', { method: 'POST', body: product });
}

export function updateProduct(id, product) {
  return apiRequest(`/api/productos/${id}`, { method: 'PUT', body: product });
}

export function deleteProduct(id) {
  return apiRequest(`/api/productos/${id}`, { method: 'DELETE' });
}

export function imageUrl(img) {
  if (!img) return `${API_URL}/assets/img/placeholder.svg`;
  if (/^https?:\/\//.test(img)) return img;
  return `${API_URL}/${img.replace(/^\//, '')}`;
}
