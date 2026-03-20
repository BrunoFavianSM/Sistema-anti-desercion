import { create } from "zustand";

const tokenInicial = localStorage.getItem("token_sesion");
const especialistaInicial = localStorage.getItem("especialista_sesion");

export const useAutenticacion = create((set) => ({
  token: tokenInicial || "",
  especialista: especialistaInicial ? JSON.parse(especialistaInicial) : null,
  iniciarSesion: ({ token, especialista }) => {
    localStorage.setItem("token_sesion", token);
    localStorage.setItem("especialista_sesion", JSON.stringify(especialista));
    set({ token, especialista });
  },
  cerrarSesion: () => {
    localStorage.removeItem("token_sesion");
    localStorage.removeItem("especialista_sesion");
    set({ token: "", especialista: null });
  },
}));
