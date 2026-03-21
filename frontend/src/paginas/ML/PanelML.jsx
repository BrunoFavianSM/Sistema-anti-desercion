import { useState } from "react";
import { toast } from "sonner";

function PanelML() {
  const [intervalo, setIntervalo] = useState("7");

  const ejecutarAnalisis = () => {
    toast.message("Este módulo se conectará cuando el modelo ML está listo.");
  };

  return (
    <div className="grid gap-6">
      <section className="rounded-[28px] border border-[var(--borde)] bg-[var(--superficie)] p-6 sombra-suave">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--texto-secundario)]">Modelo ML</p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--texto)]">Ejecución predictiva</h2>
          </div>
          <button className="boton-principal" onClick={ejecutarAnalisis} type="button">
            Ejecutar análisis manual
          </button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-semibold">Intervalo automático (días)</label>
            <select
              className="campo-texto mt-2"
              value={intervalo}
              onChange={(event) => setIntervalo(event.target.value)}
            >
              <option value="3">Cada 3 días</option>
              <option value="7">Cada 7 días</option>
              <option value="14">Cada 14 días</option>
            </select>
          </div>
          <div className="rounded-2xl border border-[var(--borde)] bg-[var(--superficie-oscura)] p-4 text-sm text-[var(--texto-secundario)]">
            <p className="font-semibold text-[var(--texto)]">Estado del scheduler</p>
            <p className="mt-2">Aún no conectado</p>
            <p className="mt-1">Intervalo actual: {intervalo} días</p>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-[var(--borde)] bg-[var(--superficie)] p-6 sombra-suave">
        <h3 className="text-xl font-semibold text-[var(--texto)]">Historial de scores</h3>
        <div className="mt-4 rounded-2xl border border-[var(--borde)] bg-[var(--superficie-oscura)] p-4 text-sm text-[var(--texto-secundario)]">
          No hay resultados reales disponibles aún.
        </div>
      </section>
    </div>
  );
}

export default PanelML;

