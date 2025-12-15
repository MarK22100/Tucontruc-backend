import { pool } from "../config/db.js";

// CREATE
export const createMaterial = async (req, res) => {
  const { project_id, name, quantity, unit } = req.body;

  try {
    const [result] = await pool.execute(
      "INSERT INTO materials (project_id, name, quantity, unit) VALUES (?, ?, ?, ?)",
      [project_id, name, quantity, unit]
    );

    const material = {
      id: result.insertId,
      name,
      quantity,
      unit,
      project_id
    };


      res.status(201).json({
      message: "Material creado correctamente",
      material
    });
  } catch (err) {
    res.status(500).json({ error: "Error al crear material" });
  }
};

// READ BY PROJECT
export const getMaterialsByProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    const [materials] = await pool.execute(
      "SELECT * FROM materials WHERE project_id = ?",
      [projectId]
    );

    res.json(materials);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener materiales" });
  }
};

// UPDATE
export const updateMaterial = async (req, res) => {
  const { id } = req.params;
  const { name, quantity, unit } = req.body;

  try {
    await pool.execute(
      "UPDATE materials SET name = ?, quantity = ?, unit = ? WHERE id = ?",
      [name, quantity, unit, id]
    );

    res.json({ message: "Material actualizado" });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar material" });
  }
};

// DELETE
export const deleteMaterial = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.execute("DELETE FROM materials WHERE id = ?", [id]);
    res.json({ message: "Material eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar material" });
  }
};
