import axios from "axios";
import { useAuthStore } from "@/store/index.js";

const backendApiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: backendApiUrl,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, tokenSuccess = false) => {
  failedQueue.forEach(({ resolve, reject, originalRequest }) => {
    if (tokenSuccess) resolve(api(originalRequest));
    else reject(error);
  });
  failedQueue = [];
};

axios.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (config) => config,
  async (error) => {
    const { config, response } = error;
    const originalRequest = config;
    const responseURL = response?.request?.responseURL;

    if (response?.status === 401) {
      if (responseURL?.includes("password") || responseURL?.includes("login")) {
        useAuthStore.getState().setIsLoginLoading(false);
        return Promise.reject(error);
      }

      if (responseURL?.includes("logout") || responseURL?.includes("reset-token")) {
        useAuthStore.getState()._clearAuth();
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;

        try {
          await api.get(backendApiUrl + "/api/users/auth/reset-token");
          useAuthStore.getState().login();
          processQueue(null, true);
          return api(originalRequest);
        } catch (refreshError) {
          useAuthStore.getState()._clearAuth();
          processQueue(refreshError, false);
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, originalRequest });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
