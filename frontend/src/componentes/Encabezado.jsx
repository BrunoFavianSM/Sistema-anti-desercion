import { NavLink } from "react-router-dom";
import { useAutenticacion } from "../estado/usoAutenticacion.js";

const accesosRapidos = [
  { ruta: "/usuarios", nombre: "Usuarios" },
  { ruta: "/talleres", nombre: "Talleres" },
  { ruta: "/alertas", nombre: "Alertas" },
];

function Encabezado({ titulo }) {
  const cerrarSesion = useAutenticacion((state) => state.cerrarSesion);
  const especialista = useAutenticacion((state) => state.especialista);

  return (
    <header className="border-b border-[var(--borde)] bg-[var(--superficie)] px-6 py-6 lg:px-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--texto-secundario)]">
            Módulo operativo
          </p>
          <h2 className="text-3xl font-semibold text-[var(--texto)]">
            {titulo}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="hidden items-center gap-2 lg:flex">
            {accesosRapidos.map((acceso) => (
              <NavLink
                key={acceso.ruta}
                to={acceso.ruta}
                className="rounded-full border border-[var(--borde)] px-4 py-2 text-xs font-semibold text-[var(--texto-secundario)] transition hover:border-[var(--primario)] hover:text-[var(--primario)]"
              >
                {acceso.nombre}
              </NavLink>
            ))}
          </div>
          <button
            className="boton-secundario foco-visible"
            type="button"
            onClick={cerrarSesion}
          >
            Cerrar sesión
          </button>
          <div className="rounded-full border border-[var(--borde)] bg-[var(--superficie-oscura)] px-4 py-2 text-sm font-semibold text-[var(--texto)]">
            {especialista?.nombre || "Especialista"}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Encabezado;
