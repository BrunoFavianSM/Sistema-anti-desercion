import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../servicios/api.js";

function Inicio() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    api
      .get("/api/usuarios")
      .then((respuesta) => {
        if (!activo) return;
        setUsuarios(respuesta.data?.datos || []);
      })
      .catch(() => {
        if (!activo) return;
        setUsuarios([]);
      })
      .finally(() => {
        if (!activo) return;
        setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, []);

  const recientes = usuarios.slice(0, 3);
  const total = usuarios.length;

  return (
    <div className="grid gap-6">
      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-[28px] border border-[var(--borde)] bg-[var(--superficie)] p-6 sombra-suave">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--texto-secundario)]">
            Resumen del día
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-[var(--texto)]">
            Registro activo de usuarios
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-[var(--borde)] bg-[var(--superficie-oscura)] p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--texto-secundario)]">Usuarios</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--texto)]">
                {cargando ? "..." : total}
              </p>
              <p className="text-xs text-[var(--texto-secundario)]">cargados en sistema</p>
            </div>
            <div className="rounded-2xl border border-[var(--borde)] bg-[var(--superficie-oscura)] p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--texto-secundario)]">Base</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--texto)]">PostgreSQL</p>
              <p className="text-xs text-[var(--texto-secundario)]">conexión activa</p>
            </div>
            <div className="rounded-2xl border border-[var(--borde)] bg-[var(--superficie-oscura)] p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--texto-secundario)]">Dashboard</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--texto)]">En vivo</p>
              <p className="text-xs text-[var(--texto-secundario)]">sin datos simulados</p>
            </div>
          </div>
        </div>
        <div className="rounded-[28px] border border-[var(--borde)] bg-[var(--superficie)] p-6 sombra-suave">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--texto-secundario)]">Usuarios recientes</p>
          <h3 className="mt-3 text-xl font-semibold text-[var(--texto)]">Últimos registros</h3>
          <div className="mt-4 space-y-3">
            {cargando && (
              <div className="rounded-2xl border border-[var(--borde)] bg-[var(--superficie-oscura)] p-4 text-sm text-[var(--texto-secundario)]">
                Cargando información...
              </div>
            )}
            {!cargando && recientes.length === 0 && (
              <div className="rounded-2xl border border-[var(--borde)] bg-[var(--superficie-oscura)] p-4 text-sm text-[var(--texto-secundario)]">
                No hay registros disponibles.
              </div>
            )}
            {recientes.map((usuario) => (
              <div
                key={usuario.id}
                className="flex items-center justify-between rounded-2xl border border-[var(--borde)] bg-[var(--superficie-oscura)] p-4"
              >
                <div>
                  <p className="text-sm font-semibold text-[var(--texto)]">
                    {usuario.nombres} {usuario.apellidos}
                  </p>
                  <p className="text-xs text-[var(--texto-secundario)]">
                    DNI {usuario.dni || "No registrado"}
                  </p>
                </div>
                <Link className="boton-secundario" to={`/usuarios/${usuario.id}`}>
                  Ver perfil
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-[var(--borde)] bg-[var(--superficie)] p-6 sombra-suave">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--texto-secundario)]">Acciones rápidas</p>
            <h3 className="mt-2 text-xl font-semibold text-[var(--texto)]">Atajos operativos</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="boton-principal" to="/usuarios">
              Ver usuarios
            </Link>
            <Link className="boton-secundario" to="/etl">
              Cargar datos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Inicio;
