import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../config/jwt.js";

export const registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
      [email, hashedPassword, name]
    );

    res.status(201).json({ message: "Usuario creado", id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

export const getUsers = async (req, res) => {
  const [rows] = await pool.execute("SELECT id, email, name FROM users");
  res.json(rows);
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const user = rows[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
    });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};


export const getProfile = async (req, res) => {
  const userId = req.user.id;

  const [rows] = await pool.execute(
    "SELECT id, email, name FROM users WHERE id = ?",
    [userId]
  );

  res.json(rows[0]);
};


export const updateUser = async (req, res) => {
  const userId = req.user.id;
  const { name } = req.body;

  await pool.execute(
    "UPDATE users SET name = ? WHERE id = ?",
    [name, userId]
  );

  res.json({ message: "Usuario actualizado" });
};


export const deleteUser = async (req, res) => {
  const userId = req.user.id;

  await pool.execute(
    "DELETE FROM users WHERE id = ?",
    [userId]
  );

  res.json({ message: "Usuario eliminado" });
};