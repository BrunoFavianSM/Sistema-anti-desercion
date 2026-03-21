import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "./db.js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", async (_req, res) => {
  res.json({ estado: "ok" });
});

app.post("/auth/login", async (req, res) => {
  try {
    const { correo, clave } = req.body || {};
    if (!correo || !clave) {
      return res.status(400).json({ error: "Correo y contraseña son obligatorios." });
    }

    const { rows } = await pool.query(
      "SELECT id, nombre, correo, password_hash, rol, activo FROM specialists WHERE correo = $1",
      [correo]
    );
    const usuario = rows[0];
    if (!usuario || !usuario.activo) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    const valido = await bcrypt.compare(clave, usuario.password_hash);
    if (!valido) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    const token = jwt.sign(
      { id: usuario.id, correo: usuario.correo, rol: usuario.rol },
      process.env.JWT_SECRET || "secreto"
    );

    return res.json({
      token,
      especialista: {
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error("Error en /auth/login:", error);
    return res.status(500).json({ error: "No se pudo iniciar sesión." });
  }
});

app.get("/api/usuarios", async (_req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT id, dni, nombres, apellidos, fecha_nacimiento, edad, genero, fecha_inscripcion, direccion, condicion, telefono, email
       FROM registro_usuarios
       ORDER BY id ASC`
    );
    res.json({ datos: rows });
  } catch (error) {
    res.status(500).json({ error: "No se pudo obtener usuarios." });
  }
});

app.get("/api/usuarios/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `SELECT id, dni, nombres, apellidos, fecha_nacimiento, edad, genero, fecha_inscripcion, direccion, condicion, telefono, email
       FROM registro_usuarios
       WHERE id = $1`,
      [id]
    );
    if (!rows[0]) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }
    return res.json({ dato: rows[0] });
  } catch (error) {
    return res.status(500).json({ error: "No se pudo obtener el usuario." });
  }
});

export default app;

