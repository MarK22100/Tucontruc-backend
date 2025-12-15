import { Router } from "express";
import {
  createStockMovement,
  getStockStatus,
  assignMaterialToProject,
  adjustStock
} from "../controllers/stock.controller.js";

const router = Router();

// Movimientos generales (IN / OUT)
router.post("/movements", createStockMovement);

// Stock consolidado
router.get("/status", getStockStatus);

// 👉 ASIGNAR MATERIAL A PROYECTO
router.post("/assign-to-project/:projectId", assignMaterialToProject);

// Ajuste manual
router.post("/adjust", adjustStock);
export default router;