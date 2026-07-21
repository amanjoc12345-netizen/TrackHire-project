const PROD_BACKEND = 'https://trackhire-project.onrender.com';

export const API_URL = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === 'production' ? PROD_BACKEND : 'http://localhost:5000')
).replace(/\/$/, '');
