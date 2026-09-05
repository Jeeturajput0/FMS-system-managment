import express from "express";

import {
  createModule,
  getModules,
  getModulesByCourse,
  getModuleById,
  updateModule,
  deleteModule,
  toggleModulePublish,
  reorderModule,
} from "../controller/admin/module.controller.js";

import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

// =====================================================
// GET ALL MODULES
// =====================================================

router.get("/", protect, getModules);

// =====================================================
// GET MODULES BY COURSE
// IMPORTANT:
// Ye route /:id se pehle hona chahiye
// =====================================================

router.get("/course/:courseId", protect, getModulesByCourse);

// =====================================================
// GET SINGLE MODULE
// =====================================================

router.get("/:id", protect, getModuleById);

// =====================================================
// CREATE MODULE
// =====================================================

router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN", "ADMIN"),
  createModule,
);

// =====================================================
// UPDATE MODULE
// =====================================================

router.put(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "ADMIN"),
  updateModule,
);

// =====================================================
// DELETE MODULE
// =====================================================

router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "ADMIN"),
  deleteModule,
);

// =====================================================
// PUBLISH / UNPUBLISH
// =====================================================

router.patch(
  "/:id/publish",
  protect,
  authorize("SUPER_ADMIN", "ADMIN"),
  toggleModulePublish,
);

// =====================================================
// REORDER MODULE
// =====================================================

router.patch(
  "/:id/order",
  protect,
  authorize("SUPER_ADMIN", "ADMIN"),
  reorderModule,
);

export default router;
