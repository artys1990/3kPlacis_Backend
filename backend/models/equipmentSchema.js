import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema({
  //   name: {
  //     type: String,
  //     required: true,
  //   },

  //   equipCategory: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: "EquipmentCategory",
  //     required: true,
  //   },

  //   order: {
  //     type: Number,
  //     default: 0,
  //   },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Komforts un Ērtības",
      "Klimats",
      "Stūre",
      "Sēdekļi",
      "Multimēdiji",
      "Braukšanas Asistenti",
      "Drošība",
      "Parkošana un Kameras",
      "Lukturi",
      "Stikli un Jumts",
      "Diski un Riepas",
      "Piekare",
      "Transmisija / Braukšana",
      "Eksterjers",
      "Bagāžnieks",
      "Vilkšana",
      "Sporta Aprīkojums",
      "Elektriskais / Hibrīds",
      "Papildus",
      "Dokumenti / Vēsture",
    ],
  },
});
// Create a compound unique index on name and category
equipmentSchema.index({ name: 1, category: 1 }, { unique: true });

export const Equipment = mongoose.model("Equipment", equipmentSchema);
