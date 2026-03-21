import { NavLink } from "react-router-dom";

const enlaces = [
  { ruta: "/", nombre: "Panel" },
  { ruta: "/usuarios", nombre: "Usuarios" },
  { ruta: "/talleres", nombre: "Talleres" },
  { ruta: "/alertas", nombre: "Alertas" },
];

function BarraMovil() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-around border-t border-[var(--borde)] bg-[var(--superficie)] px-4 py-3 shadow-[0_-12px_30px_rgba(30,35,40,0.08)] lg:hidden">
      {enlaces.map((enlace) => (
        <NavLink
          key={enlace.ruta}
          to={enlace.ruta}
          end={enlace.ruta === "/"}
          className={({ isActive }) =>
            `rounded-full px-3 py-2 text-xs font-semibold ${
              isActive ? "bg-[var(--primario)] text-white" : "text-[var(--texto-secundario)]"
            }`
          }
        >
          {enlace.nombre}
        </NavLink>
      ))}
    </nav>
  );
}

export default BarraMovil;

