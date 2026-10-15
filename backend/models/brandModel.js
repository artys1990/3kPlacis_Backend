import mongoose from "mongoose";

const ModelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    modelType: {
      type: String,
      enum: ["car", "motorcycle", "trailer", "other"],
      default: "car",
    },
  },
  { timestamps: true },
);

ModelSchema.index({ name: 1, brand: 1, modelType: 1 }, { unique: true });
export const Model = mongoose.model("Model", ModelSchema);
