function ListaTalleres() {
  return (
    <div className="grid gap-6">
      <section className="rounded-[28px] border border-[var(--borde)] bg-[var(--superficie)] p-6 sombra-suave">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--texto-secundario)]">Talleres</p>
          <h2 className="mt-2 text-2xl font-semibold text-[var(--texto)]">Lista de talleres</h2>
        </div>
        <div className="mt-6 rounded-2xl border border-[var(--borde)] bg-[var(--superficie-oscura)] p-4 text-sm text-[var(--texto-secundario)]">
          Este módulo aún no tiene datos reales conectados.
        </div>
      </section>
    </div>
  );
}

export default ListaTalleres;

