import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import modelRoutes from "./routes/modelRoutes.js";
import carRoutes from "./routes/carRoutes.js";
import equipmentCategoryRoutes from "./routes/EquipCategoryRoutes.js";
import equipmentRoutes from "./routes/equipmentRoutes.js";
import seedEquipment from "./controllers/seedEqp.js";

const app = express();
//dotenv.config();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/models", modelRoutes);
app.use("/api/cars", carRoutes);
//app.use("/api/equipCategories", equipmentCategoryRoutes);
app.use("/api/equipment", equipmentRoutes);

app.get("/", (req, res) => {
  res.send("It works!!!");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server started on post: ${PORT}`);
  connectDB();
  // seedEquipment();
});
