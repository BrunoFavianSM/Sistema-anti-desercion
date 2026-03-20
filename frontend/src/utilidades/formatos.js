export function formatearFechaLarga(fechaISO) {
  if (!fechaISO) return "";
  const fecha = new Date(`${fechaISO}T00:00:00`);
  return fecha.toLocaleDateString("es-PE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function formatearNumero(valor) {
  return new Intl.NumberFormat("es-PE").format(valor || 0);
}

export function formatearPorcentaje(valor) {
  return `${Math.round(valor || 0)}%`;
}
