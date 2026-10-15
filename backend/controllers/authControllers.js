import { User } from "../models/user.js";
import { generateToken } from "../utils/generateJWTToken.js";
import bcrypt from "bcryptjs";

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }
    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }
    generateToken(res, user._id);
    res.status(200).json({
      success: true,
      message: "Login successfully",
    });
  } catch (error) {
    console.log("Error logging in", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All input fields must be filled" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "Email already taken" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    generateToken(res, user._id);
    res.status(201).json({
      message: "User created successfully",
      success: true,
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("userCookie");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
