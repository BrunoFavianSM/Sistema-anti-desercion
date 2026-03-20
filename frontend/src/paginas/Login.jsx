import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api, esModoSimulado } from "../servicios/api.js";
import { useAutenticacion } from "../estado/usoAutenticacion.js";

function Login() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [cargando, setCargando] = useState(false);
  const iniciarSesion = useAutenticacion((state) => state.iniciarSesion);
  const navigate = useNavigate();

  const manejarEnvio = async (event) => {
    event.preventDefault();
    if (!correo || !clave) {
      toast.error("Completa correo y contraseña.");
      return;
    }
    setCargando(true);
    try {
      if (esModoSimulado) {
        iniciarSesion({
          token: "token-simulado",
          especialista: {
            nombre: "Lic. Camila Rivas",
            correo,
          },
        });
        navigate("/");
        return;
      }
      const respuesta = await api.post("/auth/login", {
        correo,
        clave,
      });
      iniciarSesion({
        token: respuesta.data?.token,
        especialista: respuesta.data?.especialista,
      });
      navigate("/");
    } catch (error) {
      toast.error("No se pudo iniciar sesión. Verifica tus credenciales.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--fondo)] px-6 py-10">
      <div className="w-full max-w-5xl rounded-[32px] border border-[var(--borde)] bg-[var(--superficie)] p-8 shadow-[0_30px_60px_rgba(30,35,40,0.12)] lg:grid lg:grid-cols-[1.1fr_1fr] lg:gap-10">
        <div className="flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--texto-secundario)]">
              Plataforma Mente Oasis
            </p>
            <h1 className="mt-4 text-4xl font-semibold text-[var(--texto)]">
              Ingreso seguro para seguimiento integral
            </h1>
            <p className="mt-4 text-sm text-[var(--texto-secundario)]">
              Centraliza la gestión de estudiantes, talleres y alertas con trazabilidad y datos protegidos.
            </p>
          </div>
          <div className="mt-8 rounded-2xl border border-[var(--borde)] bg-[var(--superficie-oscura)] p-6 text-sm text-[var(--texto-secundario)]">
            <p className="font-semibold text-[var(--texto)]">Acceso recomendado</p>
            <p className="mt-2">Usa tu correo institucional y la clave asignada por el área de soporte.</p>
            <p className="mt-2 text-xs">Modo simulado: {esModoSimulado ? "activado" : "desactivado"}</p>
          </div>
        </div>
        <form className="mt-8 space-y-5 lg:mt-0" onSubmit={manejarEnvio}>
          <div>
            <label className="text-sm font-semibold text-[var(--texto)]">Correo institucional</label>
            <input
              className="campo-texto foco-visible mt-2"
              type="email"
              placeholder="nombre@institucion.edu"
              value={correo}
              onChange={(event) => setCorreo(event.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-[var(--texto)]">Contraseña</label>
            <input
              className="campo-texto foco-visible mt-2"
              type="password"
              placeholder="••••••••"
              value={clave}
              onChange={(event) => setClave(event.target.value)}
            />
          </div>
          <button className="boton-principal foco-visible w-full" type="submit" disabled={cargando}>
            {cargando ? "Ingresando..." : "Ingresar"}
          </button>
          <p className="text-xs text-[var(--texto-secundario)]">
            ¿Problemas para ingresar? Contacta a soporte de Mente Oasis.
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
