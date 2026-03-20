# Plan de Implementación: Mente Oasis Sistema

## Descripción General

Implementación incremental de la plataforma "Mente Oasis" usando Node.js (JavaScript) en el backend, ReactJS + TailwindCSS en el frontend, PostgreSQL como base de datos y scikit-learn para el módulo ML. Cada tarea construye sobre la anterior, terminando con la integración completa de todos los componentes.

## Tareas

- [ ] 1. Configuración base del proyecto e infraestructura
  - Crear estructura de directorios `mente-oasis/` con `backend/`, `frontend/`, `etl/`, `ml/`
  - Crear `docker-compose.yml` con servicios: `postgres`, `backend`, `frontend`
  - Crear `.env.example` con todas las variables de entorno requeridas (`DATABASE_URL`, `ENCRYPTION_KEY`, `JWT_SECRET`, `WHATSAPP_API_TOKEN`, etc.)
  - Crear `backend/package.json` con dependencias: `express`, `cors`, `dotenv`, `pg`, `jsonwebtoken`, `bcryptjs`, `zod`, `axios`
  - Crear `backend/app/core/config.py` que cargue todas las variables de entorno con `pydantic-settings`
  - Crear `backend/src/app.js` con la instancia Express, configuración CORS y registro de routers
  - _Requisitos: 12.1, 12.2, 12.3_

- [ ] 2. Capa de seguridad: encriptación PII y JWT
  - [ ] 2.1 Implementar módulo de encriptación AES-256
    - Crear `backend/app/core/security.py` con funciones `encrypt_pii(value: str) -> bytes` y `decrypt_pii(encrypted: bytes) -> str` usando `cryptography.fernet.Fernet`
    - La clave debe leerse exclusivamente de la variable de entorno `ENCRYPTION_KEY`
    - _Requisitos: 1.1, 1.4_
  - [ ]* 2.2 Escribir test de propiedad para round-trip de encriptación PII
    - **Propiedad 1: Round-trip de encriptación PII**
    - **Valida: Requisitos 1.1, 1.4**
  - [ ] 2.3 Implementar generación y validación de tokens JWT
    - Agregar a `security.py` las funciones `create_access_token(data: dict) -> str` y `verify_token(token: str) -> dict` con expiración de 8 horas
    - _Requisitos: 2.1, 2.3_
  - [ ] 2.4 Implementar log de auditoría
    - Crear `backend/app/core/audit.py` con función `log_pii_access(db, specialist_id, accion, tabla, registro_uuid, ip)` que inserte en `AUDIT_LOG`
    - _Requisitos: 1.6_
  - [ ]* 2.5 Escribir test de propiedad para registro de auditoría
    - **Propiedad 5: Registro de auditoría por operación PII**
    - **Valida: Requisito 1.6**

- [ ] 3. Modelos de base de datos y migraciones
  - Crear `backend/app/models/` con modelos SQLAlchemy para todas las tablas del diagrama ER: `USERS`, `GUARDIANS`, `WORKSHOPS`, `WORKSHOP_SESSIONS`, `WORKSHOP_ENROLLMENTS`, `ATTENDANCE_RECORDS`, `CONSULTATIONS`, `CONSULTATION_STATUS_HISTORY`, `ML_RESULTS`, `ALERT_MESSAGES`, `ALERT_TEMPLATES`, `AUDIT_LOG`, `SPECIALISTS`
  - Los campos `*_enc` deben ser de tipo `LargeBinary` en SQLAlchemy
  - Crear `backend/app/database.py` con la configuración de sesión SQLAlchemy y función `get_db()`
  - Crear script `backend/app/init_db.py` que ejecute `Base.metadata.create_all()`
  - _Requisitos: 1.1, 1.2, 3.3, 3.4, 4.1, 5.4, 6.1, 8.6, 9.7_

- [ ] 4. Autenticación y control de acceso
  - [ ] 4.1 Implementar servicio de autenticación
    - Crear `backend/app/services/auth.py` con lógica de login: verificar credenciales, contar intentos fallidos, bloquear cuenta tras 5 intentos por 15 minutos, emitir JWT
    - Crear `backend/app/api/auth.py` con endpoints `POST /auth/login`, `POST /auth/logout`, `POST /auth/refresh`
    - Crear middleware de dependencia `get_current_specialist(token)` que valide JWT y retorne 401 si expirado
    - _Requisitos: 2.1, 2.2, 2.3, 2.4_
  - [ ]* 4.2 Escribir test de propiedad para bloqueo por intentos fallidos
    - **Propiedad 6: Bloqueo de cuenta por intentos fallidos**
    - **Valida: Requisito 2.2**
  - [ ]* 4.3 Escribir test de propiedad para denegación de acceso sin autenticación
    - **Propiedad 4: Denegación de acceso a PII sin autenticación**
    - **Valida: Requisitos 1.5, 2.4**

- [ ] 5. Checkpoint — Verificar que todos los tests pasen
  - Asegurarse de que todos los tests implementados hasta aquí pasen. Consultar al usuario si surgen dudas.

- [ ] 6. Gestión de usuarios (Pacientes y Alumnos)
  - [ ] 6.1 Implementar schemas Pydantic para usuarios
    - Crear `backend/app/schemas/users.py` con `UserCreate`, `UserUpdate`, `UserResponse` incluyendo todos los campos de los Requisitos 3.3 y 3.4
    - Agregar validación de menores de edad: si `fecha_nacimiento` indica menos de 18 años, los campos de apoderado y ambos checkboxes son obligatorios
    - _Requisitos: 3.3, 3.4, 3.5, 3.6_
  - [ ]* 6.2 Escribir test de propiedad para validación de menores de edad
    - **Propiedad 8: Validación de menores de edad**
    - **Valida: Requisitos 3.5, 3.6**
  - [ ] 6.3 Implementar servicio de usuarios
    - Crear `backend/app/services/users.py` con funciones: `create_user` (genera UUID, encripta PII, verifica DNI duplicado), `get_user` (desencripta PII), `update_user`, `deactivate_user` (conserva historial), `calculate_age`
    - _Requisitos: 1.2, 3.1, 3.2, 3.7, 3.8_
  - [ ]* 6.4 Escribir test de propiedad para unicidad de UUID
    - **Propiedad 2: Unicidad de UUID por usuario**
    - **Valida: Requisitos 1.2, 3.1**
  - [ ]* 6.5 Escribir test de propiedad para unicidad de DNI
    - **Propiedad 10: Unicidad de DNI**
    - **Valida: Requisito 3.8**
  - [ ]* 6.6 Escribir test de propiedad para round-trip de creación de usuario
    - **Propiedad 7: Round-trip de creación de usuario**
    - **Valida: Requisitos 3.1, 3.2, 3.3, 3.4**
  - [ ]* 6.7 Escribir test de propiedad para preservación de historial al desactivar
    - **Propiedad 9: Preservación de historial al desactivar usuario**
    - **Valida: Requisito 3.7**
  - [ ] 6.8 Crear router de usuarios
    - Crear `backend/app/api/users.py` con endpoints: `POST /users`, `GET /users/{uuid}`, `PUT /users/{uuid}`, `GET /users`, `GET /users/{uuid}/history`
    - Todos los endpoints que retornen PII deben llamar a `audit.log_pii_access()`
    - _Requisitos: 1.4, 1.6_

- [ ] 7. Gestión de talleres y asistencias
  - [ ] 7.1 Implementar servicio de talleres
    - Crear `backend/app/services/workshops.py` con: `create_workshop`, `edit_workshop` (valida que no haya iniciado), `enroll_user` (valida categoría y capacidad), `auto_close_workshop` (cambia estado a "finalizado" si fecha_fin alcanzada)
    - _Requisitos: 4.1, 4.2, 4.3, 4.4, 4.5_
  - [ ]* 7.2 Escribir test de propiedad para invariante de capacidad de taller
    - **Propiedad 11: Invariante de capacidad de taller**
    - **Valida: Requisito 4.2**
  - [ ]* 7.3 Escribir test de propiedad para validación de categoría en inscripción
    - **Propiedad 12: Validación de categoría para inscripción en taller**
    - **Valida: Requisito 4.3**
  - [ ]* 7.4 Escribir test de propiedad para ventana de edición de taller
    - **Propiedad 13: Ventana de edición de taller**
    - **Valida: Requisito 4.4**
  - [ ] 7.5 Implementar servicio de asistencias
    - Crear `backend/app/services/attendance.py` con: `register_attendance` (valida inscripción previa, valida estado), `modify_attendance` (valida ventana de 24h)
    - _Requisitos: 5.1, 5.2, 5.3, 5.4, 5.5_
  - [ ]* 7.6 Escribir test de propiedad para validación de inscripción previa
    - **Propiedad 14: Validación de inscripción previa para asistencia**
    - **Valida: Requisitos 5.1, 5.2**
  - [ ]* 7.7 Escribir test de propiedad para round-trip de registro de asistencia
    - **Propiedad 15: Round-trip de registro de asistencia**
    - **Valida: Requisitos 5.3, 5.4**
  - [ ]* 7.8 Escribir test de propiedad para ventana de modificación de asistencia
    - **Propiedad 16: Ventana de modificación de asistencia**
    - **Valida: Requisito 5.5**
  - [ ] 7.9 Crear routers de talleres y asistencias
    - Crear `backend/app/api/workshops.py` con todos los endpoints de talleres y asistencias definidos en el diseño
    - _Requisitos: 4.1–4.5, 5.1–5.5_

- [ ] 8. Gestión de consultas psicológicas
  - [ ] 8.1 Implementar servicio de consultas
    - Crear `backend/app/services/consultations.py` con: `create_consultation` (valida hora_fin > hora_inicio), `change_status` (registra entrada en `CONSULTATION_STATUS_HISTORY`), `list_consultations` (filtros por estado, fecha, uuid_paciente)
    - _Requisitos: 6.1, 6.2, 6.3, 6.4, 6.5_
  - [ ]* 8.2 Escribir test de propiedad para validación temporal de consultas
    - **Propiedad 17: Validación temporal de consultas**
    - **Valida: Requisito 6.4**
  - [ ]* 8.3 Escribir test de propiedad para historial de cambios de estado
    - **Propiedad 18: Registro de historial de cambios de estado de consulta**
    - **Valida: Requisito 6.3**
  - [ ]* 8.4 Escribir test de propiedad para consistencia de filtros
    - **Propiedad 19: Consistencia de filtros**
    - **Valida: Requisitos 6.5, 10.3**
  - [ ] 8.5 Crear router de consultas
    - Crear `backend/app/api/consultations.py` con endpoints: `POST /consultations`, `GET /consultations`, `PUT /consultations/{id}/status`
    - _Requisitos: 6.1–6.5_

- [ ] 9. Checkpoint — Verificar que todos los tests pasen
  - Asegurarse de que todos los tests implementados hasta aquí pasen. Consultar al usuario si surgen dudas.

- [ ] 10. Módulo ETL
  - [ ] 10.1 Implementar procesador ETL
    - Crear `backend/etl/processor.py` con función `process_file(filepath, db)` usando `pandas` y `openpyxl`
    - Validar extensión del archivo antes de procesar (rechazar si no es `.xls` o `.csv`)
    - Estandarizar formatos de fecha y texto; omitir filas con campos obligatorios vacíos registrándolas en reporte de errores
    - Anonimizar PII reemplazando por UUID antes de cualquier operación de persistencia
    - Retornar dict con `total_procesados`, `total_cargados`, `total_omitidos`, `errores`
    - _Requisitos: 7.1, 7.2, 7.3, 7.4, 7.5_
  - [ ]* 10.2 Escribir test de propiedad para consistencia aritmética del reporte ETL
    - **Propiedad 20: Consistencia aritmética del reporte ETL**
    - **Valida: Requisitos 7.1, 7.2, 7.3**
  - [ ]* 10.3 Escribir test de propiedad para rechazo de formatos inválidos
    - **Propiedad 21: Rechazo de formatos inválidos en ETL**
    - **Valida: Requisito 7.5**
  - [ ]* 10.4 Escribir test de propiedad para anonimización en ETL
    - **Propiedad 3: Anonimización en procesamiento ML/ETL**
    - **Valida: Requisitos 1.3, 7.4, 8.2**
  - [ ] 10.5 Crear router ETL
    - Crear `backend/app/api/etl.py` con endpoints: `POST /etl/upload` (acepta multipart/form-data), `GET /etl/jobs/{job_id}`
    - _Requisitos: 7.1–7.5_

- [ ] 11. Módulo ML de análisis predictivo de deserción
  - [ ] 11.1 Implementar modelo de deserción
    - Crear `backend/ml/desertion_model.py` con función `run_analysis(db) -> list[dict]`
    - El modelo debe operar exclusivamente sobre UUIDs y datos de asistencia (sin PII)
    - Generar `score_desercion` en rango [0, 100] para cada usuario usando `scikit-learn` (RandomForest o similar)
    - Persistir resultados en `ML_RESULTS` con UUID, score y timestamp
    - Retornar JSON con resultados para envío al frontend
    - _Requisitos: 8.1, 8.2, 8.3, 8.6_
  - [ ]* 11.2 Escribir test de propiedad para rango válido del score de deserción
    - **Propiedad 22: Rango válido del Score de Deserción**
    - **Valida: Requisito 8.1**
  - [ ]* 11.3 Escribir test de propiedad para round-trip de análisis ML
    - **Propiedad 23: Round-trip de análisis ML**
    - **Valida: Requisitos 8.3, 8.6**
  - [ ] 11.4 Crear router ML con soporte de ejecución manual y automática
    - Crear `backend/app/api/ml.py` con endpoints: `POST /ml/run`, `GET /ml/results`, `GET /ml/config`, `PUT /ml/config`
    - Implementar scheduler (APScheduler) para ejecución automática según intervalo configurado
    - _Requisitos: 8.4, 8.5_

- [ ] 12. Sistema de alertas y retención
  - [ ] 12.1 Implementar servicio de alertas
    - Crear `backend/app/services/alerts.py` con: `get_risk_report(db, threshold)` (filtra usuarios por score >= umbral, ordenado desc), `render_template(template, user_data)` (reemplaza variables dinámicas), `send_whatsapp(db, user_ids, template_id)` (llama a WhatsApp API, registra resultado, no reintenta en error)
    - _Requisitos: 9.1, 9.4, 9.5, 9.6, 9.7_
  - [ ]* 12.2 Escribir test de propiedad para filtrado por umbral en reporte de riesgo
    - **Propiedad 24: Filtrado por umbral en reporte de riesgo**
    - **Valida: Requisito 9.1**
  - [ ]* 12.3 Escribir test de propiedad para renderizado de plantillas con variables dinámicas
    - **Propiedad 27: Renderizado de plantillas con variables dinámicas**
    - **Valida: Requisito 9.5**
  - [ ]* 12.4 Escribir test de propiedad para round-trip de envío de alertas
    - **Propiedad 25: Round-trip de envío de alertas WhatsApp**
    - **Valida: Requisitos 9.4, 9.7**
  - [ ]* 12.5 Escribir test de propiedad para manejo de errores de WhatsApp API
    - **Propiedad 26: Manejo de errores de WhatsApp API**
    - **Valida: Requisito 9.6**
  - [ ] 12.6 Crear router de alertas
    - Crear `backend/app/api/alerts.py` con endpoints: `GET /alerts/report`, `POST /alerts/send`, `GET /alerts/templates`, `POST /alerts/templates`
    - _Requisitos: 9.1–9.7_

- [ ] 13. Historial de usuarios y análisis de talleres
  - [ ] 13.1 Implementar endpoint de historial de usuario
    - En `services/users.py`, agregar `get_user_history(db, uuid)` que retorne asistencias, consultas y los últimos `min(N, 12)` scores ML
    - _Requisitos: 10.1, 10.2, 10.3_
  - [ ]* 13.2 Escribir test de propiedad para límite de historial de scores
    - **Propiedad 28: Límite de historial de scores en perfil**
    - **Valida: Requisito 10.2**
  - [ ] 13.3 Implementar reporte de talleres por tasa de deserción
    - En `services/workshops.py`, agregar `get_workshops_analytics(db, threshold)` que calcule tasa de deserción por taller (solo talleres con >= 3 sesiones), ordenado de mayor a menor
    - Agregar `get_workshop_detail_analytics(db, workshop_id)` con detalle de asistencias y distribución de scores
    - _Requisitos: 11.1, 11.2, 11.3_
  - [ ]* 13.4 Escribir test de propiedad para ordenamiento del reporte de talleres
    - **Propiedad 29: Ordenamiento del reporte de talleres por deserción**
    - **Valida: Requisitos 11.1, 11.3**
  - [ ] 13.5 Crear routers de analytics
    - Agregar a `backend/app/api/workshops.py` los endpoints: `GET /workshops/analytics`, `GET /workshops/{id}/analytics`
    - _Requisitos: 11.1–11.3_

- [ ] 14. Checkpoint — Verificar que todos los tests del backend pasen
  - Asegurarse de que todos los tests pasen con cobertura mínima: backend 80%, ML 90%, ETL 85%. Consultar al usuario si surgen dudas.

- [ ] 15. Frontend: configuración base y autenticación
  - Inicializar proyecto React con Vite + TailwindCSS en `frontend/`
  - Instalar dependencias: `axios`, `react-router-dom`, `zustand`, `framer-motion`, `sonner`, `recharts`
  - Crear `frontend/src/services/api.js` con instancia axios configurada con `baseURL` desde variable de entorno y interceptor para adjuntar JWT
  - Crear `frontend/src/pages/Login.jsx` con formulario de autenticación que llame a `POST /auth/login` y almacene el token en Zustand
  - Implementar redirección automática a login cuando el token expire (interceptor de respuesta 401)
  - _Requisitos: 2.1, 2.3_

- [ ] 16. Frontend: gestión de usuarios
  - Crear `frontend/src/pages/Users/` con vistas: lista de usuarios, formulario de registro/edición, perfil de usuario
  - El formulario de registro debe mostrar campos de apoderado y checkboxes de autorización condicionalmente si el usuario es menor de edad
  - Mostrar notificaciones toast con Sonner para errores de validación (DNI duplicado, campos faltantes, etc.)
  - _Requisitos: 3.1–3.8_

- [ ] 17. Frontend: gestión de talleres y asistencias
  - Crear `frontend/src/pages/Workshops/` con vistas: lista de talleres, formulario de creación/edición, detalle de taller con lista de inscritos y registro de asistencia por sesión
  - Deshabilitar edición de taller si ya inició; mostrar error de capacidad si taller lleno
  - _Requisitos: 4.1–4.5, 5.1–5.5_

- [ ] 18. Frontend: consultas psicológicas
  - Crear `frontend/src/pages/Consultations/` con vistas: lista de consultas con filtros (estado, fecha, paciente), formulario de agendamiento, selector de estado con historial visible
  - _Requisitos: 6.1–6.5_

- [ ] 19. Frontend: ETL, ML y alertas
  - Crear `frontend/src/pages/ETL/` con componente de carga de archivo y tabla de resumen de resultados (procesados / cargados / omitidos)
  - Crear `frontend/src/pages/ML/` con botón de ejecución manual, configuración de intervalo automático y tabla de últimos resultados
  - Crear `frontend/src/pages/Alerts/` con reporte de usuarios en riesgo (configurable por umbral), selección múltiple, selector de plantilla, panel de estado de envío (no toast para errores WhatsApp)
  - _Requisitos: 7.1–7.5, 8.1–8.6, 9.1–9.7_

- [ ] 20. Frontend: historial de usuario y análisis de talleres
  - En el perfil de usuario, agregar sección de historial con tabs: Asistencias, Consultas, Score de Deserción
  - Implementar gráfico de línea temporal del score de deserción con `recharts` mostrando los últimos 12 análisis
  - Crear `frontend/src/pages/WorkshopAnalytics/` con reporte de talleres ordenado por tasa de deserción y vista de detalle por taller
  - _Requisitos: 10.1–10.3, 11.1–11.3_

- [ ] 21. Integración final y documentación OpenAPI
  - Registrar todos los routers en `backend/app/main.py` y verificar que la documentación Swagger (`/docs`) esté disponible y completa
  - Verificar que `docker-compose.yml` levante todos los servicios correctamente con un único comando
  - Verificar que ninguna credencial o configuración esté hardcodeada en el código fuente
  - _Requisitos: 12.1, 12.2, 12.3_

- [ ] 22. Checkpoint final — Verificar integración completa
  - Asegurarse de que todos los tests pasen, la documentación OpenAPI esté disponible y el sistema levante correctamente con Docker Compose. Consultar al usuario si surgen dudas.

## Notas

- Las tareas marcadas con `*` son opcionales y pueden omitirse para un MVP más rápido
- Cada tarea referencia requisitos específicos para trazabilidad
- Los tests de propiedades usan `hypothesis` con `@settings(max_examples=100)`
- Los tests de propiedades deben incluir el comentario: `# Feature: mente-oasis-sistema, Propiedad N: [Título]`
- El módulo ML y ETL nunca deben recibir campos PII; solo UUIDs y datos de comportamiento


