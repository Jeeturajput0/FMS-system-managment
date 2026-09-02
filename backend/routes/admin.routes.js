import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  authorize("SUPER_ADMIN", "ADMIN"),
  (req, res) => {
    res.json({
      success: true,
      message: "Admin dashboard access verified",
      user: {
        id: req.user._id,
        role: req.user.role,
      },
      stats: {
        franchises: 42,
        students: 1427,
        courses: 18,
        collections: "₹24.5L",
      },
    });
  },
);

export default router;
