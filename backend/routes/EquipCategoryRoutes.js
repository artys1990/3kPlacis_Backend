import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getEquipCategory,
  getAllEquipCat,
  addEquipCat,
  //   updateBrand,
  //   deleteBrand,
} from "../controllers/equipmentCategoryController.js";
const router = express.Router();

router.get("/:id", getEquipCategory);
router.get("/", getAllEquipCat);
router.post("/", addEquipCat);
// router.post("/", protect, addBrand);
// router.put("/:id", protect, updateBrand);
// router.delete("/:id", protect, deleteBrand);

export default router;
