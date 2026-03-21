# Documento de Requisitos

## Introducción

El Sistema de Análisis Predictivo y Gestión "Mente Oasis" es una plataforma integral diseñada para **Mente Oasis Servicios Psicológicos**. Su objetivo principal es prevenir la deserción de pacientes (consultas psicológicas) y alumnos (talleres) mediante análisis predictivo basado en Machine Learning, combinado con un sistema de gestión interna en tiempo real.

El sistema opera inicialmente en entorno local y está diseñado para ser agnóstico a la infraestructura, permitiendo migración futura a la nube. La protección de datos personales y la ética en el uso de IA son pilares no negociables del diseño.

---

## Glosario

- **Sistema**: La plataforma completa "Mente Oasis" incluyendo frontend, backend, base de datos y módulos de ML.
- **API**: Interfaz RESTful (FastAPI o Node.js) que actúa como capa de comunicación entre el frontend y los servicios de backend.
- **Frontend**: Interfaz de usuario construida en ReactJS con TailwindCSS, Framer Motion y Sonner para notificaciones.
- **Base_de_Datos**: Instancia PostgreSQL que almacena todos los datos relacionales del sistema.
- **ETL**: Proceso de Extracción, Transformación y Carga para archivos externos (.xls, .csv).
- **Módulo_ML**: Scripts Python que analizan patrones de comportamiento y generan scores de riesgo de deserción.
- **Paciente**: Persona registrada en el sistema que asiste a consultas psicológicas.
- **Alumno**: Persona registrada en el sistema que participa en talleres.
- **Usuario**: Término genérico que engloba tanto a Pacientes como a Alumnos (o ambos simultáneamente).
- **Especialista**: Profesional autorizado de Mente Oasis con acceso a la interfaz de gestión.
- **Score_de_Deserción**: Valor numérico entre 0 y 100 que representa la probabilidad de que un Usuario abandone sus sesiones.
- **PII**: Información de Identificación Personal (nombres, DNI, fecha de nacimiento, dirección, teléfono, email).
- **UUID**: Identificador único universal utilizado para anonimizar registros en procesos de ML y Big Data.
- **Taller**: Actividad grupal con fechas definidas, límite de participantes y sesiones programadas.
- **Consulta**: Cita psicológica individual agendada entre un Paciente y un Especialista.
- **Apoderado**: Padre, madre o tutor legal de un Usuario menor de edad.
- **WhatsApp_API**: Servicio de mensajería utilizado para enviar alertas de retención a Usuarios.
- **Módulo_ETL**: Componente responsable de la limpieza, estandarización y carga de datos externos.

---

## Requisitos

### Requisito 1: Seguridad y Protección de Datos Personales

**User Story:** Como Especialista, quiero que los datos personales de mis pacientes y alumnos estén protegidos, para cumplir con las normativas de privacidad y mantener la confianza de los usuarios.

#### Criterios de Aceptación

1. THE Sistema SHALL encriptar todos los campos PII (nombres, apellidos, DNI, fecha de nacimiento, dirección, teléfono, email) en la Base_de_Datos utilizando encriptación AES-256.
2. THE Sistema SHALL generar un UUID único por cada Usuario en el momento del registro, desvinculado de cualquier PII.
3. WHEN el Módulo_ML o el Módulo_ETL procesen datos, THE Sistema SHALL utilizar exclusivamente el UUID del Usuario, sin incluir DNI, nombres ni apellidos.
4. WHEN un Especialista autenticado acceda al perfil de un Usuario, THE Sistema SHALL desencriptar y mostrar los campos PII únicamente en la interfaz de gestión autorizada.
5. IF un proceso no autorizado intenta acceder a campos PII, THEN THE Sistema SHALL denegar el acceso y registrar el intento en el log de auditoría.
6. THE Sistema SHALL mantener un log de auditoría con fecha, hora, acción y UUID del Especialista para toda operación de lectura o modificación de PII.

---

### Requisito 2: Autenticación y Control de Acceso

**User Story:** Como Especialista, quiero autenticarme de forma segura en el sistema, para garantizar que solo personal autorizado acceda a la información clínica.

#### Criterios de Aceptación

1. WHEN un Especialista ingresa credenciales válidas, THE Sistema SHALL autenticar la sesión y emitir un token JWT con expiración de 8 horas.
2. IF un Especialista ingresa credenciales inválidas 5 veces consecutivas, THEN THE Sistema SHALL bloquear la cuenta por 15 minutos y notificar al administrador.
3. WHEN el token JWT de un Especialista expire, THE Sistema SHALL redirigir al Especialista a la pantalla de inicio de sesión.
4. THE Sistema SHALL implementar roles de acceso diferenciados (Administrador, Especialista) con permisos específicos por módulo.

---

### Requisito 3: Registro y Gestión de Usuarios (Pacientes y Alumnos)

**User Story:** Como Especialista, quiero registrar y gestionar pacientes y alumnos desde la interfaz, para mantener un expediente digital centralizado y actualizado.

#### Criterios de Aceptación

1. WHEN un Especialista complete el formulario de registro con los campos obligatorios, THE Sistema SHALL crear un nuevo registro de Usuario en la Base_de_Datos y asignarle un UUID único.
2. THE Sistema SHALL calcular automáticamente la edad del Usuario a partir de la fecha de nacimiento registrada, actualizándola en cada acceso al perfil.
3. THE Sistema SHALL aceptar los siguientes campos de información del Usuario: nombres, apellidos, fecha de nacimiento, lugar de nacimiento, dirección, ciudad, provincia, teléfono, DNI, categoría (Paciente / Alumno / Ambos), estado (activo / inactivo), género, condición y fecha de inscripción.
4. THE Sistema SHALL aceptar los siguientes campos de información médica: indicador de condición psicológica o médica con campo de especificación, indicador de medicación actual con campo de especificación, e indicador de alergias con campo de especificación.
5. WHEN el Usuario registrado sea menor de edad, THE Sistema SHALL requerir los datos del Apoderado: nombre, apellidos, fecha de nacimiento, DNI, dirección, ciudad, provincia, teléfono y email.
6. WHEN el Usuario sea menor de edad, THE Sistema SHALL requerir la aceptación explícita de dos checkboxes de autorización por parte del Apoderado antes de completar el registro.
7. WHEN un Especialista actualice el estado de un Usuario a "inactivo", THE Sistema SHALL conservar el historial completo del Usuario en la Base_de_Datos sin eliminarlo.
8. IF un DNI ya existe en la Base_de_Datos, THEN THE Sistema SHALL mostrar un mensaje de error indicando que el Usuario ya se encuentra registrado.

---

### Requisito 4: Gestión de Talleres

**User Story:** Como Especialista, quiero crear y administrar talleres, para organizar las actividades grupales y controlar la capacidad y el calendario de sesiones.

#### Criterios de Aceptación

1. WHEN un Especialista complete el formulario de creación de taller, THE Sistema SHALL registrar el taller en la Base_de_Datos con: nombre, fecha de inicio, fecha de finalización, límite de participantes y días de sesión con hora de inicio y hora de finalización.
2. IF el número de Alumnos inscritos en un Taller alcanza el límite de participantes definido, THEN THE Sistema SHALL impedir nuevas inscripciones y notificar al Especialista.
3. WHEN un Especialista asigne un Usuario a un Taller, THE Sistema SHALL verificar que el Usuario tenga categoría "Alumno" o "Ambos" antes de confirmar la inscripción.
4. THE Sistema SHALL permitir al Especialista editar los datos de un Taller mientras la fecha de inicio no haya sido alcanzada.
5. WHEN la fecha de finalización de un Taller sea alcanzada, THE Sistema SHALL cambiar automáticamente el estado del Taller a "finalizado".

---

### Requisito 5: Registro de Asistencias a Talleres

**User Story:** Como Especialista, quiero registrar la asistencia de alumnos a cada sesión de taller, para obtener datos precisos que alimenten el análisis de deserción.

#### Criterios de Aceptación

1. WHEN un Especialista intente registrar asistencia de un Usuario a un Taller, THE Sistema SHALL verificar que el Usuario esté inscrito en dicho Taller antes de permitir el registro.
2. IF un Usuario no está inscrito en el Taller seleccionado, THEN THE Sistema SHALL mostrar un mensaje de error e impedir el registro de asistencia.
3. THE Sistema SHALL registrar el estado de asistencia por sesión con los valores: Presente, Tardanza o Ausente.
4. WHEN se registre una asistencia, THE Sistema SHALL almacenar el UUID del Usuario, el identificador del Taller, la fecha de la sesión y el estado de asistencia.
5. THE Sistema SHALL permitir al Especialista modificar un registro de asistencia dentro de las 24 horas siguientes a su creación.

---

### Requisito 6: Registro y Gestión de Consultas Psicológicas

**User Story:** Como Especialista, quiero agendar y gestionar consultas psicológicas, para reemplazar el uso de hojas de cálculo y centralizar el historial clínico en la base de datos.

#### Criterios de Aceptación

1. WHEN un Especialista complete el formulario de consulta, THE Sistema SHALL registrar la cita en la Base_de_Datos con: UUID del Paciente, fecha, hora de inicio, hora de fin (opcional), motivo y estado.
2. THE Sistema SHALL aceptar los siguientes estados de consulta: Pendiente, Confirmada, Completa y Cancelada.
3. WHEN un Especialista cambie el estado de una Consulta, THE Sistema SHALL registrar la fecha y hora del cambio de estado en el historial de la Consulta.
4. IF la hora de fin de una Consulta es anterior a la hora de inicio, THEN THE Sistema SHALL mostrar un error de validación e impedir el guardado.
5. THE Sistema SHALL permitir al Especialista filtrar las Consultas por estado, fecha y UUID del Paciente.

---

### Requisito 7: Carga Masiva de Datos Históricos (ETL)

**User Story:** Como Especialista, quiero cargar archivos históricos en formato .xls y .csv, para migrar datos existentes al sistema sin necesidad de ingreso manual.

#### Criterios de Aceptación

1. WHEN un Especialista suba un archivo .xls o .csv válido, THE Módulo_ETL SHALL procesar el archivo, estandarizar los formatos de fecha y texto, y cargar los registros en la Base_de_Datos.
2. IF el archivo subido contiene filas con campos obligatorios vacíos, THEN THE Módulo_ETL SHALL omitir dichas filas, registrarlas en un reporte de errores y continuar procesando las filas válidas.
3. WHEN el Módulo_ETL complete el procesamiento, THE Sistema SHALL mostrar al Especialista un resumen con: total de registros procesados, total de registros cargados exitosamente y total de registros omitidos con sus motivos.
4. THE Módulo_ETL SHALL anonimizar los datos antes de enviarlos al Módulo_ML, reemplazando PII por el UUID correspondiente.
5. IF el archivo subido no tiene el formato .xls o .csv, THEN THE Sistema SHALL rechazar el archivo y mostrar un mensaje de error indicando los formatos aceptados.

---

### Requisito 8: Análisis Predictivo de Deserción (Machine Learning)

**User Story:** Como Especialista, quiero que el sistema analice patrones de asistencia y genere scores de riesgo de deserción, para identificar proactivamente a los usuarios que necesitan intervención.

#### Criterios de Aceptación

1. WHEN el Módulo_ML ejecute un análisis, THE Módulo_ML SHALL evaluar los patrones de asistencia de cada Usuario de forma independiente y generar un Score_de_Deserción entre 0 y 100 para cada uno.
2. THE Módulo_ML SHALL procesar únicamente datos anonimizados identificados por UUID, sin acceder a ningún campo PII.
3. WHEN el análisis ML concluya, THE Módulo_ML SHALL generar un archivo JSON con los resultados y enviarlo a la API para su almacenamiento en la Base_de_Datos y visualización en el Frontend.
4. THE Sistema SHALL permitir al Especialista ejecutar el análisis ML de forma manual desde la interfaz del Frontend.
5. WHERE la ejecución automática esté habilitada, THE Sistema SHALL ejecutar el análisis ML según el intervalo de tiempo configurado por el Especialista.
6. THE Sistema SHALL almacenar el historial de resultados ML en la Base_de_Datos, incluyendo UUID del Usuario, Score_de_Deserción y fecha/hora del análisis.

---

### Requisito 9: Sistema de Alertas y Retención

**User Story:** Como Especialista, quiero recibir reportes de usuarios en riesgo de deserción y poder contactarlos vía WhatsApp, para intervenir a tiempo y retener a los pacientes y alumnos.

#### Criterios de Aceptación

1. THE Frontend SHALL mostrar un reporte de Usuarios con Score_de_Deserción superior al umbral configurado por el Especialista, ordenado de mayor a menor riesgo.
2. WHEN el Especialista actualice el reporte manualmente, THE Sistema SHALL consultar los últimos resultados almacenados en la Base_de_Datos y refrescar la vista en el Frontend.
3. WHERE la actualización automática esté habilitada, THE Sistema SHALL refrescar el reporte según el intervalo configurado por el Especialista.
4. WHEN el Especialista seleccione uno o más Usuarios del reporte y confirme el envío, THE Sistema SHALL enviar un mensaje personalizable a través de la WhatsApp_API al número de teléfono registrado de cada Usuario seleccionado.
5. THE Sistema SHALL permitir al Especialista configurar plantillas de mensajes de retención con variables dinámicas (nombre del Usuario, próxima sesión, etc.).
6. IF la WhatsApp_API devuelve un error al enviar un mensaje, THEN THE Sistema SHALL registrar el error, notificar al Especialista en la interfaz y no reintentar el envío de forma automática.
7. THE Sistema SHALL registrar en la Base_de_Datos cada mensaje enviado, incluyendo UUID del Usuario, fecha/hora de envío y estado de entrega reportado por la WhatsApp_API.

---

### Requisito 10: Seguimiento Histórico de Usuarios

**User Story:** Como Especialista, quiero visualizar el historial completo de asistencias, consultas y scores de deserción de cada usuario, para evaluar su progreso y tomar decisiones clínicas informadas.

#### Criterios de Aceptación

1. WHEN un Especialista acceda al perfil de un Usuario, THE Frontend SHALL mostrar el historial de asistencias a Talleres, el historial de Consultas y la evolución del Score_de_Deserción a lo largo del tiempo.
2. THE Frontend SHALL presentar la evolución del Score_de_Deserción en un gráfico de línea temporal con al menos los últimos 12 análisis registrados.
3. THE Sistema SHALL permitir al Especialista filtrar el historial por rango de fechas, tipo de actividad (Taller o Consulta) y estado de asistencia.

---

### Requisito 11: Análisis de Rendimiento de Talleres

**User Story:** Como Especialista, quiero identificar qué talleres presentan mayor índice de deserción, para mejorar su contenido, metodología o frecuencia.

#### Criterios de Aceptación

1. THE Frontend SHALL mostrar un reporte de Talleres ordenado por tasa de deserción promedio, calculada como el porcentaje de Alumnos con Score_de_Deserción superior al umbral configurado respecto al total de inscritos.
2. WHEN un Especialista seleccione un Taller del reporte, THE Frontend SHALL mostrar el detalle de asistencias por sesión y la distribución de scores de deserción de sus Alumnos.
3. THE Sistema SHALL incluir en el reporte de Talleres únicamente aquellos con al menos 3 sesiones registradas.

---

### Requisito 12: Agnóstico a la Infraestructura

**User Story:** Como administrador técnico, quiero que el sistema sea desplegable localmente y migrable a la nube sin cambios en el código de negocio, para garantizar flexibilidad operativa a largo plazo.

#### Criterios de Aceptación

1. THE Sistema SHALL externalizar toda configuración de conexión a la Base_de_Datos, rutas de API y credenciales de servicios externos en variables de entorno, sin valores hardcodeados en el código fuente.
2. THE Sistema SHALL incluir archivos de configuración de contenedores (Docker Compose) que permitan levantar todos los servicios del sistema en un entorno local con un único comando.
3. THE API SHALL exponer endpoints documentados mediante OpenAPI/Swagger para facilitar la integración con cualquier infraestructura de despliegue.

