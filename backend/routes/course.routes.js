import express from "express";
import {
  createCourse,
  deleteCourse,
  getCourse,
  listCourses,
  updateCourse,
  updateCourseModules,
} from "../controller/admin/course.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { requireDatabase } from "../middleware/db.middleware.js";
import { courseUpload } from "../middleware/upload.middleware.js";

const router = express.Router();

router.use(requireDatabase);
router.get("/", listCourses);
router.get("/:id", getCourse);
router.get("/fran")
router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN", "ADMIN"),
  courseUpload,
  createCourse,
);
router.put(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "ADMIN"),
  courseUpload,
  updateCourse,
);
router.put(
  "/:id/modules",
  protect,
  authorize("SUPER_ADMIN", "ADMIN"),
  updateCourseModules,
);
router.delete("/:id", protect, authorize("SUPER_ADMIN", "ADMIN"), deleteCourse);

export default router;
