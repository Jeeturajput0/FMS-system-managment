import Course from "../../model/course.model.js";
import bcrypt from "bcryptjs";
import User from "../../model/user.model.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const courses = await Course.countDocuments({ isActive: true });
    return res.json({
      success: true,
      message: "Admin dashboard access verified",
      user: { id: req.user._id, role: req.user.role },
      stats: { franchises: 0, students: 0, courses, collections: "₹0" },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to load admin dashboard", error: error.message });
  }
};

const publicAdmin = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  createdAt: user.createdAt,
});

export const getAdmins = async (_req, res) => {
  try {
    const admins = await User.find({ role: { $in: ["ADMIN", "SUPER_ADMIN"] } }).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, data: admins.map(publicAdmin) });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to load admins", error: error.message });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { name, email, password, role = "ADMIN" } = req.body;
    if (!name?.trim() || !email?.trim() || !password || password.length < 6) return res.status(400).json({ success: false, message: "Name, email and password of 6+ characters are required" });
    if (!['ADMIN', 'SUPER_ADMIN'].includes(role)) return res.status(400).json({ success: false, message: "Invalid admin role" });
    if (await User.exists({ email: email.trim().toLowerCase() })) return res.status(409).json({ success: false, message: "Email is already in use" });
    const admin = await User.create({ name: name.trim(), email: email.trim().toLowerCase(), password: await bcrypt.hash(password, 12), role });
    return res.status(201).json({ success: true, data: publicAdmin(admin) });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to create admin", error: error.message });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const admin = await User.findOne({ _id: req.params.id, role: { $in: ["ADMIN", "SUPER_ADMIN"] } }).select("+password");
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found" });
    const { name, email, role, password } = req.body;
    if (name !== undefined) admin.name = name.trim();
    if (email !== undefined) admin.email = email.trim().toLowerCase();
    if (role && ["ADMIN", "SUPER_ADMIN"].includes(role)) admin.role = role;
    if (password) {
      if (password.length < 6) return res.status(400).json({ success: false, message: "Password must contain at least 6 characters" });
      admin.password = await bcrypt.hash(password, 12);
    }
    await admin.save();
    return res.json({ success: true, data: publicAdmin(admin) });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update admin", error: error.message });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    if (String(req.user._id) === String(req.params.id)) return res.status(400).json({ success: false, message: "You cannot delete your own admin account here" });
    const deleted = await User.deleteOne({ _id: req.params.id, role: { $in: ["ADMIN", "SUPER_ADMIN"] } });
    if (!deleted.deletedCount) return res.status(404).json({ success: false, message: "Admin not found" });
    return res.json({ success: true, message: "Admin permanently deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to delete admin", error: error.message });
  }
};