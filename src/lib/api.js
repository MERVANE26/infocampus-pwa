import axios from 'axios';


// Configure your backend API base URL here
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Logout helper and JWT expiry check
function logoutDueToExpiredToken() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
  window.location.href = '/auth';
}

function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = token.split('.')[1];
    if (!payload) return true;
    // Decode base64url
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const decoded = JSON.parse(json);
    if (!decoded.exp) return true;
    return Date.now() / 1000 >= decoded.exp;
  } catch {
    return true;
  }
}

// Request interceptor: check token expiry before sending
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      if (isTokenExpired(token)) {
        logoutDueToExpiredToken();
        return Promise.reject(new Error('Token expired'));
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);



