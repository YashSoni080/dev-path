import axios from "axios";

// In production, always use same-origin /api unless an external production URL is explicitly provided
const isProd = import.meta.env.PROD;
const envUrl = import.meta.env.VITE_API_URL;

const baseURL =
  isProd && (!envUrl || envUrl.includes("localhost") || envUrl.includes("127.0.0.1"))
    ? "/api"
    : envUrl || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  withCredentials: true, // Always send cookies cross-origin
});

export default api;
