import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../servicios/api.js";
import { formatearFechaLarga } from "../../utilidades/formatos.js";

function ListaUsuarios() {
  const [busqueda, setBusqueda] = useState("");
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

  const usuariosFiltrados = useMemo(() => {
    if (!busqueda) return usuarios;
    return usuarios.filter((usuario) =>
      `${usuario.nombres} ${usuario.apellidos}`
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    );
  }, [busqueda, usuarios]);

  return (
    <div className="grid gap-6">
      <section className="rounded-[28px] border border-[var(--borde)] bg-[var(--superficie)] p-6 sombra-suave">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--texto-secundario)]">Registro</p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--texto)]">Usuarios cargados</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <input
              className="campo-texto foco-visible max-w-xs"
              placeholder="Buscar por nombre"
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </div>
        </div>
        <div className="mt-6 overflow-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="text-xs uppercase tracking-[0.2em] text-[var(--texto-secundario)]">
              <tr>
                <th className="py-3">Nombres</th>
                <th className="py-3">Apellidos</th>
                <th className="py-3">DNI</th>
                <th className="py-3">Fecha de nacimiento</th>
                <th className="py-3">Fecha de inscripción</th>
                <th className="py-3">Edad</th>
                <th className="py-3">Género</th>
                <th className="py-3">Condición</th>
                <th className="py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-[var(--texto)]">
              {cargando && (
                <tr>
                  <td className="py-4" colSpan={9}>
                    Cargando información...
                  </td>
                </tr>
              )}
              {!cargando && usuariosFiltrados.length === 0 && (
                <tr>
                  <td className="py-4" colSpan={9}>
                    No hay registros disponibles.
                  </td>
                </tr>
              )}
              {usuariosFiltrados.map((usuario) => (
                <tr key={usuario.id} className="border-t border-[var(--borde)]">
                  <td className="py-4 font-semibold">{usuario.nombres}</td>
                  <td className="py-4">{usuario.apellidos}</td>
                  <td className="py-4 text-[var(--texto-secundario)]">
                    {usuario.dni || "No registrado"}
                  </td>
                  <td className="py-4">
                    {usuario.fecha_nacimiento
                      ? formatearFechaLarga(usuario.fecha_nacimiento)
                      : "No registrada"}
                  </td>
                  <td className="py-4">
                    {usuario.fecha_inscripcion
                      ? formatearFechaLarga(usuario.fecha_inscripcion)
                      : "No registrada"}
                  </td>
                  <td className="py-4">{usuario.edad || "-"}</td>
                  <td className="py-4">{usuario.genero || "-"}</td>
                  <td className="py-4">
                    <span className="chip">{usuario.condicion || "No"}</span>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-wrap gap-2">
                      <Link className="boton-secundario" to={`/usuarios/${usuario.id}`}>
                        Perfil
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default ListaUsuarios;
