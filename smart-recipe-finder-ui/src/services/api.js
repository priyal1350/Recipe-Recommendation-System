import axios from "axios";

// 🔥 Azure Backend URLs
const AUTH_API = "https://flavorquest-auth-service-fma3fzazezg6dzc5.centralindia-01.azurewebsites.net/api";
const RECIPE_API = "https://flavorquest-recipefinder-a0gdbjckc6ckgach.centralindia-01.azurewebsites.net/api";

// Axios instances
export const authApi = axios.create({
  baseURL: AUTH_API,
});

export const recipeApi = axios.create({
  baseURL: RECIPE_API,
});

// 🔐 Attach JWT token automatically to recipe API
recipeApi.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
