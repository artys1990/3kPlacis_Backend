import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getBrand,
  getAllBrands,
  addBrand,
  updateBrand,
  deleteBrand,
} from "../controllers/brandControllers.js";
const router = express.Router();

router.get("/:id", getBrand);
router.get("/", getAllBrands);
router.post("/", protect, addBrand);
router.put("/:id", protect, updateBrand);
router.delete("/:id", protect, deleteBrand);

export default router;
