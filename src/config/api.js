const PROD_BACKEND = 'https://trackhire-project.onrender.com';

const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  const isProd = import.meta.env.PROD || import.meta.env.MODE === 'production';

  // If in production, reject any localhost URL and default to the Render backend URL
  if (isProd) {
    if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
      return envUrl;
    }
    return PROD_BACKEND;
  }

  return envUrl || 'http://localhost:5000';
};

export const API_URL = getApiUrl().replace(/\/$/, '');
