import { Brand } from "../models/brand.js";

export const getBrand = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res
        .status(404)
        .json({ success: false, message: "Marka nav atrasta!" });
    }
    res.json(brand);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllBrands = async (req, res) => {
  const brandType = req.body?.brandType || "car";
  try {
    const brands = await Brand.find({ brandType });
    res.json(brands);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addBrand = async (req, res) => {
  try {
    const { name, brandType } = req.body;
    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
      return res
        .status(400)
        .json({ success: false, message: "Marka jau eksistē!" });
    }

    const brand = await Brand.create({ name, brandType });
    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!brand) {
      return res
        .status(404)
        .json({ success: false, message: "Marka nav atrasta!" });
    }
    res.json({
      success: true,
      brand,
      message: "Markas informācija veiksmīgi atjaunota!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);

    if (!brand) {
      res.status(404).json({ success: false, message: "Marka nav atrasta!" });
    }
    res.json({ success: true, message: "Marka veiksmīgi dzēsta!" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
