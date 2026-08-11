import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Token ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem("auth_token")) {
      localStorage.removeItem("auth_token");
      window.dispatchEvent(new Event("auth-session-expired"));
    }
    return Promise.reject(error);
  },
);

export function mediaUrl(value?: string | null) {
  if (!value) return "/property-placeholder.svg";
  if (/^https?:\/\//.test(value)) return value;
  return `${BACKEND_URL}${value.startsWith("/") ? "" : "/"}${value}`;
}

export default api;
