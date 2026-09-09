import express from "express";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { createAdmin, deleteAdmin, getAdminDashboard, getAdmins, updateAdmin } from "../controller/admin/admin.controller.js";
import { createReport, deleteReport, getReports, updateReport } from "../controller/admin/report.controller.js";
import { createNotification, deleteNotification, getNotifications, markAllNotificationsRead, markNotificationRead, updateNotification } from "../controller/admin/notification.controller.js";

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

router.get("/reports", protect, authorize("SUPER_ADMIN", "ADMIN"), getReports);
router.post("/reports", protect, authorize("SUPER_ADMIN", "ADMIN"), createReport);
router.put("/reports/:id", protect, authorize("SUPER_ADMIN", "ADMIN"), updateReport);
router.delete("/reports/:id", protect, authorize("SUPER_ADMIN", "ADMIN"), deleteReport);

router.get("/notifications", protect, authorize("SUPER_ADMIN", "ADMIN"), getNotifications);
router.post("/notifications", protect, authorize("SUPER_ADMIN", "ADMIN"), createNotification);
router.put("/notifications/:id", protect, authorize("SUPER_ADMIN", "ADMIN"), updateNotification);
router.delete("/notifications/:id", protect, authorize("SUPER_ADMIN", "ADMIN"), deleteNotification);
router.patch("/notifications/:id/read", protect, authorize("SUPER_ADMIN", "ADMIN"), markNotificationRead);
router.patch("/notifications/read-all", protect, authorize("SUPER_ADMIN", "ADMIN"), markAllNotificationsRead);

export default router;
