import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const courses = [
  {
    id: "CRS-201",
    title: "Full Stack Web & AI Development",
    category: "AI & Software Engineering",
    description: "Master modern full-stack web development with AI integrations, frontend architecture, and backend APIs.",
    shortDescription: "Frontend + backend + AI integration",
    duration: { value: 4, unit: "months" },
    courseFee: 30000,
    registrationFee: 1000,
    certificateFee: 3000,
    level: "Intermediate",
    status: "Published",
    thumbnail: "",
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "CRS-202",
    title: "Python for Artificial Intelligence & ML",
    category: "AI & Data Science",
    description: "Hands-on Python, machine learning pipelines, and practical AI model implementation.",
    shortDescription: "Python for AI and ML",
    duration: { value: 3, unit: "months" },
    courseFee: 25000,
    registrationFee: 1000,
    certificateFee: 2500,
    level: "Beginner",
    status: "Published",
    thumbnail: "",
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

router.get("/", (_req, res) => {
  return res.json({
    success: true,
    data: courses,
  });
});

router.get("/:id", (req, res) => {
  const course = courses.find((item) => item.id === req.params.id);

  if (!course) {
    return res.status(404).json({
      success: false,
      message: "Course not found",
    });
  }

  return res.json({
    success: true,
    data: course,
  });
});

router.post("/", upload.single("thumbnail"), (req, res) => {
  const { title, category, description, shortDescription, duration, courseFee, registrationFee, certificateFee, level } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: "Title and description are required",
    });
  }

  const parsedDuration = duration && typeof duration === "string" ? JSON.parse(duration) : { value: 1, unit: "months" };

  const newCourse = {
    id: `CRS-${Date.now()}`,
    title,
    category: category || "General",
    description,
    shortDescription: shortDescription || description,
    duration: parsedDuration,
    courseFee: Number(courseFee || 0),
    registrationFee: Number(registrationFee || 0),
    certificateFee: Number(certificateFee || 0),
    level: level || "Beginner",
    status: "Published",
    thumbnail: req.file ? `/uploads/${req.file.filename}` : "",
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  courses.unshift(newCourse);

  return res.status(201).json({
    success: true,
    message: "Course created successfully",
    data: newCourse,
  });
});

export default router;