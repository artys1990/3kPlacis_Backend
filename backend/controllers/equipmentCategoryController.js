import { EquipmentCategory } from "../models/equipmentCategorySchema.js";

export const getEquipCategory = async (req, res) => {
  try {
    const eqtCat = await EquipmentCategory.findById(req.params.id);
    if (!eqtCat) {
      return res.status(404).json({
        success: false,
        message: "Aprīkojuma kategorija nav atrasta!",
      });
    }
    res.json(eqtCat);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllEquipCat = async (req, res) => {
  const equipCatType = req.body?.equipCat;
  try {
    const equipCats = await EquipmentCategory.find({ equipCatType });
    res.json(equipCats);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addEquipCat = async (req, res) => {
  try {
    const { name, order } = req.body;
    const existing = await EquipmentCategory.findOne({ name });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: "Kategorija jau eksistē!" });
    }

    const category = await EquipmentCategory.create({ name, order });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
