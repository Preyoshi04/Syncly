import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// ---- REGISTER ----
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // ✅ 1. Basic validation
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill all the fields!", success: false });
    }

    // ✅ 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User already exists!", success: false });
    }

    // ✅ 3. Create new user (password hashed automatically via middleware)
    const newUser = await User.create({ username, email, password });

    // ✅ 4. Generate JWT token
    const token = generateToken(newUser._id);

    // ✅ 5. Send success response
    res.status(201).json({
      message: "User registered successfully!",
      success: true,
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      token,
    });
  } catch (error) {
    console.error("Error in registering user:", error.message);
    res.status(500).json({ message: "Internal server error!", success: false });
  }
});

// ---- LOGIN ----
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // ✅ 1. Find user by email
    const user = await User.findOne({ email });

    // ✅ 2. If user doesn’t exist or password doesn’t match
    if (!user || !(await user.matchPassword(password))) {
      return res
        .status(400)
        .json({ message: "Invalid credentials!", success: false });
    }

    // ✅ 3. Generate JWT token
    const token = generateToken(user._id);

    // ✅ 4. Successful login
    res.status(200).json({
      message: "Login successful!",
      success: true,
      id: user._id,
      username: user.username,
      email: user.email,
      token,
    });
  } catch (error) {
    console.error("Error in logging in user:", error.message);
    res.status(500).json({ message: "Internal server error!", success: false });
  }
});

// ---- ME (Protected Route) ----
router.get("/me", protect, async (req, res) => {
  res.status(200).json(req.user);
});

// ---- GENERATE JWT TOKEN ----
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export default router;
