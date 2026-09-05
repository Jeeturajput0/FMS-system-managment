import bcrypt from "bcryptjs";
import User from "../../model/user.model.js";

const publicProfile = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  coachingId: user.coachingId || null,
  isActive: user.isActive,
});

export const getAdminProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ success: false, message: "Admin profile not found" });
  return res.json({ success: true, user: publicProfile(user) });
};

export const updateAdminProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");
    if (!user) return res.status(404).json({ success: false, message: "Admin profile not found" });

    const { name, email, currentPassword, newPassword } = req.body;
    if (name !== undefined && !name.trim()) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }
    if (email !== undefined && !email.trim()) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    if (email && email.trim().toLowerCase() !== user.email) {
      const duplicate = await User.exists({ email: email.trim().toLowerCase(), _id: { $ne: user._id } });
      if (duplicate) return res.status(409).json({ success: false, message: "Email is already in use" });
      user.email = email.trim().toLowerCase();
    }
    if (name !== undefined) user.name = name.trim();

    if (newPassword) {
      if (!currentPassword || !(await bcrypt.compare(currentPassword, user.password))) {
        return res.status(400).json({ success: false, message: "Current password is incorrect" });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, message: "New password must contain at least 6 characters" });
      }
      user.password = await bcrypt.hash(newPassword, 12);
    }

    await user.save();
    return res.json({ success: true, message: "Admin profile updated successfully", user: publicProfile(user) });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to update admin profile", error: error.message });
  }
};

export const deleteAdminProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user._id, { isActive: false }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: "Admin profile not found" });
    return res.json({ success: true, message: "Admin profile deactivated successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to deactivate admin profile", error: error.message });
  }
};