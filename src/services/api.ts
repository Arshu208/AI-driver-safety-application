import axios from "axios";
import { useAuthStore } from "../store/authStore";

const browserApiUrl = typeof window !== 'undefined'
  ? `http://${window.location.hostname}:5000/api`
  : undefined;

// Resolve base URL safely and provide a helpful fallback
function resolveBaseUrl() {
  const candidate = browserApiUrl || import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  try {
    // validate by constructing a URL
    // allow relative paths (not expected here) by forcing a full URL
    const validated = new URL(candidate);
    return validated.toString().replace(/\/$/, '');
  } catch (e) {
    console.warn('Invalid API base URL:', candidate, '— falling back to http://localhost:5000/api');
    return 'http://localhost:5000/api';
  }
}

export const api = axios.create({
  baseURL: resolveBaseUrl(),
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
