import { EquipmentCategory } from "../models/equipmentCategorySchema.js";
import { Equipment } from "../models/equipmentSchema.js";

export const getEquipmentlById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) {
      return res
        .status(404)
        .json({ success: false, message: "Aprīkojums nav atrasts!" });
    }
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllEquipmentByCategory = async (req, res) => {
  // const modelType = req.body?.modelType || "car";
  const equipCatName = req.body?.equipCategory
    ? { category: req.body?.equipCategory }
    : {};

  try {
    const equipment = await Equipment.find(equipCatName);
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// export const addEquipment = async (req, res) => {
//   try {
//     const { name, equipCategory, order } = req.body;
//     const existingEquipCat = await EquipmentCategory.findById(equipCategory); //check if category exists
//     if (!existingEquipCat) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Kategorija nav atrasta!" });
//     }
//     //check if model with brand already exists
//     let equipment = await Equipment.findOne({ name, equipCategory });
//     if (equipment) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Šāds aprīkojums jau eksistē" });
//     }
//     equipment = await Equipment.create({ name, equipCategory, order });
//     res.status(201).json(equipment);
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
export const addEquipment = async (req, res) => {
  try {
    const { name, equipCategory } = req.body;
    // const existingEquip = await EquipmentCategory.findById({name, category: equipCategory}); //check if category exists
    // if (!existingEquip) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Kategorija nav atrasta!" });
    // }
    //check if model with brand already exists
    let equipment = await Equipment.findOne({ name, category: equipCategory });
    if (equipment) {
      return res
        .status(400)
        .json({ success: false, message: "Šāds aprīkojums jau eksistē" });
    }
    equipment = await Equipment.create({ name, category: equipCategory });
    res.status(201).json(equipment);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
