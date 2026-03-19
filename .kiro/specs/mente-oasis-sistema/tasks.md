# Plan de Implementación: Sistema Mente Oasis

## Descripción General

Implementación incremental del sistema completo: base de datos SQL Server, API FastAPI (Python), frontend ReactJS + TailwindCSS, motor ML Python y sistema de alertas WhatsApp. Cada tarea construye sobre la anterior, terminando con la integración completa del pipeline.

## Tareas

- [ ] 1. Configurar estructura del proyecto y base de datos
  - Crear estructura de directorios: `backend/`, `frontend/`, `ml/`, `etl/`
  - Definir y ejecutar scripts SQL para crear las tablas en SQL Server:
    - `personas_pii` (PII encriptado: nombres, apellidos, DNI, fecha_nacimiento, dirección, teléfono, email)
    - `personas` (id_persona UUID, categoria, estado, genero, condicion, fecha_inscripcion)
    - `apoderados` (datos del apoderado vinculados a id_persona)
    - `informacion_medica` (condicion_psicologica, medicamentos, alergias vinculados a id_persona)
    - `consentimientos` (id_persona, tipo, aceptado, fecha)
    - `talleres` (id_taller, nombre, fecha_inicio, fecha_fin, limite_usuarios, dias_horarios JSON)
    - `taller_alumnos` (id_taller, id_persona)
    - `asistencias_taller` (id_taller, id_persona, fecha_sesion, estado)
    - `consultas` (id_consulta, id_persona, fecha, hora_inicio, hora_fin, motivo, estado, created_at)
    - `scores_desercion` (id_persona, score, datos_insuficientes, calculado_at)
    - `alertas_whatsapp` (id_alerta, id_persona, enviado_at, estado_entrega, mensaje)
    - `audit_log` (evento, tabla_afectada, timestamp, detalle)
  - Configurar separación física: `personas_pii` en esquema `pii`, resto en esquema `app`
  - Configurar encriptación de columnas PII con SQL Server Always Encrypted o AES a nivel aplicación
  - _Requisitos: 1.1, 7.1, 7.4_

- [ ] 2. Implementar backend FastAPI — núcleo y autenticación
  - [ ] 2.1 Configurar proyecto FastAPI con dependencias
    - Inicializar proyecto con `pyproject.toml` o `requirements.txt`
    - Dependencias: `fastapi`, `uvicorn`, `pyodbc`/`sqlalchemy`, `cryptography`, `python-jose`, `passlib`
    - Configurar conexión a SQL Server con SQLAlchemy
    - Crear modelos Pydantic para todas las entidades
    - _Requisitos: 7.3_

  - [ ] 2.2 Implementar autenticación y control de acceso por rol Especialista
    - Endpoint `POST /auth/login` con JWT
    - Middleware de autenticación que restringe acceso a PII desencriptado
    - Log de auditoría para intentos de acceso no autorizados a esquema `pii`
    - _Requisitos: 7.3, 7.5_

  - [ ]* 2.3 Escribir tests unitarios para autenticación y control de acceso
    - Verificar que rutas protegidas retornan 401 sin token válido
    - Verificar que solo rol Especialista accede a endpoints PII
    - _Requisitos: 7.3, 7.5_

- [ ] 3. Implementar API — Registro de Personas
  - [ ] 3.1 Implementar endpoint `POST /personas` para registro completo
    - Generar UUID como id_persona automáticamente
    - Calcular edad a partir de fecha_nacimiento
    - Encriptar y almacenar PII en esquema `pii`
    - Almacenar información médica y datos de apoderado
    - Validar aceptación de ambos consentimientos antes de guardar
    - Validar unicidad de DNI (retornar error descriptivo si ya existe)
    - _Requisitos: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10_

  - [ ] 3.2 Implementar endpoints `GET /personas`, `GET /personas/{id}`, `PUT /personas/{id}`
    - Desencriptar PII solo para Especialista autenticado
    - _Requisitos: 1.3, 1.4, 7.3_

  - [ ]* 3.3 Escribir tests unitarios para registro de personas
    - Test: DNI duplicado retorna error
    - Test: registro sin consentimientos es bloqueado
    - Test: UUID generado es único
    - Test: edad calculada correctamente desde fecha_nacimiento
    - _Requisitos: 1.1, 1.8, 1.9, 1.10_

- [ ] 4. Implementar API — Gestión de Talleres y Asistencias
  - [ ] 4.1 Implementar endpoints CRUD para Talleres
    - `POST /talleres`, `GET /talleres`, `GET /talleres/{id}`, `PUT /talleres/{id}`
    - Validar que fecha_fin no sea anterior a fecha_inicio
    - _Requisitos: 2.1, 2.2_

  - [ ] 4.2 Implementar endpoints para asignación de alumnos y registro de asistencias
    - `POST /talleres/{id}/alumnos` — validar límite máximo y categoría de persona
    - `POST /talleres/{id}/asistencias` — registrar estado (Presente/Tardanza/Ausente) por sesión
    - Almacenar asistencias usando id_persona sin exponer PII
    - _Requisitos: 2.3, 2.4, 2.5, 2.6_

  - [ ]* 4.3 Escribir tests unitarios para talleres y asistencias
    - Test: asignación a taller lleno retorna error
    - Test: fecha_fin anterior a fecha_inicio retorna error de validación
    - Test: asistencia almacenada solo con id_persona (sin PII)
    - _Requisitos: 2.2, 2.4, 2.6_

- [ ] 5. Implementar API — Registro de Consultas
  - [ ] 5.1 Implementar endpoints CRUD para Consultas
    - `POST /consultas`, `GET /consultas`, `GET /consultas/{id}`, `PUT /consultas/{id}`
    - Validar que la persona tenga categoría "Paciente" o "Paciente y Alumno"
    - Registrar cambio de estado con timestamp
    - Almacenar usando id_persona sin exponer PII
    - _Requisitos: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ]* 5.2 Escribir tests unitarios para consultas
    - Test: cambio de estado registra timestamp
    - Test: consulta almacenada solo con id_persona
    - _Requisitos: 3.4, 3.5_

- [ ] 6. Checkpoint — Verificar núcleo del backend
  - Asegurarse de que todos los tests pasen. Consultar al usuario si surgen dudas.

- [ ] 7. Implementar pipeline ETL
  - [ ] 7.1 Implementar endpoint `POST /etl/upload` para recepción de archivos .xls/.csv
    - Validar formato de archivo en la API
    - _Requisitos: 4.1_

  - [ ] 7.2 Implementar script ETL de limpieza, anonimización e inserción
    - Limpiar y estandarizar datos del archivo
    - Asignar id_persona (UUID) a cada registro antes de insertar
    - Separar PII de datos de comportamiento al insertar
    - Registrar filas con error en log sin detener el proceso
    - Retornar resumen: registros insertados y registros con error
    - _Requisitos: 4.2, 4.3, 4.4, 4.5_

  - [ ]* 7.3 Escribir tests unitarios para el ETL
    - Test: filas con formato inválido se registran en log y no detienen el proceso
    - Test: PII queda separado de datos de comportamiento tras la inserción
    - Test: resumen retornado contiene conteos correctos
    - _Requisitos: 4.3, 4.4, 4.5_

  - [ ]* 7.4 Escribir property test para round-trip ETL
    - **Propiedad: Para todo registro válido procesado por el ETL, serializar e insertar en BD y luego leer produce un registro equivalente al original**
    - **Valida: Requisito 9.5**

- [ ] 8. Implementar Motor ML — Score de Deserción
  - [ ] 8.1 Implementar script Python `ml/score_desercion.py`
    - Leer datos de asistencias y consultas desde SQL Server usando solo id_persona (sin PII)
    - Calcular Score_Deserción (0–100) por id_persona basado en patrones de asistencia
    - Manejar caso de historial insuficiente: score nulo + flag "datos_insuficientes"
    - Generar resultado en formato JSON: `[{"id_persona": "...", "score": 85, "datos_insuficientes": false}]`
    - _Requisitos: 5.1, 5.2, 5.3, 5.4, 5.8_

  - [ ] 8.2 Implementar endpoints API para ejecución del Motor ML
    - `POST /ml/ejecutar` — disparo manual del motor ML
    - `GET /ml/scores` — obtener scores almacenados
    - `POST /ml/config-automatico` — configurar ejecución periódica (cron/scheduler)
    - Almacenar scores en BD y exponer al frontend
    - _Requisitos: 5.5, 5.6, 5.7_

  - [ ]* 8.3 Escribir tests unitarios para el Motor ML
    - Test: score generado está entre 0 y 100
    - Test: id_persona sin historial suficiente produce score nulo con flag correcto
    - Test: resultado JSON no contiene campos PII
    - _Requisitos: 5.2, 5.3, 5.8_

  - [ ]* 8.4 Escribir property test para round-trip JSON del Motor ML
    - **Propiedad: Para todo resultado JSON válido generado por el Motor ML, serializar y luego parsear produce un objeto equivalente al original**
    - **Valida: Requisito 9.3**

- [ ] 9. Implementar Sistema de Alertas WhatsApp
  - [ ] 9.1 Implementar integración con WhatsApp API
    - Servicio `whatsapp_service.py` que envía mensajes usando la API configurada
    - Registrar cada envío en BD: id_persona, timestamp, estado_entrega
    - Manejar errores de envío y retornar motivo del fallo
    - _Requisitos: 6.7, 6.8_

  - [ ] 9.2 Implementar endpoints para gestión de alertas
    - `POST /alertas/enviar` — envío manual a una persona seleccionada
    - `POST /alertas/config-automatico` — configurar envío automático por umbral de score
    - `GET /alertas/historial` — historial de mensajes enviados
    - _Requisitos: 6.4, 6.5_

  - [ ]* 9.3 Escribir tests unitarios para el sistema de alertas
    - Test: fallo de envío notifica al frontend con motivo del error
    - Test: envío registrado en BD con timestamp e id_persona
    - _Requisitos: 6.7, 6.8_

- [ ] 10. Checkpoint — Verificar pipeline completo backend + ML + alertas
  - Asegurarse de que todos los tests pasen. Consultar al usuario si surgen dudas.

- [ ] 11. Implementar Frontend ReactJS — Estructura base y autenticación
  - [ ] 11.1 Inicializar proyecto React con Vite + TailwindCSS + Framer Motion + Sonner
    - Configurar rutas con React Router
    - Configurar cliente HTTP (axios o fetch) con interceptor para JWT
    - Implementar pantalla de login y manejo de sesión
    - _Requisitos: 7.3_

  - [ ] 11.2 Implementar layout principal y navegación entre módulos
    - Sidebar/navbar con acceso a: Personas, Talleres, Consultas, ETL, Reportes ML, Alertas
    - _Requisitos: 6.1, 8.1_

- [ ] 12. Implementar Frontend — Módulo de Registro de Personas
  - [ ] 12.1 Implementar formulario de registro de Persona (multi-sección)
    - Sección: Información general (todos los campos del Requisito 1.5)
    - Sección: Información médica con toggles SI/NO y campos de descripción
    - Sección: Datos del apoderado
    - Sección: Consentimientos con checkboxes obligatorios
    - Bloquear envío si algún consentimiento no está marcado, mostrar mensaje descriptivo
    - Mostrar error si DNI ya existe
    - _Requisitos: 1.5, 1.6, 1.7, 1.8, 1.9, 1.10_

  - [ ] 12.2 Implementar listado y vista de detalle de Personas
    - Tabla con búsqueda/filtro por nombre, categoría y estado
    - Vista de detalle con historial de asistencias y consultas (Requisito 8.1)
    - Filtros por rango de fechas, categoría y nombre de taller
    - _Requisitos: 8.1, 8.3, 8.4_

- [ ] 13. Implementar Frontend — Módulo de Talleres y Consultas
  - [ ] 13.1 Implementar formulario de creación y edición de Talleres
    - Campos: nombre, fechas, límite de usuarios, días con horarios
    - Validación de fecha_fin > fecha_inicio en el cliente
    - Asignación de alumnos con validación de límite y categoría
    - Registro de asistencias por sesión (Presente/Tardanza/Ausente)
    - _Requisitos: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [ ] 13.2 Implementar módulo de Consultas
    - Formulario de agendamiento con selector de paciente, fecha, hora, motivo y estado
    - Cambio de estado de consulta con actualización en tiempo real
    - _Requisitos: 3.1, 3.2, 3.3_

- [ ] 14. Implementar Frontend — Módulo ETL, Reportes ML y Alertas
  - [ ] 14.1 Implementar pantalla de carga masiva ETL
    - Componente de upload para .xls/.csv
    - Mostrar resumen de resultado: registros insertados y errores
    - Mostrar mensaje de error descriptivo si el JSON recibido tiene estructura inesperada
    - _Requisitos: 4.1, 4.5, 9.6_

  - [ ] 14.2 Implementar reporte de deserción y panel de alertas
    - Tabla de personas con Score_Deserción filtrada por umbral configurable
    - Mostrar nombre, categoría y score por persona (solo para Especialista)
    - Botón de actualización manual del reporte
    - Indicación visible: "El score es orientativo y no reemplaza el criterio del Especialista"
    - Botón de envío manual de WhatsApp con editor de plantilla de mensaje
    - Configuración de umbral y envío automático
    - _Requisitos: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 7.6_

  - [ ] 14.3 Implementar métricas de deserción por Taller
    - Vista con porcentaje de alumnos que abandonaron cada taller
    - _Requisitos: 8.2_

  - [ ]* 14.4 Escribir tests de componentes React para parseo de JSON y manejo de errores
    - Test: JSON con estructura inesperada muestra mensaje de error sin romper la interfaz
    - Test: scores renderizados sin pérdida de precisión numérica
    - _Requisitos: 9.2, 9.6_

  - [ ]* 14.5 Escribir property test para round-trip JSON en el frontend
    - **Propiedad: Para todo JSON válido recibido de la API, parsear y renderizar el score produce el mismo valor numérico sin pérdida de precisión**
    - **Valida: Requisito 9.2**

- [ ] 15. Integración final y cableado del pipeline completo
  - [ ] 15.1 Conectar todos los módulos del frontend con los endpoints de la API
    - Verificar flujo completo: Registro → Asistencias → ETL → ML → Reporte → WhatsApp
    - _Requisitos: 5.5, 6.1, 9.1_

  - [ ] 15.2 Verificar separación PII en todo el pipeline
    - Confirmar que Motor ML y ETL nunca acceden a esquema `pii`
    - Confirmar que logs de auditoría registran intentos de acceso no autorizados
    - _Requisitos: 7.2, 7.4, 7.5_

  - [ ]* 15.3 Escribir tests de integración end-to-end
    - Test: flujo completo registro → score → alerta sin exponer PII al ML
    - Test: round-trip serialización API → frontend preserva datos
    - _Requisitos: 9.1, 9.3, 9.5_

- [ ] 16. Checkpoint final — Asegurarse de que todos los tests pasen
  - Verificar cobertura de todos los requisitos. Consultar al usuario si surgen dudas.

## Notas

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea referencia requisitos específicos para trazabilidad
- El Motor ML opera exclusivamente sobre `id_persona` — nunca sobre PII
- El despliegue inicial es local; la arquitectura debe ser agnóstica a infraestructura para facilitar migración futura a AWS
- Los property tests validan propiedades universales de round-trip y consistencia de datos
