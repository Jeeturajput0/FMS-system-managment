import express from "express";

import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  updateStudentStatus,
} from "../controller/admin/student.controller.js";

import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// =====================================================
// GET ALL STUDENTS
// =====================================================

router.get("/", protect, getStudents);

// =====================================================
// GET SINGLE STUDENT
// =====================================================

router.get("/:id", protect, getStudentById);

// =====================================================
// CREATE STUDENT
// =====================================================

router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN", "ADMIN", "AI_SCHOLAR_ADMIN", "FRANCHISE_ADMIN", "FRANCHISE", "TEACHER"),
  createStudent,
);

// =====================================================
// UPDATE STUDENT
// =====================================================

router.put(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "ADMIN", "AI_SCHOLAR_ADMIN", "FRANCHISE_ADMIN", "FRANCHISE"),
  updateStudent,
);

// =====================================================
// DELETE / DEACTIVATE
// =====================================================

router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "ADMIN", "AI_SCHOLAR_ADMIN", "FRANCHISE_ADMIN", "FRANCHISE"),
  deleteStudent,
);

// =====================================================
// UPDATE STATUS
// =====================================================

router.patch(
  "/:id/status",
  protect,
  authorize("SUPER_ADMIN", "ADMIN", "AI_SCHOLAR_ADMIN", "FRANCHISE_ADMIN", "FRANCHISE"),
  updateStudentStatus,
);

export default router;
