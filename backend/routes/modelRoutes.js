import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  getModelById,
  getAllModelsByBrand,
  updateModel,
  addModel,
  deleteModel,
} from "../controllers/modelControllers.js";
const router = express.Router();

router.get("/:id", getModelById);
router.get("/", getAllModelsByBrand);
router.post("/", protect, addModel);
router.put("/:id", protect, updateModel);
router.delete("/:id", protect, deleteModel);

export default router;
