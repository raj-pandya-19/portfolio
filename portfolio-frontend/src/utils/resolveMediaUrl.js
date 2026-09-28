const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export function resolveMediaUrl(path) {
  if (!path) return null;
  return path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
}
