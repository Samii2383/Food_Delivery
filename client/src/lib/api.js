import axios from "axios";
import toast from "react-hot-toast";

const TOKEN_KEY = "qb_token";
const USER_KEY = "qb_user";
let hasAuthErrorToast = false;

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;

    if (status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      if (!hasAuthErrorToast) {
        hasAuthErrorToast = true;
        toast.error("Session expired. Please login again.");
        setTimeout(() => {
          hasAuthErrorToast = false;
        }, 3000);
      }
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    } else if (message && status >= 500) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

