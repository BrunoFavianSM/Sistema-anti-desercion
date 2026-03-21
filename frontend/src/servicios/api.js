import axios from "axios";
import { useAutenticacion } from "../estado/usoAutenticacion.js";

export const esModoSimulado =
  (import.meta.env.VITE_MODO_SIMULADO || "true").toLowerCase() === "true";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = useAutenticacion.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      useAutenticacion.getState().cerrarSesion();
      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  }
);

