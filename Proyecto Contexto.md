# Sistema de Análisis Predictivo y Gestión - Mente Oasis

## Declaración de Nivel y Seguridad
Este es un proyecto de **Alto Nivel** en ingeniería de software y ciencia de datos. Debido a la naturaleza de la información tratada (**Salud Mental**), la **Seguridad y Protección de Datos Personales** no son opcionales, sino el pilar central del desarrollo. 

- **Anonimización Obligatoria:** Ningún proceso de Machine Learning o Big Data debe procesar DNI o nombres reales. Se utilizarán identificadores únicos (UUID/Internal ID).
- **Tratamiento de PII:** Los Datos de Identificación Personal (PII) deben estar encriptados en la base de datos (SQL Server) y solo serán visibles en la interfaz de gestión para el especialista autorizado.
- **Ética en IA:** El sistema detecta patrones de deserción para apoyar al humano, no para reemplazar el criterio clínico.

---
## 1. Contexto del Proyecto
Este sistema está diseñado para realizar un **análisis predictivo** orientado a evitar la deserción de pacientes (consultas psicológicas) y alumnos (talleres) en **Mente Oasis Servicios Psicológicos**. Combina la ingesta de datos históricos masivos con un sistema de gestión en tiempo real para un control preventivo y personalizado.

# <span style="color: red;">2. IMPORTANTE (AWS)</span>

Tener en cuenta que no esta confirmado al 100% si se trabajara con AWS así que por ahora lo de AWS se omitirá en la realización del proyecto hasta que se decida migrar el modelo de Big Data, Microsoft SQL y Machine Learning a AWS. Por ahora todo lo que se piensa subir en el AWS se trabajara en local desde el mismo dispositivo, asi mismo la API que conecta por ahora sera para local.

## 3. Arquitectura del Sistema
El sistema se compone de los siguientes elementos tecnológicos:

* **Interfaz (Frontend):** ReactJS con TailwindCSS para el diseño, Framer Motion para animaciones y Sonner/Sileo para notificaciones.
* **Gestión de Datos (Backend):** API RESTful (FastAPI o Node.js) que actúa como puente de comunicación.
* **Base de Datos:** Microsoft SQL Server para el almacenamiento relacional de pacientes, alumnos y asistencias.
* **Modelado de Datos (Big Data):** Procesos de carga y limpieza (ETL) para archivos externos (.xls, .csv).
* **Cerebro Predictivo (Machine Learning):** Scripts de Python que analizan patrones de comportamiento y generan *scores* de riesgo.
* **Comunicación:** Integración con WhatsApp API para alertas y motivación.

--- 

# 4. Flujo de trabajo del sistema

### A. Etapa de Ingesta y Gestión
El sistema permite dos formas de alimentar la base de datos:
1.  **Carga Masiva:** Subida de archivos externos (.xls, .csv) desde React hacia la API.
2.  **Sistema de Gestión Interna:** Registro directo de nuevos usuarios (DNI, Nombres, Género, etc.) y marcado de asistencias desde la interfaz.
    * *Nota:* El DNI se utiliza solo como identificador de registro; el sistema genera un `ID_Persona` único para el procesamiento anónimo.
    * *Nota:* La edad se calcula automáticamente en SQL mediante la fecha de nacimiento.

### Sistema de Gestion
Como algo complementario para facilitar el registro de asistencias se plaena integrar un sistema para registrar pacientes y alumnos (tambien puede ser registrado como "Paciente y Alumno", puede estar en ambos, culsultas y taller) el cual empezaria por el registro de datos 

#### Registro Pacientes
INFORMACIÓN DEL USUARIO
[
    nombres,
    apellidos,
    fecha de nacimiento,
    Edad (calculado automaticamente en base a la fecha de nacimiento),
    lugar de nacimiento,
    direccion,
    ciudad,
    provincia,
    telefono,
    dni,
    

    categoria (si es paciente, alumno o ambos),
    Estado (activo o inactivo),
    genero,
    condicion,
    fecha de inscripcion 
] 

INFORMACIÓN IMPORTANTE
[
    ¿Padece alguna condición psicológica o médica? En caso afirmativo, por favor especifique: SI/NO,
    ¿Está tomando algún medicamento? En caso afirmativo, por favor especifique: SI/NO,
    ¿Tiene alguna alergia? En caso afirmativo, por favor especifique: SI/NO,
]

INFORMACIÓN DEL PADRE, MADRE O APODERADO
[
    Nombre,
    Apellidos,
    Fecha de nacimiento,
    DNI,
    Dirección,
    Ciudad,
    Provincia,
    Teléfono,
    Email,

    Checkbox>
    - Autorizo al Servicio Psicológico Mente Oasis a utilizar mis datos personales conforme a la normativa de protección de datos vigente.
    - Acepto los términos y condiciones del establecimiento, incluidas las normas de comportamiento y las políticas de seguridad.
]

#### Creacion de Talleres
[
    Nombre del taller,
    Fecha Inicio,
    Fecha Finalizacion,
    Limite de usuarios,
    Dias de clases con hora de inicio y finalizacion
]

#### Creacion de Talleres: 
Registro de asistencias de sesiones terapeuticas o talleres (Separados). El Paciente/Alumno debe de estar inscrito en un taller para poder marcar su asistencia
- Esto tambien puede servir para enviar los datos de los pacientes directo a la base de datos.

#### Registro de asistencias talleres
[
    Asignar un Alumno o Paciente y Alumno para agregarlo al taller
    Registrar su asistencia deacuerdo al dia (Presente, Tardanza, Ausente)
]
- Esta parte es la que nos va a ayudar para el seguimiento y detectar posible desecion

#### Registro de Consultas
- Aqui se puede agendar una cita para consultas psicologicas
[
    Seleccionar paciente,
    Fecha,
    Hora inicio,
    Hora fin (opcional),
    Motivo,
    Estado de la Cita (Pendiente, confirmada, Completa, Cancelada)

]

- Esto puede ser complementario al sistema para evitar usar de forma frecuente hojas de excel o otro tipo de archivo, esto se almacenara en la base de datos para que directamente los puedan leer el big data o ML (dependiendo del caso).


## Almacenamiento en la nube (Leer seccion "IMPORTANTE (AWS)" antes de tomar en cuenta esto)
Una vez enviado los datos mediante la API se almacenaran en AWS donde se manejaran modelos de Big Data, Base de datos y modelo de Machine Learning

### B. Procesamiento y Modelado (Big Data)
Una vez el AWS reciba los datos pasaran a se procesados por el Modelo de Big data mediante un ETL para procesar, ordenar y cargar los datos subidos y tenerlos de una forma mas ordenada y usar herramientas de Business Inteligence

Una vez que los datos (externos o internos) llegan al servidor:
* Pasan por un proceso de limpieza para estandarizar formatos.
* Se almacenan en tablas relacionales de SQL Server.
* Se aplica **anonimización de datos** para proteger la privacidad del paciente antes de enviarlos al modelo de ML.


## Alamacenamiento de datos
Una vez el modelo de Big Data procese los datos se almacenaran en una base de datos relacional (Microsoft SQL) para tenerlos de una forma mas ordenada y usar herramientas de Business Inteligence y realizar consultas (esta sera la fuente donde se guradaran y se pediran los datos para consultas)

### C. Aprendizaje de Máquina (Machine Learning)
El modelo de ML extrae los datos procesados de SQL:
* **Análisis:** Evalúa patrones de asistencia independientes por usuario.
* **Resultado:** Genera un reporte de "Probabilidad de Deserción" (Score de 0 a 100%).
* **Ejecución:** Puede configurarse para correr automáticamente o ser disparado manualmente desde la interfaz de React.

Una vez procesados y ordenados los datos por el modelo de Big Data pasaran a ser procesados por el modelo de Machine Learning para analizar patrones, generar reportes y alertas

### Explicación del ML
EL ML obtiene los datos, los procesa, analiza patrones de asistencias a telleres y consultas (independientemente de cada usuario) aprende el comportamiento y genera un reporte de posibilidad de desercion dependiendo de cada usuario (cada alerta es idenpendiente para evitar perder al paciente o alumno [cuando menciono al usuario me refiero a ambos, paciente y alumno, no a un usuario de la interfaz]), una vez procesado generara un archivo JSON para ser enviado mediante la API Al react JS y se alamcearan los resultados en el SQL

## D. Sistema de Alertas y Retención
Una vez relizado todo este proceso se enviaran los resultados al ReactJS para ver los usuarios con posible decersion en un reporte generado (el reporte se actualizara cada cierto tiempo o cuando se desee) y se enviaran mensajes a traves de la API de Whatsapp para evitar la desercion (esi puede ser manual o automatico, el mensaje deberia de ser configurable o personalizado)

## Conclusion
Con esto se evitaria la desercion de los usuarios de meteoasis.

## 5. Explicación del Flujo Lógico

> **ReactJS** (Registro/Subida) $\rightarrow$ **API** $\rightarrow$ **SQL Server** (Almacenamiento y Edad) $\rightarrow$ **ML Python** (Análisis de Riesgo) $\rightarrow$ **API** $\rightarrow$ **ReactJS** (Alertas y WhatsApp)


## 6. Objetivos Adicionales
* **Seguimiento:** Interfaz para ver el progreso histórico de pacientes y alumnos.
* **Análisis de Talleres:** Identificar qué talleres tienen mayor deserción para mejorar su contenido o metodología.
* **Seguridad:** Implementar normas de protección de datos sensibles en el manejo de expedientes psicológicos.

## 7. Conclusión
La implementación de este sistema permitirá a **Mente Oasis** pasar de una gestión reactiva basada en archivos sueltos a una **gestión proactiva y basada en datos**, asegurando que ningún paciente o alumno abandone su proceso sin una intervención previa del especialista.

> **Nota de Implementación:** El despliegue inicial es **LOCAL**. La migración a la nube (AWS) es una fase posterior; por lo tanto, el sistema debe ser agnóstico a la infraestructura (fácil de migrar).
