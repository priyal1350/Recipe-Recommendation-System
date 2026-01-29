import axios from "axios";

const API_BASE = "https://localhost:7060/api";

const api = axios.create({
  baseURL: API_BASE,
});

// Attach JWT token automatically
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
