import express from "express";
import { assignMaterialToProject } from "../controllers/stock.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";



import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";

const router = express.Router();
router.post(
  "/:projectId/materials",
  authMiddleware,
  assignMaterialToProject
);
router.post("/", createProject);
router.get("/", getProjects);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;