import axios from "axios";
import toast from "react-hot-toast";
import { logger } from "./logger";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "https://bd-backend-1.onrender.com/api"
).replace(/\/$/, "");

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

let isRefreshing = false;
let pendingRequests = [];

const flushPendingRequests = (error, token = null) => {
  pendingRequests.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  pendingRequests = [];
};

const clearSessionAndRedirect = () => {
  localStorage.removeItem("bdms_token");
  localStorage.removeItem("bdms_refresh_token");
  localStorage.removeItem("bdms_hospital_id");
  localStorage.removeItem("bdms_hospital_name");
  localStorage.removeItem("bdms_role");
  window.dispatchEvent(new Event("bdms:session-expired"));
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("bdms_token");
    const hospitalId = localStorage.getItem("bdms_hospital_id");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (hospitalId) {
      config.headers["X-Hospital-Id"] = hospitalId;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const isNetworkError = !error.response;

    logger.error("API request failed", {
      url: originalRequest?.url,
      method: originalRequest?.method,
      status,
      message: error.message,
    });

    // Retry idempotent GET calls for transient failures.
    if ((isNetworkError || status >= 500) && originalRequest?.method?.toLowerCase() === "get") {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      if (originalRequest._retryCount <= 2) {
        await new Promise((resolve) => setTimeout(resolve, 400 * originalRequest._retryCount));
        return api(originalRequest);
      }
    }

    if (isNetworkError) {
      toast.error("Network/CORS issue: backend is unreachable or blocked by CORS policy");
      return Promise.reject(error);
    }

    if (status === 403) {
      toast.error("Forbidden: you do not have permission for this action");
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest?._retry) {
      const refreshToken = localStorage.getItem("bdms_refresh_token");
      if (!refreshToken) {
        clearSessionAndRedirect();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push({ resolve, reject });
        })
          .then((nextToken) => {
            originalRequest.headers.Authorization = `Bearer ${nextToken}`;
            return api(originalRequest);
          })
          .catch((refreshError) => Promise.reject(refreshError));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });
        const refreshPayload = response.data?.data || response.data;
        const nextToken = refreshPayload?.token || refreshPayload?.accessToken;
        const nextRefreshToken = refreshPayload?.refreshToken || refreshToken;

        if (!nextToken) {
          throw new Error("No access token returned from refresh endpoint");
        }

        localStorage.setItem("bdms_token", nextToken);
        localStorage.setItem("bdms_refresh_token", nextRefreshToken);
        api.defaults.headers.common.Authorization = `Bearer ${nextToken}`;
        flushPendingRequests(null, nextToken);
        originalRequest.headers.Authorization = `Bearer ${nextToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        flushPendingRequests(refreshError, null);
        clearSessionAndRedirect();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
