export function formatearFechaLarga(fechaISO) {
  if (!fechaISO) return "";

  let fecha = null;

  if (fechaISO instanceof Date) {
    fecha = fechaISO;
  } else if (typeof fechaISO === "string") {
    const cadena = fechaISO.trim();
    if (!cadena) return "";

    // Si ya viene con hora o zona, se parsea directo.
    if (cadena.includes("T") || cadena.includes("Z")) {
      fecha = new Date(cadena);
    } else {
      fecha = new Date(`${cadena}T00:00:00`);
    }
  } else {
    fecha = new Date(fechaISO);
  }

  if (!fecha || Number.isNaN(fecha.getTime())) {
    return "";
  }

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
