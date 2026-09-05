import Course from "../../model/course.model.js";

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