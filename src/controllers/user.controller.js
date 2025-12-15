import { db } from "../config/db.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
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
  const [rows] = await db.execute("SELECT id, email, name FROM users");
  res.json(rows);
};