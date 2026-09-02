import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
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
const uploadDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../upload",
);
fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, uploadDir),
    filename: (_req, file, callback) =>
      callback(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.use(requireDatabase);
router.get("/", listCourses);
router.get("/:id", getCourse);
router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN", "ADMIN"),
  upload.array("images", 10),
  createCourse,
);
router.put(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "ADMIN"),
  upload.array("images", 10),
  updateCourse,
);
router.delete("/:id", protect, authorize("SUPER_ADMIN", "ADMIN"), deleteCourse);

export default router;
