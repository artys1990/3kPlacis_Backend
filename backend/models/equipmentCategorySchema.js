import mongoose from "mongoose";

const equipmentCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  order: {
    type: Number,
    default: 0,
  },
});

export const EquipmentCategory = mongoose.model(
  "EquipmentCategory",
  equipmentCategorySchema,
);
