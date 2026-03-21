# Sistema anti-deserción — Mente Oasis

Este repositorio contiene el avance actual del sistema **Mente Oasis**, con:

- **Frontend React (Vite + TailwindCSS)** en español.
- **Backend Node.js (Express)** con conexión a PostgreSQL.
- **Carga real de datos** desde Excel hacia PostgreSQL.
- **Login real** para personal administrativo.

---

## Resumen de lo implementado

- Base de datos PostgreSQL `mente_oasis` creada.
- Tabla **`registro_usuarios`** con datos importados desde el Excel.
- Backend Node.js con endpoints reales:
  - `GET /api/health`
  - `GET /api/usuarios`
  - `GET /api/usuarios/:id`
  - `POST /auth/login`
- Frontend React consume **datos reales** desde PostgreSQL (dashboard y usuarios).
- Login con usuario administrador.

---

## Estructura principal

```
backend/   # Node.js + Express + PostgreSQL
frontend/  # React + TailwindCSS
data/      # CSV generado desde Excel
```

---

## Requisitos

- Node.js 18+
- PostgreSQL 18
- psql disponible (ruta local usada):
  `C:\Program Files\PostgreSQL\18\bin\psql.exe`

---

## Variables de entorno

### Backend
Archivo: `backend/.env`
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mente_oasis
DB_USER=postgres
DB_PASSWORD="TU_PASSWORD"
JWT_SECRET=mente-oasis-secreto-2026
```

### Frontend
Archivo: `frontend/.env`
```
VITE_API_URL=http://localhost:3000
VITE_MODO_SIMULADO=false
```

---

## Credenciales administrativas

Usuario inicial:
- **Correo:** `admin@menteoasis.com`
- **Contraseña:** `admin123`

---

## Carga de datos (Excel → PostgreSQL)

El Excel usado:
`C:/Users/user/Downloads/Hoja de cálculo sin título.xlsx`

Se convirtió a CSV y se cargó en:
`data/usuarios.csv`

Tabla destino:
`registro_usuarios`

---

## Ejecutar el backend

```powershell
cd C:\Users\user\OneDrive\Escritorio\TESIS\Sistema-anti-desercion\backend
cmd /c npm install
cmd /c npm run dev
```

---

## Ejecutar el frontend

```powershell
cd C:\Users\user\OneDrive\Escritorio\TESIS\Sistema-anti-desercion\frontend
cmd /c npm install
cmd /c npm run dev
```

---

## Endpoints disponibles

- `POST /auth/login`
- `GET /api/health`
- `GET /api/usuarios`
- `GET /api/usuarios/:id`

---

## Notas importantes

- El DNI en el Excel está vacío en todas las filas, por eso se carga como `NULL`.
- Los módulos de **talleres, consultas, alertas, ML y analítica** están preparados pero no tienen datos reales conectados aún.
- Todos los textos y componentes están en **español latino**.

---

## Próximos pasos sugeridos

- Conectar datos reales para talleres, consultas y alertas.
- Crear reportes y dashboards con métricas reales.
- Agregar edición de registros (DNI, correo, etc.).

---

Cualquier ajuste adicional lo hacemos juntos.
