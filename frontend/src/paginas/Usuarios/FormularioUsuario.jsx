import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { usuariosFalsos } from "../../datos/falsos.js";

function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return 0;
  const hoy = new Date();
  const fecha = new Date(`${fechaNacimiento}T00:00:00`);
  let edad = hoy.getFullYear() - fecha.getFullYear();
  const ajuste = hoy.getMonth() - fecha.getMonth();
  if (ajuste < 0 || (ajuste === 0 && hoy.getDate() < fecha.getDate())) {
    edad -= 1;
  }
  return edad;
}

function FormularioUsuario() {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const usuarioExistente = useMemo(
    () => usuariosFalsos.find((usuario) => usuario.uuid === uuid),
    [uuid]
  );

  const [formulario, setFormulario] = useState({
    nombre: usuarioExistente?.nombre || "",
    dni: usuarioExistente?.dni || "",
    fechaNacimiento: "",
    correo: "",
    telefono: "",
    apoderado: usuarioExistente?.apoderado || "",
    autorizacionDatos: false,
    autorizacionContacto: false,
  });

  const edad = calcularEdad(formulario.fechaNacimiento);
  const esMenor = edad > 0 && edad < 18;

  const actualizarCampo = (campo) => (event) => {
    const valor =
      event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setFormulario((previo) => ({ ...previo, [campo]: valor }));
  };

  const manejarEnvio = (event) => {
    event.preventDefault();
    if (!formulario.nombre || !formulario.dni) {
      toast.error("Completa nombre y DNI.");
      return;
    }
    if (esMenor) {
      if (!formulario.apoderado || !formulario.autorizacionDatos || !formulario.autorizacionContacto) {
        toast.error("Para menores se requiere apoderado y autorizaciones.");
        return;
      }
    }
    toast.success(uuid ? "Usuario actualizado" : "Usuario registrado");
    navigate("/usuarios");
  };

  return (
    <form onSubmit={manejarEnvio} className="grid gap-6">
      <section className="rounded-[28px] border border-[var(--borde)] bg-[var(--superficie)] p-6 sombra-suave">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--texto-secundario)]">
            {uuid ? "Edición" : "Registro"}
          </p>
          <h2 className="text-2xl font-semibold text-[var(--texto)]">
            {uuid ? "Actualizar usuario" : "Nuevo usuario"}
          </h2>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold">Nombre completo</label>
            <input className="campo-texto mt-2" value={formulario.nombre} onChange={actualizarCampo("nombre")} />
          </div>
          <div>
            <label className="text-sm font-semibold">DNI</label>
            <input className="campo-texto mt-2" value={formulario.dni} onChange={actualizarCampo("dni")} />
          </div>
          <div>
            <label className="text-sm font-semibold">Fecha de nacimiento</label>
            <input
              type="date"
              className="campo-texto mt-2"
              value={formulario.fechaNacimiento}
              onChange={actualizarCampo("fechaNacimiento")}
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Correo</label>
            <input className="campo-texto mt-2" value={formulario.correo} onChange={actualizarCampo("correo")} />
          </div>
          <div>
            <label className="text-sm font-semibold">Teléfono</label>
            <input className="campo-texto mt-2" value={formulario.telefono} onChange={actualizarCampo("telefono")} />
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-[var(--borde)] bg-[var(--superficie)] p-6 sombra-suave">
        <h3 className="text-xl font-semibold text-[var(--texto)]">Información de apoderado</h3>
        <p className="mt-2 text-sm text-[var(--texto-secundario)]">
          Si el usuario es menor de edad, se requieren datos del apoderado y autorizaciones.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold">Nombre del apoderado</label>
            <input
              className="campo-texto mt-2"
              value={formulario.apoderado}
              onChange={actualizarCampo("apoderado")}
            />
          </div>
          <div className="rounded-2xl border border-[var(--borde)] bg-[var(--superficie-oscura)] p-4 text-sm text-[var(--texto-secundario)]">
            <p className="font-semibold text-[var(--texto)]">Validación</p>
            <p className="mt-2">Edad calculada: {edad || "-"}</p>
            <p className="mt-1">Condición: {esMenor ? "Menor de edad" : "Mayor de edad"}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[var(--primario)]"
              checked={formulario.autorizacionDatos}
              onChange={actualizarCampo("autorizacionDatos")}
            />
            Autorización para tratamiento de datos personales
          </label>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[var(--primario)]"
              checked={formulario.autorizacionContacto}
              onChange={actualizarCampo("autorizacionContacto")}
            />
            Autorización para contacto y seguimiento psicológico
          </label>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button className="boton-principal" type="submit">
          Guardar
        </button>
        <button className="boton-secundario" type="button" onClick={() => navigate("/usuarios")}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default FormularioUsuario;

