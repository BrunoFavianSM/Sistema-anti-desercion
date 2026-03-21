import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../servicios/api.js";
import { formatearFechaLarga } from "../../utilidades/formatos.js";

function PerfilUsuario() {
  const { uuid } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    api
      .get(`/api/usuarios/${uuid}`)
      .then((respuesta) => {
        if (!activo) return;
        setUsuario(respuesta.data?.dato || null);
      })
      .catch(() => {
        if (!activo) return;
        setUsuario(null);
      })
      .finally(() => {
        if (!activo) return;
        setCargando(false);
      });
    return () => {
      activo = false;
    };
  }, [uuid]);

  if (cargando) {
    return (
      <div className="rounded-[28px] border border-[var(--borde)] bg-[var(--superficie)] p-6 sombra-suave">
        <p className="text-sm text-[var(--texto-secundario)]">Cargando perfil...</p>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="rounded-[28px] border border-[var(--borde)] bg-[var(--superficie)] p-6 sombra-suave">
        <p className="text-sm text-[var(--texto-secundario)]">Usuario no encontrado.</p>
        <Link className="boton-secundario mt-4 inline-flex" to="/usuarios">
          Volver
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <section className="rounded-[28px] border border-[var(--borde)] bg-[var(--superficie)] p-6 sombra-suave">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--texto-secundario)]">Perfil</p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--texto)]">
              {usuario.nombres} {usuario.apellidos}
            </h2>
            <p className="mt-2 text-sm text-[var(--texto-secundario)]">
              DNI {usuario.dni || "No registrado"}
            </p>
          </div>
          <Link className="boton-secundario" to="/usuarios">
            Volver al listado
          </Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[var(--borde)] bg-[var(--superficie-oscura)] p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--texto-secundario)]">Edad</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--texto)]">
              {usuario.edad || "-"}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--borde)] bg-[var(--superficie-oscura)] p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--texto-secundario)]">Género</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--texto)]">
              {usuario.genero || "-"}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--borde)] bg-[var(--superficie-oscura)] p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--texto-secundario)]">Condición</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--texto)]">
              {usuario.condicion || "No"}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-[var(--borde)] bg-[var(--superficie)] p-6 sombra-suave">
        <h3 className="text-xl font-semibold text-[var(--texto)]">Detalle de registro</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--borde)] bg-[var(--superficie-oscura)] p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--texto-secundario)]">Fecha de nacimiento</p>
            <p className="mt-2 text-sm text-[var(--texto)]">
              {usuario.fecha_nacimiento ? formatearFechaLarga(usuario.fecha_nacimiento) : "No registrada"}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--borde)] bg-[var(--superficie-oscura)] p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--texto-secundario)]">Fecha de inscripción</p>
            <p className="mt-2 text-sm text-[var(--texto)]">
              {usuario.fecha_inscripcion ? formatearFechaLarga(usuario.fecha_inscripcion) : "No registrada"}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--borde)] bg-[var(--superficie-oscura)] p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--texto-secundario)]">Dirección</p>
            <p className="mt-2 text-sm text-[var(--texto)]">
              {usuario.direccion || "No registrada"}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--borde)] bg-[var(--superficie-oscura)] p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--texto-secundario)]">Contacto</p>
            <p className="mt-2 text-sm text-[var(--texto)]">
              {usuario.telefono || "Sin teléfono"}
            </p>
            <p className="text-xs text-[var(--texto-secundario)]">
              {usuario.email || "Sin correo"}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PerfilUsuario;

