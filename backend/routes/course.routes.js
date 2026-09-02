import express from "express";
import {
  createCourse,
  deleteCourse,
  getCourse,
  listCourses,
  updateCourse,
} from "../controller/course.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";
import { requireDatabase } from "../middleware/db.middleware.js";

const router = express.Router();

router.use(requireDatabase);
router.get("/", listCourses);
router.get("/:id", getCourse);
router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN", "ADMIN"),
  createCourse,
);
router.put(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "ADMIN"),
  updateCourse,
);
router.delete("/:id", protect, authorize("SUPER_ADMIN", "ADMIN"), deleteCourse);

export default router;