import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import Course from "../model/course.model.js";

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  authorize("SUPER_ADMIN", "ADMIN"),
  async (req, res) => {
    const courses = await Course.countDocuments({ isActive: true });
    res.json({
      success: true,
      message: "Admin dashboard access verified",
      user: {
        id: req.user._id,
        role: req.user.role,
      },
      stats: {
        franchises: 0,
        students: 0,
        courses,
        collections: "₹0",
      },
    });
  },
);

export default router;
