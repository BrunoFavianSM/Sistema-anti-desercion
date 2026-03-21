export const usuariosFalsos = [
  {
    uuid: "u-10293",
    nombre: "Valeria Núñez",
    dni: "73542198",
    edad: 17,
    estado: "En seguimiento",
    riesgo: 78,
    apoderado: "Carlos Núñez",
  },
  {
    uuid: "u-10294",
    nombre: "Jorge Salazar",
    dni: "46852014",
    edad: 19,
    estado: "Activo",
    riesgo: 34,
    apoderado: null,
  },
  {
    uuid: "u-10295",
    nombre: "Mariana Paredes",
    dni: "70611235",
    edad: 16,
    estado: "En riesgo",
    riesgo: 82,
    apoderado: "Luisa Paredes",
  },
];

export const talleresFalsos = [
  {
    id: "t-301",
    nombre: "Gestión del estrés académico",
    categoria: "Bienestar",
    cupo: 20,
    inscritos: 18,
    estado: "En curso",
    proximaSesion: "2026-03-22",
  },
  {
    id: "t-302",
    nombre: "Habilidades socioemocionales",
    categoria: "Habilidades",
    cupo: 25,
    inscritos: 25,
    estado: "Completo",
    proximaSesion: "2026-03-25",
  },
];

export const consultasFalsas = [
  {
    id: "c-991",
    paciente: "Valeria Núñez",
    fecha: "2026-03-21",
    hora: "09:30",
    estado: "Programada",
  },
  {
    id: "c-992",
    paciente: "Jorge Salazar",
    fecha: "2026-03-20",
    hora: "15:00",
    estado: "Completada",
  },
];

export const alertasFalsas = [
  {
    id: "a-200",
    paciente: "Mariana Paredes",
    score: 82,
    estado: "Pendiente",
  },
  {
    id: "a-201",
    paciente: "Valeria Núñez",
    score: 78,
    estado: "Enviado",
  },
];

export const resultadosMLFalsos = [
  { fecha: "2026-03-01", score: 40 },
  { fecha: "2026-03-08", score: 52 },
  { fecha: "2026-03-15", score: 65 },
  { fecha: "2026-03-18", score: 72 },
];

export const analiticaTalleresFalsa = [
  {
    id: "t-301",
    nombre: "Gestión del estrés académico",
    tasaDesercion: 28,
    sesiones: 5,
  },
  {
    id: "t-302",
    nombre: "Habilidades socioemocionales",
    tasaDesercion: 19,
    sesiones: 6,
  },
];

export const asistenciasFalsas = [
  { fecha: "2026-03-05", estado: "Asistió" },
  { fecha: "2026-03-12", estado: "Faltó" },
  { fecha: "2026-03-19", estado: "Asistió" },
];

