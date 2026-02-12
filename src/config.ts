// centralized config for API URL
// In development, VITE_API_BASE_URL is usually http://localhost:3001
// In production (Netlify), it might be empty (to use relative paths /api/...) or set to a specific URL.

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
