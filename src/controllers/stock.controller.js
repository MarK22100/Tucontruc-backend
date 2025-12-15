import { pool } from "../config/db.js";

/* ===============================
   CREAR MOVIMIENTO DE STOCK
================================ */
export const createStockMovement = async (req, res) => {
  const { material_id, quantity, type, reason, project_id = null } = req.body;

  if (!material_id || !quantity || quantity <= 0 || !type) {
    return res.status(400).json({ error: "Datos inválidos" });
  }

  // validar stock si resta
  if (type !== "IN") {
    const [[stock]] = await pool.execute(
      `
      SELECT COALESCE(SUM(
        CASE 
          WHEN type='IN' THEN quantity 
          ELSE -quantity 
        END
      ),0) AS total
      FROM stock_movements
      WHERE material_id = ?
      `,
      [material_id]
    );

    if (stock.total < quantity) {
      return res.status(400).json({ error: "Stock insuficiente" });
    }
  }

  await pool.execute(
    `
    INSERT INTO stock_movements
    (material_id, quantity, type, reason, project_id)
    VALUES (?, ?, ?, ?, ?)
    `,
    [material_id, quantity, type, reason, project_id]
  );

  res.status(201).json({ message: "Movimiento registrado" });
};

export const getStockStatus = async (req, res) => {
  const [rows] = await pool.execute(`
    SELECT 
      m.id,
      m.name,
      m.unit,
      COALESCE(SUM(
        CASE 
          WHEN sm.type='IN' THEN sm.quantity 
          ELSE -sm.quantity 
        END
      ),0) AS stock
    FROM materials m
    LEFT JOIN stock_movements sm ON sm.material_id = m.id
    GROUP BY m.id
  `);

  res.json(rows);
};
export const assignMaterialToProject = async (req, res) => {
  const { projectId } = req.params;
  const { materialId, quantity, reason } = req.body;

  if (!materialId || !quantity || quantity <= 0) {
    return res.status(400).json({ error: "Datos inválidos" });
  }

const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1️⃣ Calcular stock actual
    const [stockRows] = await connection.execute(
      `
      SELECT 
        COALESCE(SUM(
          CASE 
            WHEN type = 'IN' THEN quantity
            ELSE -quantity
          END
        ), 0) AS stock
      FROM stock_movements
      WHERE material_id = ?
      `,
      [materialId]
    );

    const stockAvailable = stockRows[0].stock;

    if (stockAvailable < quantity) {
      throw new Error("Stock insuficiente");
    }

    // 2️⃣ Registrar movimiento de stock
    await connection.execute(
      `
      INSERT INTO stock_movements
      (material_id, quantity, type, project_id, reason)
      VALUES (?, ?, 'PROJECT', ?, ?)
      `,
      [materialId, quantity, projectId, reason || "Asignación a proyecto"]
    );

    // 3️⃣ Insertar o actualizar material del proyecto
    await connection.execute(
      `
      INSERT INTO project_materials (project_id, material_id, quantity)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE
      quantity = quantity + VALUES(quantity)
      `,
      [projectId, materialId, quantity]
    );

    await connection.commit();

    res.status(201).json({
      message: "Material asignado correctamente al proyecto",
    });

  } catch (error) {
    await connection.rollback();

    console.error(error);
    res.status(400).json({
      error: error.message || "Error al asignar material",
    });

  } finally {
    connection.release();
  }
};
export const adjustStock = async (req, res) => {
  const { material_id, quantity, reason } = req.body;

  if (!material_id || !quantity || !reason) {
    return res.status(400).json({ error: "Datos inválidos" });
  }

  // quantity puede ser + o -
  const movementType = "ADJUST";
  const absQuantity = Math.abs(quantity);

  // si es negativo, validar stock
  if (quantity < 0) {
    const [[stock]] = await pool.execute(
      `
      SELECT COALESCE(SUM(
        CASE 
          WHEN type='IN' THEN quantity 
          ELSE -quantity 
        END
      ),0) AS total
      FROM stock_movements
      WHERE material_id = ?
      `,
      [material_id]
    );

    if (stock.total < absQuantity) {
      return res.status(400).json({ error: "Stock insuficiente para ajuste" });
    }
  }

  await pool.execute(
    `
    INSERT INTO stock_movements
    (material_id, quantity, type, reason)
    VALUES (?, ?, 'ADJUST', ?)
    `,
    [material_id, absQuantity, reason]
  );

  res.json({ message: "Ajuste de stock realizado" });
};