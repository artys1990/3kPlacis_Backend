import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getEquipmentlById,
  getAllEquipmentByCategory,
  addEquipment,
  //   updateBrand,
  //   deleteBrand,
} from "../controllers/equipmentControllers.js";
const router = express.Router();

router.get("/:id", getEquipmentlById);
router.get("/", getAllEquipmentByCategory);
router.post("/", addEquipment);
// router.post("/", protect, addBrand);
// router.put("/:id", protect, updateBrand);
// router.delete("/:id", protect, deleteBrand);

export default router;
