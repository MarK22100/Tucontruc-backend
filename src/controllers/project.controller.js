import { pool } from "../config/db.js";

export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const [result] = await pool.execute(
      "INSERT INTO projects (name, description) VALUES (?, ?)",
      [name, description]
    );

    res.status(201).json({ id: result.insertId, name, description });
  } catch (err) {
    res.status(500).json({ error: "Error al crear proyecto" });
  }
};
// READ ALL + MATERIALS
export const getProjects = async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT
        p.id AS project_id,
        p.name AS project_name,
        p.description,

        pm.material_id,
        pm.quantity AS assigned_quantity,

        m.name AS material_name,
        m.unit
      FROM projects p
      LEFT JOIN project_materials pm 
        ON pm.project_id = p.id
      LEFT JOIN materials m 
        ON m.id = pm.material_id
      ORDER BY p.id
    `);

    const projects = {};

    rows.forEach(row => {
      if (!projects[row.project_id]) {
        projects[row.project_id] = {
          id: row.project_id,
          name: row.project_name,
          description: row.description,
          materials: []
        };
      }

      if (row.material_id) {
        projects[row.project_id].materials.push({
          id: row.material_id,
          name: row.material_name,
          quantity: row.assigned_quantity,
          unit: row.unit
        });
      }
    });

    res.json(Object.values(projects));

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener proyectos" });
  }
};

// UPDATE
export const updateProject = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    await pool.execute(
      "UPDATE projects SET name = ?, description = ? WHERE id = ?",
      [name, description, id]
    );

    res.json({ message: "Proyecto actualizado" });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar proyecto" });
  }
};

// DELETE
export const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.execute("DELETE FROM projects WHERE id = ?", [id]);
    res.json({ message: "Proyecto eliminado" });
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar proyecto" });
  }
};