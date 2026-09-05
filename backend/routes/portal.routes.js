import express from "express";
import { authorize, protect } from "../middleware/auth.middleware.js";
import { getAdminPortalOverview } from "../controller/admin/portal.controller.js";
import { getPortalCourses, getPortalDashboard, getPortalFees, getPortalStudents } from "../controller/franchise/portal.controller.js";

const router = express.Router();
router.get("/admin-overview", protect, authorize("SUPER_ADMIN", "ADMIN"), getAdminPortalOverview);
router.use(protect, authorize("FRANCHISE", "TEACHER", "STUDENT"));
router.get("/dashboard", getPortalDashboard);
router.get("/students", getPortalStudents);
router.get("/courses", getPortalCourses);
router.get("/fees", getPortalFees);

export default router;
