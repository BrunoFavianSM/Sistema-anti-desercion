import { useState } from "react";
import { toast } from "sonner";

function CargaETL() {
  const [archivo, setArchivo] = useState(null);
  const [resultado, setResultado] = useState(null);

  const manejarCarga = () => {
    if (!archivo) {
      toast.error("Selecciona un archivo para cargar.");
      return;
    }
    setResultado({
      totalProcesados: 120,
      totalCargados: 110,
      totalOmitidos: 10,
      errores: ["Fila 23: DNI vacío", "Fila 89: Fecha inválida"],
    });
    toast.success("Archivo procesado con éxito");
  };

  return (
    <div className="grid gap-6">
      <section className="rounded-[28px] border border-[var(--borde)] bg-[var(--superficie)] p-6 sombra-suave">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--texto-secundario)]">ETL</p>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--texto)]">Carga de datos</h2>
          <p className="mt-2 text-sm text-[var(--texto-secundario)]">
            Solo se aceptan archivos .xls o .csv sin datos personales.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <input
            type="file"
            className="campo-texto max-w-xs"
            onChange={(event) => setArchivo(event.target.files?.[0] || null)}
          />
          <button className="boton-principal" type="button" onClick={manejarCarga}>
            Procesar archivo
          </button>
        </div>
      </section>

      {resultado && (
        <section className="rounded-[28px] border border-[var(--borde)] bg-[var(--superficie)] p-6 sombra-suave">
          <h3 className="text-xl font-semibold text-[var(--texto)]">Resultado de la carga</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-[var(--borde)] bg-[var(--superficie-oscura)] p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--texto-secundario)]">Procesados</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--texto)]">{resultado.totalProcesados}</p>
            </div>
            <div className="rounded-2xl border border-[var(--borde)] bg-[var(--superficie-oscura)] p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--texto-secundario)]">Cargados</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--texto)]">{resultado.totalCargados}</p>
            </div>
            <div className="rounded-2xl border border-[var(--borde)] bg-[var(--superficie-oscura)] p-4">
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--texto-secundario)]">Omitidos</p>
              <p className="mt-2 text-2xl font-semibold text-[var(--texto)]">{resultado.totalOmitidos}</p>
            </div>
          </div>
          <div className="mt-4 rounded-2xl border border-[var(--borde)] bg-[var(--superficie-oscura)] p-4">
            <p className="text-sm font-semibold text-[var(--texto)]">Errores detectados</p>
            <ul className="mt-2 list-disc pl-5 text-sm text-[var(--texto-secundario)]">
              {resultado.errores.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}

export default CargaETL;

