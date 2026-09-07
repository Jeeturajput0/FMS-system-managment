import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { createAdmin, deleteAdmin, getAdminDashboard, getAdmins, updateAdmin } from "../controller/admin/admin.controller.js";

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  authorize("SUPER_ADMIN", "ADMIN"),
  getAdminDashboard,
);

router.get("/users", protect, authorize("SUPER_ADMIN", "ADMIN"), getAdmins);
router.post("/users", protect, authorize("SUPER_ADMIN"), createAdmin);
router.put("/users/:id", protect, authorize("SUPER_ADMIN", "ADMIN"), updateAdmin);
router.delete("/users/:id", protect, authorize("SUPER_ADMIN"), deleteAdmin);

export default router;
