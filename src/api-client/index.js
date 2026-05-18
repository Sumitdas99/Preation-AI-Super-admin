import axios from "axios";
import { API_URL } from "../environment";
import { logout as logoutAction } from "../context/slice/authSlice";
import { store } from "../context/store";

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 30000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    try {
      const authState = JSON.parse(localStorage.getItem("persist:root") || "{}");
      const auth = JSON.parse(authState.auth || "{}");
      if (auth.token) config.headers.Authorization = `Bearer ${auth.token}`;
    } catch (e) {}
    if (typeof window !== "undefined") config.headers.referrermodule = window.location.href;
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.message = error.message || "Network error. Please check your connection.";
      return Promise.reject(error);
    }
    const status = error.response?.status;
    const statusCode = error.response?.data?.statusCode;
    if (status === 401 || statusCode === 401) {
      localStorage.removeItem("persist:root");
      localStorage.removeItem("userRole");
      localStorage.removeItem("auth_token");
      try {
        store.dispatch(logoutAction());
      } catch (e) {}
      if (typeof window !== "undefined" && window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

function buildQueryString(params) {
  if (!params || typeof params !== "object") return "";
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    if (params[key] !== null && params[key] !== undefined) {
      queryParams.append(key, params[key]);
    }
  });
  const query = queryParams.toString();
  return query ? `?${query}` : "";
}

class ApiClient {
  static async post(url, data = {}, token = null, dispatch = null) {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await axiosInstance.post(url, data, config);
    return response.data;
  }

  static async put(url, data = {}, token = null) {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await axiosInstance.put(url, data, config);
    return response.data;
  }

  static async get(url, params = {}, token = null, dispatch = null, options = {}) {
    const queryString = buildQueryString(params);
    const fullUrl = queryString ? `${url}${queryString}` : url;
    const config = token ? { ...options, headers: { ...(options.headers || {}), Authorization: `Bearer ${token}` } } : options;
    const response = await axiosInstance.get(fullUrl, config);
    return response.data;
  }

  static async delete(url, data = {}, token = null) {
    const config = {};
    if (data && Object.keys(data).length > 0) config.data = data;
    if (token) config.headers = { Authorization: `Bearer ${token}` };
    const response = await axiosInstance.delete(url, config);
    return response.data;
  }

  static async patch(url, data = {}, token = null) {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await axiosInstance.patch(url, data, config);
    return response.data;
  }
}

export default ApiClient;
