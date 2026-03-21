import { NavLink } from "react-router-dom";

const enlaces = [
  { ruta: "/", nombre: "Panel" },
  { ruta: "/usuarios", nombre: "Usuarios" },
  { ruta: "/talleres", nombre: "Talleres" },
  { ruta: "/consultas", nombre: "Consultas" },
  { ruta: "/etl", nombre: "ETL" },
  { ruta: "/ml", nombre: "Modelo ML" },
  { ruta: "/alertas", nombre: "Alertas" },
  { ruta: "/analitica-talleres", nombre: "Analítica" },
];

function BarraLateral() {
  return (
    <aside className="hidden w-72 flex-col border-r border-[var(--borde)] bg-[var(--superficie)] px-6 py-8 lg:flex">
      <div className="mb-10">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--texto-secundario)]">Mente Oasis</p>
        <h1 className="text-2xl font-semibold text-[var(--texto)]">Sistema anti-deserción</h1>
        <p className="mt-2 text-xs text-[var(--texto-secundario)]">Administración académica</p>
      </div>
      <nav className="flex flex-1 flex-col gap-2">
        {enlaces.map((enlace) => (
          <NavLink
            key={enlace.ruta}
            to={enlace.ruta}
            end={enlace.ruta === "/"}
            className={({ isActive }) =>
              `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                isActive
                  ? "bg-[var(--primario)] text-white shadow"
                  : "text-[var(--texto-secundario)] hover:bg-[var(--superficie-oscura)] hover:text-[var(--texto)]"
              }`
            }
          >
            <span>{enlace.nombre}</span>
            <span className="text-xs text-[var(--texto-secundario)]">•</span>
          </NavLink>
        ))}
      </nav>
      <div className="mt-8 rounded-2xl border border-[var(--borde)] bg-[var(--superficie-oscura)] p-4 text-sm text-[var(--texto-secundario)]">
        <p className="font-semibold text-[var(--texto)]">Estado general</p>
        <p className="mt-2">Última sincronización: hoy 08:30</p>
        <p className="mt-1">Alertas críticas: 2</p>
      </div>
    </aside>
  );
}

export default BarraLateral;
