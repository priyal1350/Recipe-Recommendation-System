import axios from "axios";

// ✅ Azure .NET API URL
const API_BASE =
  "https://flavorquest-recipefinder-a0gdbjckc6ckgach.centralindia-01.azurewebsites.net/api";

const api = axios.create({
  baseURL: API_BASE,
});

// ✅ Automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
