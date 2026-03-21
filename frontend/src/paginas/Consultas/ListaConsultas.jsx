import { useState } from "react";

function ListaConsultas() {
  const [estado] = useState("todos");

  return (
    <div className="grid gap-6">
      <section className="rounded-[28px] border border-[var(--borde)] bg-[var(--superficie)] p-6 sombra-suave">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--texto-secundario)]">Consultas</p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--texto)]">Agenda clínica</h2>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <select className="campo-texto max-w-xs" value={estado} disabled>
            <option value="todos">Todos los estados</option>
          </select>
        </div>
        <div className="mt-6 rounded-2xl border border-[var(--borde)] bg-[var(--superficie-oscura)] p-4 text-sm text-[var(--texto-secundario)]">
          Este módulo aún no tiene datos reales conectados.
        </div>
      </section>
    </div>
  );
}

export default ListaConsultas;

