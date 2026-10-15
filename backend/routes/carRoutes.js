import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { uploadImages } from "../utils/imageUpload.js";
import {
  getCarById,
  getCarFilterOptions,
  getCars,
  newCar,
  updateCar,
  deleteCar,
} from "../controllers/carControllers.js";
const router = express.Router();

router.get("/filter-options", getCarFilterOptions);
router.get("/:id", getCarById);
router.get("/", getCars);
router.post("/", uploadImages, newCar);
router.put("/:id", protect, updateCar);
router.delete("/:id", protect, deleteCar);

export default router;
