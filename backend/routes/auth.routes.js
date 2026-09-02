import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();
const jwtSecret = () => process.env.JWT_SECRET || "ai-scholars-dev-secret";
const publicUser = (user) => ({ id: user._id.toString(), name: user.name, email: user.email, role: user.role });
const signToken = (user) => jwt.sign({ id: user._id.toString(), email: user.email, role: user.role }, jwtSecret(), { expiresIn: "7d" });

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.trim() || !password || password.length < 6) {
      return res.status(400).json({ success: false, message: "Name, valid email and password of 6+ characters are required" });
    }
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.findOne({ email: normalizedEmail })) return res.status(409).json({ success: false, message: "User already exists" });
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: await bcrypt.hash(password, 12), role: "ADMIN" });
    return res.status(201).json({ success: true, user: publicUser(user), token: signToken(user) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email?.trim().toLowerCase() }).select("+password");
    if (!user || !user.isActive || !(await bcrypt.compare(req.body.password || "", user.password))) return res.status(401).json({ success: false, message: "Invalid email or password" });
    return res.json({ success: true, user: publicUser(user), token: signToken(user) });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Login failed" });
  }
});

router.get("/me", protect, async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  return res.json({ success: true, user: publicUser(user) });
});

export default router;
