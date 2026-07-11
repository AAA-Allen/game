import axios from "axios";

// In production the Vercel rewrites proxy /api/* → backend.
// In development Vite's dev proxy forwards to localhost:3001.
const API_BASE_URL = "/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("webquest_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
