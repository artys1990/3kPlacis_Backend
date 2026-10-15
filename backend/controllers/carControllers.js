import { Car } from "../models/cars.js";
import { Model } from "../models/brandModel.js";
import { uploadCarImages, deleteImages } from "../utils/imageUpload.js";
import mongoose from "mongoose";

export const getCars = async (req, res) => {
  try {
    const {
      brand,
      model,
      minPrice,
      maxPrice,
      minOdometer,
      maxOdometer,
      engineType,
      transmission,
      page = 1,
      limit = 12,

      sort = "newest",
    } = req.query;
    const filters = {};
    //price filter
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }
    //odometer filter
    if (minOdometer || maxOdometer) {
      filters.odometer = {};
      if (minOdometer) filters.odometer.$gte = Number(minOdometer);
      if (maxOdometer) filters.odometer.$lte = Number(maxOdometer);
    }
    //engine type filter
    if (engineType) filters.engineType = engineType;
    // transmission filter
    if (transmission) filters.transmission = transmission;
    // //model filter
    // if (model) {
    //   filters.model = model;
    // }
    // //brand model
    // if (brand) {
    //   const brandDoc = await Brand.findOne({ name: brand });
    //   if (brandDoc) {
    //     const models = await Car.find({ brand: brandDoc._id });
    //     const modelIds = models.map((m) => m._id);
    //     filters.model = { $in: modelIds };
    //   }
    // }
    // Model filter
    if (model) {
      filters.model = model;
    } else if (brand) {
      // Find all models belonging to the selected brand
      const modelIds = await Model.distinct("_id", {
        brand: brand,
      });

      filters.model = { $in: modelIds };
    }

    //sorting
    let sortOption = {};
    if (sort === "price_asc") sortOption.price = 1;
    if (sort === "price_desc") sortOption.price = -1;
    if (sort === "oldest") sortOption.createdAt = 1;
    if (sort === "newest") sortOption.createdAt = -1;

    //pagination
    const skip = (Number(page) - 1) * Number(limit);
    const cars = await Car.find(filters)
      .populate({
        path: "model",
        populate: { path: "brand" },
      })
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Car.countDocuments(filters);
    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      cars,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id).populate([
      {
        path: "model",
        populate: {
          path: "brand",
        },
      },
      {
        path: "equipment",
      },
    ]);

    if (!car) {
      return res
        .status(404)
        .json({ success: false, message: "Ieraksts nav atrasts!" });
    }
    //Group car's equipment
    const groupedEquipment = car.equipment.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push({ id: item._id, name: item.name });
      return acc;
    }, {});

    res.json({
      ...car.toObject(),
      equipment: groupedEquipment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllCars = async (req, res) => {
  //not used for anything right now
  // const brandType = req.body?.brandType || "car";
  try {
    const cars = await Car.find().populate({
      path: "model",
      populate: {
        path: "brand",
      },
    });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCarFilterOptions = async (req, res, next) => {
  try {
    const cars = await Car.find({})
      .select("model")
      .populate({
        path: "model",
        select: "name brand",
        populate: {
          path: "brand",
          select: "name",
        },
      })
      .lean();

    const brands = new Map();
    const models = new Map();

    for (const car of cars) {
      const model = car.model;
      const brand = model?.brand;

      // Skip cars with missing model or brand references.
      if (!model || !brand) continue;

      brands.set(String(brand._id), {
        _id: String(brand._id),
        name: brand.name,
      });

      models.set(String(model._id), {
        _id: String(model._id),
        name: model.name,
        brand: {
          _id: String(brand._id),
          name: brand.name,
        },
      });
    }

    res.json({
      brands: [...brands.values()].sort((a, b) => a.name.localeCompare(b.name)),
      models: [...models.values()].sort((a, b) => a.name.localeCompare(b.name)),
    });
  } catch (error) {
    next(error);
  }
};

export const newCar = async (req, res) => {
  let uploaded = []; ////
  try {
    const {
      model,
      engineType,
      engineVolume,
      transmission,
      color,
      year,
      odometer,
      price,
      description,
      //  images,
      post,
    } = req.body;
    const existingModel = await Model.findById(model);
    if (!existingModel) {
      return res
        .status(400)
        .json({ success: false, message: "Modelis nav atrasts!" });
    }

    if (!req.files || req.files.length === 0) {
      /////////
      return res
        .status(400)
        .json({ success: false, message: "Jāpievieno vismaz viens attēls!" });
    } //////
    // Validate the model first, then upload, so we don't store orphaned images.
    // Generate the id up front so the R2 folder matches the car's _id
    const carId = new mongoose.Types.ObjectId();
    uploaded = await uploadCarImages(req.files, `cars/${carId}`);
    // uploaded = await uploadCarImages(req.files, "cars");

    const car = await Car.create({
      _id: carId,
      model,
      engineType,
      engineVolume,
      transmission,
      color,
      year,
      odometer,
      price,
      description,
      images: uploaded.map((img) => img.url),
      post,
    });
    res.status(201).json(car);
  } catch (error) {
    // Roll back uploaded images if saving the car failed
    await deleteImages(uploaded.map((img) => img.key)); ////
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!car) {
      return res
        .status(404)
        .json({ success: false, message: "Ieraksts nav atrasts!" });
    }
    res.json({
      success: true,
      car,
      message: "Ieraksts veiksmīgi atjaunots!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      res
        .status(404)
        .json({ success: false, message: "Ieraksts nav atrasts!" });
    }
    res.json({ success: true, message: "Ieraksts veiksmīgi dzēsts!" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
