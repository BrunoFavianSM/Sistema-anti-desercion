# Documento de Requisitos

## Introducción

El Sistema de Análisis Predictivo y Gestión "Mente Oasis" es una plataforma integral diseñada para **Mente Oasis Servicios Psicológicos**. Su objetivo es transformar la gestión reactiva basada en archivos sueltos en una gestión proactiva y basada en datos, permitiendo detectar y prevenir la deserción de pacientes (consultas psicológicas) y alumnos (talleres) antes de que ocurra.

El sistema combina un módulo de gestión interna (registro, asistencias, consultas), un pipeline de Big Data/ETL para carga masiva, un motor de Machine Learning para scoring de riesgo de deserción, y un sistema de alertas vía WhatsApp. La seguridad y protección de datos sensibles de salud mental es el pilar central del diseño.

El despliegue inicial es **LOCAL**. La arquitectura debe ser agnóstica a la infraestructura para facilitar una futura migración a la nube.

---

## Glosario

- **Sistema**: La plataforma completa "Mente Oasis" (frontend + backend + ML).
- **API**: La capa de backend RESTful (FastAPI o Node.js) que actúa como puente entre el frontend, la base de datos y el motor ML.
- **Frontend**: La interfaz de usuario construida en ReactJS + TailwindCSS.
- **BD**: La base de datos Microsoft SQL Server.
- **Motor_ML**: Los scripts Python que calculan el score de riesgo de deserción.
- **ETL**: El proceso de extracción, transformación y carga de archivos externos (.xls/.csv).
- **Persona**: Cualquier individuo registrado en el sistema (paciente, alumno o ambos).
- **ID_Persona**: Identificador único (UUID) generado por el sistema para procesamiento anónimo. Nunca expone DNI ni nombre real.
- **PII**: Datos de Identificación Personal (nombres, apellidos, DNI, fecha de nacimiento, dirección, teléfono, email).
- **Score_Deserción**: Valor numérico entre 0 y 100 que representa la probabilidad de que una Persona abandone sus consultas o taller.
- **Apoderado**: Padre, madre o tutor legal de una Persona menor de edad.
- **Taller**: Actividad grupal con sesiones programadas a la que se inscriben Alumnos.
- **Consulta**: Cita individual de atención psicológica agendada para un Paciente.
- **Especialista**: Usuario autorizado del sistema (psicólogo/coordinador) con acceso a PII.
- **WhatsApp_API**: Servicio de mensajería utilizado para enviar alertas de retención.

---

## Requisitos

### Requisito 1: Registro de Personas

**User Story:** Como Especialista, quiero registrar pacientes y alumnos con su información completa, para tener un expediente centralizado y evitar el uso de archivos dispersos.

#### Criterios de Aceptación

1. THE Sistema SHALL generar un ID_Persona único (UUID) para cada Persona registrada, independiente del DNI.
2. WHEN el Especialista ingresa la fecha de nacimiento de una Persona, THE Sistema SHALL calcular y almacenar la edad automáticamente.
3. THE Sistema SHALL permitir asignar a una Persona una categoría de entre: "Paciente", "Alumno" o "Paciente y Alumno".
4. THE Sistema SHALL permitir asignar a una Persona un estado de entre: "Activo" o "Inactivo".
5. THE Sistema SHALL registrar los siguientes campos de información general de la Persona: nombres, apellidos, fecha de nacimiento, edad (calculada), lugar de nacimiento, dirección, ciudad, provincia, teléfono, DNI, categoría, estado, género, condición y fecha de inscripción.
6. THE Sistema SHALL registrar la información médica de la Persona: condición psicológica o médica (con descripción opcional), medicamentos actuales (con descripción opcional) y alergias (con descripción opcional).
7. THE Sistema SHALL registrar la información del Apoderado de la Persona: nombre, apellidos, fecha de nacimiento, DNI, dirección, ciudad, provincia, teléfono y email.
8. THE Sistema SHALL requerir la aceptación explícita de dos consentimientos antes de completar el registro: autorización de uso de datos personales conforme a normativa vigente, y aceptación de términos y condiciones del establecimiento.
9. IF el Especialista intenta completar el registro sin aceptar ambos consentimientos, THEN THE Sistema SHALL bloquear el guardado y mostrar un mensaje indicando los consentimientos pendientes.
10. IF el Especialista intenta registrar una Persona con un DNI ya existente en la BD, THEN THE Sistema SHALL mostrar un mensaje de error indicando que el DNI ya está registrado.

---

### Requisito 2: Gestión de Talleres

**User Story:** Como Especialista, quiero crear y administrar talleres con sus sesiones programadas, para organizar las actividades grupales y controlar la asistencia.

#### Criterios de Aceptación

1. THE Sistema SHALL permitir crear un Taller con los siguientes campos: nombre, fecha de inicio, fecha de finalización, límite máximo de usuarios y días de clase con hora de inicio y hora de finalización por cada día.
2. IF la fecha de finalización de un Taller es anterior a su fecha de inicio, THEN THE Sistema SHALL mostrar un error de validación y no permitir guardar el Taller.
3. THE Sistema SHALL permitir asignar una Persona con categoría "Alumno" o "Paciente y Alumno" a un Taller existente.
4. IF el Especialista intenta asignar una Persona a un Taller que ya alcanzó su límite máximo de usuarios, THEN THE Sistema SHALL mostrar un mensaje de error indicando que el Taller está lleno.
5. WHEN una Persona está asignada a un Taller, THE Sistema SHALL permitir registrar su asistencia por cada sesión programada con uno de los estados: "Presente", "Tardanza" o "Ausente".
6. THE Sistema SHALL almacenar cada registro de asistencia en la BD asociado al ID_Persona y al identificador del Taller, sin exponer PII al Motor_ML.

---

### Requisito 3: Registro de Consultas

**User Story:** Como Especialista, quiero agendar y gestionar citas de consulta psicológica, para reemplazar el uso de hojas de cálculo y tener un historial centralizado.

#### Criterios de Aceptación

1. THE Sistema SHALL permitir agendar una Consulta seleccionando una Persona con categoría "Paciente" o "Paciente y Alumno", una fecha, hora de inicio, motivo y estado inicial.
2. THE Sistema SHALL permitir registrar una hora de fin opcional para la Consulta.
3. THE Sistema SHALL permitir asignar a una Consulta uno de los siguientes estados: "Pendiente", "Confirmada", "Completa" o "Cancelada".
4. WHEN el estado de una Consulta cambia, THE Sistema SHALL registrar el cambio en la BD con la marca de tiempo correspondiente.
5. THE Sistema SHALL almacenar cada Consulta en la BD asociada al ID_Persona, sin exponer PII al Motor_ML.

---

### Requisito 4: Carga Masiva de Datos (ETL)

**User Story:** Como Especialista, quiero cargar archivos históricos en formato .xls o .csv, para migrar datos existentes al sistema sin ingreso manual registro por registro.

#### Criterios de Aceptación

1. THE Sistema SHALL aceptar la carga de archivos en formato .xls y .csv desde el Frontend hacia la API.
2. WHEN un archivo es recibido por la API, THE ETL SHALL limpiar y estandarizar los datos antes de insertarlos en la BD.
3. WHEN el ETL procesa un archivo, THE ETL SHALL aplicar anonimización asignando un ID_Persona a cada registro antes de almacenarlo, de modo que el PII quede separado del identificador de procesamiento.
4. IF un archivo cargado contiene filas con formato inválido o campos obligatorios faltantes, THEN THE ETL SHALL registrar cada fila con error en un log de errores y continuar procesando las filas válidas restantes.
5. WHEN el proceso ETL finaliza, THE API SHALL retornar al Frontend un resumen con el número de registros insertados correctamente y el número de registros con error.

---

### Requisito 5: Motor de Machine Learning — Score de Deserción

**User Story:** Como Especialista, quiero que el sistema calcule automáticamente un score de riesgo de deserción por persona, para identificar proactivamente quién necesita intervención.

#### Criterios de Aceptación

1. THE Motor_ML SHALL analizar los patrones de asistencia a Talleres y Consultas de forma independiente por cada ID_Persona.
2. THE Motor_ML SHALL generar un Score_Deserción entre 0 y 100 para cada ID_Persona procesada, donde 0 representa riesgo nulo y 100 representa riesgo máximo.
3. THE Motor_ML SHALL procesar únicamente datos identificados por ID_Persona, sin acceder a campos PII como DNI, nombres, apellidos o fecha de nacimiento.
4. WHEN el Motor_ML completa el análisis, THE Motor_ML SHALL generar un resultado en formato JSON con el ID_Persona y su Score_Deserción correspondiente.
5. WHEN el Motor_ML genera el resultado JSON, THE API SHALL almacenar los scores en la BD y enviarlos al Frontend.
6. THE Sistema SHALL permitir al Especialista ejecutar el Motor_ML manualmente desde el Frontend.
7. THE Sistema SHALL permitir configurar la ejecución automática periódica del Motor_ML.
8. IF el Motor_ML encuentra un ID_Persona sin historial de asistencia suficiente para calcular un score, THEN THE Motor_ML SHALL registrar ese ID_Persona con un score nulo y una indicación de "datos insuficientes" en el resultado JSON.

---

### Requisito 6: Sistema de Alertas y Retención

**User Story:** Como Especialista, quiero recibir reportes de personas en riesgo de deserción y poder enviarles mensajes de WhatsApp, para intervenir antes de que abandonen su proceso.

#### Criterios de Aceptación

1. THE Frontend SHALL mostrar un reporte actualizable con la lista de Personas cuyo Score_Deserción supera un umbral configurable por el Especialista.
2. THE Sistema SHALL mostrar en el reporte el nombre de la Persona, su categoría (Paciente/Alumno/ambos) y su Score_Deserción, visible únicamente para el Especialista autorizado.
3. THE Sistema SHALL permitir al Especialista actualizar el reporte de deserción manualmente en cualquier momento.
4. THE Sistema SHALL permitir enviar un mensaje de WhatsApp a una Persona en riesgo de forma manual, seleccionándola desde el reporte.
5. THE Sistema SHALL permitir configurar el envío automático de mensajes de WhatsApp cuando el Score_Deserción de una Persona supere el umbral definido.
6. THE Sistema SHALL permitir al Especialista personalizar la plantilla del mensaje de WhatsApp antes de enviarlo.
7. WHEN un mensaje de WhatsApp es enviado, THE WhatsApp_API SHALL registrar el envío en la BD con la marca de tiempo, el ID_Persona destinatario y el estado de entrega.
8. IF el envío de un mensaje de WhatsApp falla, THEN THE Sistema SHALL notificar al Especialista en el Frontend con el motivo del error.

---

### Requisito 7: Seguridad y Protección de Datos (PII)

**User Story:** Como Especialista, quiero que los datos sensibles de salud mental estén protegidos y anonimizados, para cumplir con la normativa de protección de datos y garantizar la ética en el uso de IA.

#### Criterios de Aceptación

1. THE BD SHALL almacenar todos los campos PII (nombres, apellidos, DNI, fecha de nacimiento, dirección, teléfono, email) en formato encriptado.
2. THE Motor_ML SHALL operar exclusivamente sobre ID_Persona y datos de comportamiento (asistencias, fechas de sesión), sin acceso a ningún campo PII.
3. THE Sistema SHALL restringir la visualización de PII desencriptado únicamente a usuarios con rol de Especialista autenticado.
4. THE Sistema SHALL mantener una separación física en la BD entre la tabla de PII encriptado y las tablas de datos de comportamiento usadas por el Motor_ML.
5. IF un proceso no autorizado intenta acceder a la tabla de PII, THEN THE BD SHALL denegar el acceso y THE API SHALL registrar el intento en un log de auditoría.
6. THE Sistema SHALL presentar los resultados del Motor_ML como apoyo a la decisión clínica, incluyendo en el Frontend una indicación visible de que el score es orientativo y no reemplaza el criterio del Especialista.

---

### Requisito 8: Seguimiento Histórico y Análisis de Talleres

**User Story:** Como Especialista, quiero visualizar el historial de progreso de cada persona y analizar qué talleres tienen mayor deserción, para tomar decisiones informadas sobre la metodología y el contenido.

#### Criterios de Aceptación

1. THE Frontend SHALL mostrar una vista de historial por Persona con el registro cronológico de sus asistencias a Talleres y Consultas.
2. THE Frontend SHALL mostrar métricas de deserción agregadas por Taller, incluyendo el porcentaje de alumnos que abandonaron cada Taller.
3. THE Sistema SHALL permitir al Especialista filtrar el historial por rango de fechas, categoría de Persona y nombre de Taller.
4. WHEN se consulta el historial de una Persona, THE Sistema SHALL recuperar los datos desde la BD usando el ID_Persona y resolver el nombre real únicamente para la visualización en el Frontend para el Especialista autorizado.

---

### Requisito 9: Serialización y Parseo de Datos (Round-Trip)

**User Story:** Como desarrollador, quiero que los datos intercambiados entre el Motor_ML, la API y el Frontend sean serializados y parseados de forma confiable, para evitar pérdida o corrupción de información en el pipeline.

#### Criterios de Aceptación

1. THE API SHALL serializar los resultados del Motor_ML a formato JSON antes de enviarlos al Frontend.
2. THE Frontend SHALL parsear el JSON recibido de la API y renderizar los scores sin pérdida de precisión numérica.
3. FOR ALL resultados JSON válidos generados por el Motor_ML, serializar y luego parsear el resultado SHALL producir un objeto equivalente al original (propiedad round-trip).
4. THE ETL SHALL serializar los datos procesados a un formato estandarizado antes de insertarlos en la BD.
5. FOR ALL registros válidos procesados por el ETL, serializar y luego leer desde la BD SHALL producir un registro equivalente al original (propiedad round-trip).
6. IF el Frontend recibe un JSON con estructura inesperada o campos faltantes, THEN THE Frontend SHALL mostrar un mensaje de error descriptivo sin romper la interfaz.
