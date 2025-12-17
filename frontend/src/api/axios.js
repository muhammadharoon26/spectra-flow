import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api", // Laravel API URL
  withCredentials: true, // Important for Sanctum cookies
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor to automatically send CSRF token
api.interceptors.request.use((config) => {
  // Extract XSRF-TOKEN from cookies
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];

  if (token) {
    config.headers["X-XSRF-TOKEN"] = decodeURIComponent(token);
  }

  return config;
});

export default api;
