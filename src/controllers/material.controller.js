import { pool } from "../config/db.js";

export const createMaterial = async (req, res) => {
  const { name, unit } = req.body;

  const [result] = await pool.execute(
    "INSERT INTO materials (name, unit) VALUES (?, ?)",
    [name, unit]
  );

  res.status(201).json({ id: result.insertId });
};

export const getMaterials = async (req, res) => {
  const [rows] = await pool.execute("SELECT * FROM materials");
  res.json(rows);
};

export const updateMaterial = async (req, res) => {
  const { id } = req.params;
  const { name, unit } = req.body;

  await pool.execute(
    "UPDATE materials SET name = ?, unit = ? WHERE id = ?",
    [name, unit, id]
  );

  res.json({ message: "Material actualizado" });
};

export const deleteMaterial = async (req, res) => {
  const { id } = req.params;

  await pool.execute("DELETE FROM materials WHERE id = ?", [id]);

  res.json({ message: "Material eliminado" });
};
