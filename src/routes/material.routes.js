import express from "express";
import {
  createMaterial,
  getMaterialsByProject,
  updateMaterial,
  deleteMaterial,
} from "../controllers/material.controller.js";

const router = express.Router();

router.post("/", createMaterial);
router.get("/project/:projectId", getMaterialsByProject);
router.put("/:id", updateMaterial);
router.delete("/:id", deleteMaterial);

export default router;