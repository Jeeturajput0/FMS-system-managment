import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Course from "../model/course.model.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.join(__dirname, "../uploads");
fs.mkdirSync(uploadDir, { recursive: true });
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, uploadDir),
    filename: (_req, file, callback) => callback(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const parseBody = (body) => ({
  title: body.title?.trim(),
  description: body.description?.trim(),
  shortDescription: body.shortDescription?.trim() || body.description?.trim(),
  duration: typeof body.duration === "string" ? JSON.parse(body.duration) : body.duration,
  courseFee: Number(body.courseFee),
  registrationFee: Number(body.registrationFee || 0),
  certificateFee: Number(body.certificateFee || 0),
  category: body.category || "General",
  level: body.level || "Beginner",
});

router.get("/", async (_req, res) => {
  try {
    const courses = await Course.find({ isActive: true }).sort({ createdAt: -1 });
    return res.json({ success: true, data: courses, count: courses.length });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch courses", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, isActive: true });
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    return res.json({ success: true, data: course });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Invalid course id" });
  }
});

router.post("/", protect, authorize("SUPER_ADMIN", "ADMIN"), upload.single("thumbnail"), async (req, res) => {
  try {
    const data = parseBody(req.body);
    if (!data.title || !data.description || !data.duration?.value || Number.isNaN(data.courseFee)) {
      return res.status(400).json({ success: false, message: "Title, description, duration and course fee are required" });
    }
    const course = await Course.create({ ...data, thumbnail: req.file ? `/uploads/${req.file.filename}` : "", isPublished: true, createdBy: req.user._id });
    return res.status(201).json({ success: true, data: course, message: "Course created successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || "Course creation failed" });
  }
});

router.put("/:id", protect, authorize("SUPER_ADMIN", "ADMIN"), upload.single("thumbnail"), async (req, res) => {
  try {
    const updates = parseBody(req.body);
    if (req.file) updates.thumbnail = `/uploads/${req.file.filename}`;
    const course = await Course.findOneAndUpdate({ _id: req.params.id, isActive: true }, { ...updates, updatedBy: req.user._id }, { new: true, runValidators: true });
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    return res.json({ success: true, data: course, message: "Course updated successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message || "Course update failed" });
  }
});

router.delete("/:id", protect, authorize("SUPER_ADMIN", "ADMIN"), async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate({ _id: req.params.id, isActive: true }, { isActive: false, updatedBy: req.user._id }, { new: true });
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    return res.json({ success: true, id: req.params.id, message: "Course deleted successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Invalid course id" });
  }
});

export default router;
