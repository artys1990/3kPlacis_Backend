import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    model: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Model",
      required: true,
    },
    vin: {
      type: String,
      unique: true,
    },
    engineType: {
      type: String,
      enum: ["Benzīns", "Dīzelis", "Hibrīds", "Elektrisks"],
      required: true,
    },
    engineVolume: {
      type: Number,
      required: true,
    },
    power: {
      type: Number,
    },
    driveType: {
      //piedziņa
      type: String,
    },
    transmission: {
      type: String,
      enum: ["Automātiska", "Manuāla"],
      required: true,
    },
    bodyType: {
      type: String,
      enum: [
        "Sedans",
        "Universālis",
        "Apvidus",
        "Hečbeks",
        "Kupeja",
        "Pikaps",
        "Kabriolets",
        "Minivens",
        "Mikroautobuss",
      ],
    },
    color: String,
    year: {
      type: Number,
      required: true,
    },
    odometer: {
      type: Number,
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
    },
    inspectionDate: {
      type: Date,
    },
    equipment: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Equipment",
      },
    ],
    seats: {
      type: Number,
      default: 5,
    },
    post: {
      type: String,
      enum: ["Publisks", "Melnraksts", "Pārdots", "Neaktīvs"],
      default: "Melnraksts",
    },
    images: [{ type: String }],
  },
  { timestamps: true },
);

export const Car = mongoose.model("Car", carSchema);
