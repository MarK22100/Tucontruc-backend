import express from "express";
import {
  createMaterial,
  updateMaterial,
  deleteMaterial,
  getMaterials,
} from "../controllers/material.controller.js";

const router = express.Router();

router.post("/", createMaterial);
router.get("/list", getMaterials);
router.put("/:id", updateMaterial);
router.delete("/:id", deleteMaterial);

export default router;