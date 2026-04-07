import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
if (!BASE_URL) throw new Error("VITE_API_BASE_URL is not defined");

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
  withCredentials: true, // sends httpOnly auth cookies automatically
});

// ─── RESPONSE: refresca token automáticamente si recibe 401 ─────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: () => void;
  reject: (e: unknown) => void;
}> = [];

const processQueue = (error: unknown) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve()));
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Only try to refresh if there's an existing session (session_active cookie present).
    // During login/auth flows there's no session yet — let the error propagate normally.
    const hasSession = document.cookie.split(';').some((c) => c.trim().startsWith('session_active=1'));
    if (error.response?.status === 401 && !originalRequest._retry && hasSession) {
      if (isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => axiosInstance(originalRequest));
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        // Cookies are sent automatically — no body needed
        await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true });
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        // Clear the JS-readable session indicator so the context knows the session ended
        document.cookie = "session_active=; max-age=0; path=/";
        window.location.href = "/";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
export { axiosInstance };
