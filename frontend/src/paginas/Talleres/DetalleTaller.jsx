import { Link } from "react-router-dom";

function DetalleTaller() {
  return (
    <div className="grid gap-6">
      <section className="rounded-[28px] border border-[var(--borde)] bg-[var(--superficie)] p-6 sombra-suave">
        <p className="text-sm text-[var(--texto-secundario)]">
          El detalle de talleres aún no está conectado a datos reales.
        </p>
        <Link className="boton-secundario mt-4 inline-flex" to="/talleres">
          Volver
        </Link>
      </section>
    </div>
  );
}

export default DetalleTaller;
