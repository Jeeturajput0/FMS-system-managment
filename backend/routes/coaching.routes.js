import express from "express";
import {
  createCoaching,
  getCoachings,
  getCoachingById,
  updateCoaching,
  deleteCoaching,
  updateCoachingStatus,
} from "../controller/admin/coaching.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = express.Router();

/*
=========================================
GET ALL
=========================================
*/

router.get("/", protect, getCoachings);

/*
=========================================
GET SINGLE
IMPORTANT:
Place this before any /:id conflict
=========================================
*/

router.get("/:id", protect, getCoachingById);

/*
=========================================
CREATE
=========================================
*/

router.post(
  "/",
  protect,
  authorize("SUPER_ADMIN", "AI_SCHOLAR_ADMIN", "ADMIN"),
  createCoaching,
);

/*
=========================================
UPDATE
=========================================
*/

router.put(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "AI_SCHOLAR_ADMIN", "ADMIN"),
  updateCoaching,
);

/*
=========================================
DELETE / DEACTIVATE
=========================================
*/

router.delete(
  "/:id",
  protect,
  authorize("SUPER_ADMIN", "AI_SCHOLAR_ADMIN", "ADMIN"),
  deleteCoaching,
);

/*
=========================================
STATUS
=========================================
*/

router.patch(
  "/:id/status",
  protect,
  authorize("SUPER_ADMIN", "AI_SCHOLAR_ADMIN", "ADMIN"),
  updateCoachingStatus,
);


export default router ;