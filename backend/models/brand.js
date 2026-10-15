import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brandType: {
      type: String,
      enum: ["car", "motorcycle", "trailer", "other"],
      default: "car",
    },
  },

  { timestamps: true },
);
export const Brand = mongoose.model("Brand", brandSchema);
