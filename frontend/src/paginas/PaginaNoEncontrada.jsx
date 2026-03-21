import { Link } from "react-router-dom";

function PaginaNoEncontrada() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--fondo)] px-6">
      <div className="max-w-xl rounded-[28px] border border-[var(--borde)] bg-[var(--superficie)] p-10 text-center sombra-suave">
        <p className="text-xs uppercase tracking-[0.3em] text-[var(--texto-secundario)]">Error 404</p>
        <h1 className="mt-4 text-3xl font-semibold text-[var(--texto)]">
          No encontramos esta sección
        </h1>
        <p className="mt-4 text-sm text-[var(--texto-secundario)]">
          Revisa la ruta o vuelve al panel principal para continuar.
        </p>
        <Link className="boton-principal mt-6 inline-flex" to="/">
          Ir al panel
        </Link>
      </div>
    </div>
  );
}

export default PaginaNoEncontrada;

