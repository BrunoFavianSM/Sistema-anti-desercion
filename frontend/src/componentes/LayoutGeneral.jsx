import { Outlet, useLocation } from "react-router-dom";
import BarraLateral from "./BarraLateral.jsx";
import BarraMovil from "./BarraMovil.jsx";
import Encabezado from "./Encabezado.jsx";

const titulosPorRuta = {
  "/": "Panel general",
  "/usuarios": "Gestión de usuarios",
  "/talleres": "Talleres y asistencias",
  "/consultas": "Consultas psicológicas",
  "/etl": "Cargas ETL",
  "/ml": "Modelo predictivo",
  "/alertas": "Alertas y retención",
  "/analitica-talleres": "Analítica de talleres",
};

function obtenerTitulo(ruta) {
  if (ruta.startsWith("/usuarios")) return "Gestión de usuarios";
  if (ruta.startsWith("/talleres")) return "Talleres y asistencias";
  if (ruta.startsWith("/consultas")) return "Consultas psicológicas";
  if (ruta.startsWith("/etl")) return "Cargas ETL";
  if (ruta.startsWith("/ml")) return "Modelo predictivo";
  if (ruta.startsWith("/alertas")) return "Alertas y retención";
  if (ruta.startsWith("/analitica-talleres")) return "Analítica de talleres";
  return titulosPorRuta[ruta] || "Panel general";
}

function LayoutGeneral() {
  const location = useLocation();
  const titulo = obtenerTitulo(location.pathname);

  return (
    <div className="min-h-screen bg-[var(--fondo)]">
      <div className="flex">
        <BarraLateral />
        <div className="flex min-h-screen flex-1 flex-col">
          <Encabezado titulo={titulo} />
          <main className="flex-1 px-6 pb-24 pt-6 lg:px-10 lg:pb-10">
            <Outlet />
          </main>
        </div>
      </div>
      <BarraMovil />
    </div>
  );
}

export default LayoutGeneral;
