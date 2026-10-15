import { Model } from "../models/brandModel.js";
import { Brand } from "../models/brand.js";

export const getModelById = async (req, res) => {
  try {
    const model = await Model.find({ brand: req.params.id });
    if (!model) {
      return res
        .status(404)
        .json({ success: false, message: "Modelis nav atrasts!" });
    }
    res.json(model);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllModelsByBrand = async (req, res) => {
  // const modelType = req.body?.modelType || "car";
  const brandId = req.body?.brand;

  try {
    const models = await Model.find({ brand: brandId });
    res.json(models);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addModel = async (req, res) => {
  try {
    const { name, brand, modelType } = req.body;
    const existingBrand = await Brand.findById(brand); //check if brand exists
    if (!existingBrand) {
      return res
        .status(400)
        .json({ success: false, message: "Marka nav atrasta!" });
    }
    //check if model with brand already exists
    let model = await Model.findOne({ name, brand, modelType });
    if (model) {
      return res
        .status(400)
        .json({ success: false, message: "Sāds modelis jau eksistē" });
    }
    model = await Model.create({ name, brand, modelType });
    res.status(201).json(model);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateModel = async (req, res) => {
  try {
    const model = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!model) {
      return res
        .status(404)
        .json({ success: false, message: "Modelis nav atrasts!" });
    }
    res.json(model);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteModel = async (req, res) => {
  try {
    const model = await Model.findByIdAndDelete(req.params.id);

    if (!model) {
      res.status(404).json({ success: false, message: "Modelis nav atrasts!" });
    }
    res.json({ success: true, message: "Modelis veiksmīgi dzēsts!" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
