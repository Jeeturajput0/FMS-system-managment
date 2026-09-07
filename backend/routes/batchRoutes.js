import express from "express";

import  {
  createBatch,
  getAllBatches,
  getFranchiseBatches,
  getBatchById,
  updateBatch,
  deleteBatch,
  assignTeacher,
  addStudentToBatch,
  removeStudentFromBatch,
  updateBatchStatus,
} from "../controller/franchise/batches.controllr.js";

// Change this path if your auth middleware is somewhere else
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// ============================================================
// FRANCHISE BATCHES
// ============================================================

// Logged-in franchise gets only its own batches
router.get("/franchise/batches", protect, getFranchiseBatches);

// ============================================================
// ALL BATCHES
// ============================================================

// Admin can get all batches
router.get("/", protect, getAllBatches);

// ============================================================
// CREATE
// ============================================================

router.post("/", protect, createBatch);

// ============================================================
// SINGLE BATCH
// ============================================================

router.get("/:id", protect, getBatchById);

// ============================================================
// UPDATE
// ============================================================

router.put("/:id", protect, updateBatch);

// ============================================================
// DELETE
// ============================================================

router.delete("/:id", protect, deleteBatch);

// ============================================================
// ASSIGN TEACHER
// ============================================================

router.patch("/:id/teacher", protect, assignTeacher);

// ============================================================
// ADD STUDENT
// ============================================================

router.post("/:id/students", protect, addStudentToBatch);

// ============================================================
// REMOVE STUDENT
// ============================================================

router.delete("/:id/students/:studentId", protect, removeStudentFromBatch);

// ============================================================
// STATUS
// ============================================================

router.patch("/:id/status", protect, updateBatchStatus);

export default router;
