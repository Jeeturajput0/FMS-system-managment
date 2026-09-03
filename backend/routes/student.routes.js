import express from "express";

import {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  updateStudentStatus,
} from "../controller/student.controller.js";

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
  authorize("SUPER_ADMIN", "ADMIN", "AI_SCHOLAR_ADMIN", "FRANCHISE_ADMIN"),
  createStudent,
);

// =====================================================
// UPDATE STUDENT
// =====================================================

router.put(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "ADMIN", "AI_SCHOLAR_ADMIN", "FRANCHISE_ADMIN"),
  updateStudent,
);

// =====================================================
// DELETE / DEACTIVATE
// =====================================================

router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "ADMIN", "AI_SCHOLAR_ADMIN", "FRANCHISE_ADMIN"),
  deleteStudent,
);

// =====================================================
// UPDATE STATUS
// =====================================================

router.patch(
  "/:id/status",
  protect,
  authorize("SUPER_ADMIN", "ADMIN", "AI_SCHOLAR_ADMIN", "FRANCHISE_ADMIN"),
  updateStudentStatus,
);

export default router;
