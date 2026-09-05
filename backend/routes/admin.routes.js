import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { getAdminDashboard } from "../controller/admin/admin.controller.js";

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  authorize("SUPER_ADMIN", "ADMIN"),
  getAdminDashboard,
);

export default router;
