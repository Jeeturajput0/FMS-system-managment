import express from "express";
import { authorize, protect } from "../middleware/auth.middleware.js";
import { getAdminPortalOverview } from "../controller/admin/portal.controller.js";
import { createPortalTeacher, getPortalAttendance, getPortalCourses, getPortalDashboard, getPortalFees, getPortalStudents, getPortalTeacherBatches, getPortalTeachers, getPortalSettings, savePortalAttendance, updatePortalSettings } from "../controller/franchise/portal.controller.js";

const router = express.Router();
router.get("/admin-overview", protect, authorize("SUPER_ADMIN", "ADMIN"), getAdminPortalOverview);
router.use(protect, authorize("FRANCHISE", "TEACHER", "STUDENT"));
router.get("/dashboard", protect, getPortalDashboard);
router.get("/students", protect, getPortalStudents);
router.get("/courses", protect, getPortalCourses);
router.get("/fees", protect, getPortalFees);
router.get("/teachers", protect, getPortalTeachers);
router.get("/teacher-batches", protect, getPortalTeacherBatches);
router.post("/teachers", protect, createPortalTeacher);
router.get("/attendance", protect, getPortalAttendance);
router.put("/attendance", protect, savePortalAttendance);
router.get("/settings", protect, getPortalSettings);
router.put("/settings", protect, updatePortalSettings);

export default router;
