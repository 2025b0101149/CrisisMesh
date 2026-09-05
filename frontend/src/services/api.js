import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '';
// In production, VITE_API_URL is the Render backend URL (e.g., https://crisismesh-api.onrender.com)
// If not specified, default to '/api' so local Vite dev proxy works seamlessly
const getBaseURL = () => {
  if (!rawApiUrl) return '/api';
  const trimmed = rawApiUrl.replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT auth token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('crisismesh_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for consistent error normalization
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'Network connection failed',
      status: error.response?.status || 0,
      data: error.response?.data || null
    };
    return Promise.reject(customError);
  }
);

export default api;
