import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

function FormularioTaller() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState({
    nombre: "",
    categoria: "Bienestar",
    cupo: 20,
    fechaInicio: "",
    fechaFin: "",
    descripcion: "",
  });

  const actualizarCampo = (campo) => (event) => {
    setFormulario((previo) => ({ ...previo, [campo]: event.target.value }));
  };

  const manejarEnvio = (event) => {
    event.preventDefault();
    if (!formulario.nombre || !formulario.fechaInicio || !formulario.fechaFin) {
      toast.error("Completa los campos obligatorios.");
      return;
    }
    toast.success(id ? "Taller actualizado" : "Taller creado");
    navigate("/talleres");
  };

  return (
    <form onSubmit={manejarEnvio} className="grid gap-6">
      <section className="rounded-[28px] border border-[var(--borde)] bg-[var(--superficie)] p-6 sombra-suave">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--texto-secundario)]">
            {id ? "Edición" : "Registro"}
          </p>
          <h2 className="text-2xl font-semibold text-[var(--texto)]">
            {id ? "Editar taller" : "Nuevo taller"}
          </h2>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold">Nombre del taller</label>
            <input className="campo-texto mt-2" value={formulario.nombre} onChange={actualizarCampo("nombre")} />
          </div>
          <div>
            <label className="text-sm font-semibold">Categoría</label>
            <select className="campo-texto mt-2" value={formulario.categoria} onChange={actualizarCampo("categoria")}>
              <option>Bienestar</option>
              <option>Habilidades</option>
              <option>Hábitos</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold">Cupo máximo</label>
            <input className="campo-texto mt-2" type="number" value={formulario.cupo} onChange={actualizarCampo("cupo")} />
          </div>
          <div>
            <label className="text-sm font-semibold">Fecha de inicio</label>
            <input className="campo-texto mt-2" type="date" value={formulario.fechaInicio} onChange={actualizarCampo("fechaInicio")} />
          </div>
          <div>
            <label className="text-sm font-semibold">Fecha de cierre</label>
            <input className="campo-texto mt-2" type="date" value={formulario.fechaFin} onChange={actualizarCampo("fechaFin")} />
          </div>
        </div>
        <div className="mt-4">
          <label className="text-sm font-semibold">Descripción</label>
          <textarea
            className="campo-texto mt-2 min-h-[120px]"
            value={formulario.descripcion}
            onChange={actualizarCampo("descripcion")}
          />
        </div>
      </section>
      <div className="flex flex-wrap gap-3">
        <button className="boton-principal" type="submit">
          Guardar
        </button>
        <button className="boton-secundario" type="button" onClick={() => navigate("/talleres")}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default FormularioTaller;

