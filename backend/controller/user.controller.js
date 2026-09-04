import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

const secret = () => process.env.JWT_SECRET || "ai-scholars-dev-secret";
const toPublicUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  coachingId: user.coachingId || null,
});
const createToken = (user) =>
  jwt.sign(
    { id: user._id.toString(), email: user.email, role: user.role, coachingId: user.coachingId || null },
    secret(),
    { expiresIn: "7d" },
  );

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role = "STUDENT", coachingId = null } = req.body;
    const allowedRoles = ["SUPER_ADMIN", "ADMIN", "FRANCHISE", "TEACHER", "STUDENT"];
    if (!name?.trim() || !email?.trim() || !password || password.length < 6 || !allowedRoles.includes(role)) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            "Name, valid email and password of 6+ characters are required",
        });
    }
    const normalizedEmail = email.trim().toLowerCase();
    if (await User.exists({ email: normalizedEmail }))
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(password, 12),
      role,
      coachingId,
    });
    return res
      .status(201)
      .json({
        success: true,
        user: toPublicUser(user),
        token: createToken(user),
      });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: error.message || "Registration failed",
      });
  }
};

export const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email?.trim().toLowerCase(),
    }).select("+password");
    if (
      !user ||
      !user.isActive ||
      !(await bcrypt.compare(req.body.password || "", user.password))
    )
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    return res.json({
      success: true,
      user: toPublicUser(user),
      token: createToken(user),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: error.message || "Login failed" });
  }
};

export const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });
  return res.json({ success: true, user: toPublicUser(user) });
};
