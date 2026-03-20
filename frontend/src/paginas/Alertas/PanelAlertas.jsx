import { toast } from "sonner";

function PanelAlertas() {
  const enviarAlertas = () => {
    toast.message("Este módulo se conectará cuando el servicio de alertas esté listo.");
  };

  return (
    <div className="grid gap-6">
      <section className="rounded-[28px] border border-[var(--borde)] bg-[var(--superficie)] p-6 sombra-suave">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--texto-secundario)]">Alertas</p>
            <h2 className="mt-2 text-2xl font-semibold text-[var(--texto)]">Reporte de usuarios en riesgo</h2>
          </div>
          <button className="boton-principal" type="button" onClick={enviarAlertas}>
            Enviar alertas
          </button>
        </div>
        <div className="mt-6 rounded-2xl border border-[var(--borde)] bg-[var(--superficie-oscura)] p-4 text-sm text-[var(--texto-secundario)]">
          Este módulo aún no tiene datos reales conectados.
        </div>
      </section>

      <section className="rounded-[28px] border border-[var(--borde)] bg-[var(--superficie)] p-6 sombra-suave">
        <h3 className="text-xl font-semibold text-[var(--texto)]">Estado de envío</h3>
        <div className="mt-4 rounded-2xl border border-[var(--borde)] bg-[var(--superficie-oscura)] p-4 text-sm text-[var(--texto-secundario)]">
          Sin registros recientes.
        </div>
      </section>
    </div>
  );
}

export default PanelAlertas;
