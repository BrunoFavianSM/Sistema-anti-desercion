import { Link } from "react-router-dom";

function DetalleAnaliticaTaller() {
  return (
    <div className="grid gap-6">
      <section className="rounded-[28px] border border-[var(--borde)] bg-[var(--superficie)] p-6 sombra-suave">
        <p className="text-sm text-[var(--texto-secundario)]">
          No hay datos reales para este taller todavía.
        </p>
        <Link className="boton-secundario mt-4 inline-flex" to="/analitica-talleres">
          Volver al reporte
        </Link>
      </section>
    </div>
  );
}

export default DetalleAnaliticaTaller;

