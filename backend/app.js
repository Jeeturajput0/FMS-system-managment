import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.routes.js";
import courseRoutes from "./routes/course.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import moduleRoutes from "./routes/module.routes.js";
import Studentroutes from "./routes/student.routes.js";
import feeRoutes from "./routes/fee.routes.js";
import topicRoutes from "./routes/topic.routes.js";
import  router from "./routes/coaching.routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/upload", express.static(path.join(__dirname, "upload")));

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/modules", moduleRoutes);
app.use("/api/students", Studentroutes);
app.use("/api/fees", feeRoutes);
app.use("/api/coaching", router);
app.use("/api/topics", topicRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI Scholars Franchise Management System API is running",
    endpoints: [
      "/api/auth/login",
      "/api/auth/register",
      "/api/courses",
      "/api/admin/dashboard",
    ],
  });
});

app.use((err, req, res, next) => {
  console.error("Unhandled API error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

export default app;
