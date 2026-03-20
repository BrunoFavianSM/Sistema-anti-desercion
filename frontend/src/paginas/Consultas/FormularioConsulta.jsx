import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function FormularioConsulta() {
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState({
    paciente: "",
    fecha: "",
    horaInicio: "",
    horaFin: "",
    observaciones: "",
  });

  const actualizarCampo = (campo) => (event) => {
    setFormulario((previo) => ({ ...previo, [campo]: event.target.value }));
  };

  const manejarEnvio = (event) => {
    event.preventDefault();
    if (!formulario.paciente || !formulario.fecha || !formulario.horaInicio) {
      toast.error("Completa los campos obligatorios.");
      return;
    }
    if (formulario.horaFin && formulario.horaFin <= formulario.horaInicio) {
      toast.error("La hora de fin debe ser mayor a la hora de inicio.");
      return;
    }
    toast.success("Consulta registrada");
    navigate("/consultas");
  };

  return (
    <form onSubmit={manejarEnvio} className="grid gap-6">
      <section className="rounded-[28px] border border-[var(--borde)] bg-[var(--superficie)] p-6 sombra-suave">
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--texto-secundario)]">Agendamiento</p>
          <h2 className="text-2xl font-semibold text-[var(--texto)]">Nueva consulta</h2>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold">Paciente</label>
            <input className="campo-texto mt-2" value={formulario.paciente} onChange={actualizarCampo("paciente")} />
          </div>
          <div>
            <label className="text-sm font-semibold">Fecha</label>
            <input type="date" className="campo-texto mt-2" value={formulario.fecha} onChange={actualizarCampo("fecha")} />
          </div>
          <div>
            <label className="text-sm font-semibold">Hora inicio</label>
            <input type="time" className="campo-texto mt-2" value={formulario.horaInicio} onChange={actualizarCampo("horaInicio")} />
          </div>
          <div>
            <label className="text-sm font-semibold">Hora fin</label>
            <input type="time" className="campo-texto mt-2" value={formulario.horaFin} onChange={actualizarCampo("horaFin")} />
          </div>
        </div>
        <div className="mt-4">
          <label className="text-sm font-semibold">Observaciones</label>
          <textarea className="campo-texto mt-2 min-h-[120px]" value={formulario.observaciones} onChange={actualizarCampo("observaciones")} />
        </div>
      </section>
      <div className="flex flex-wrap gap-3">
        <button className="boton-principal" type="submit">
          Guardar
        </button>
        <button className="boton-secundario" type="button" onClick={() => navigate("/consultas")}>
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default FormularioConsulta;
