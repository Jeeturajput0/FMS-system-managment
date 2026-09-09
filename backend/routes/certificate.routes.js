import express from "express";
import { authorize, protect } from "../middleware/auth.middleware.js";
import { getCertificate } from "../controller/certificate.controller.js";

const router = express.Router();
router.get("/me", protect, authorize("STUDENT"), (req, res, next) => {
  req.params.studentId = "me";
  return getCertificate(req, res, next);
});
router.get("/student/:studentId", protect, authorize("SUPER_ADMIN", "ADMIN", "AI_SCHOLAR_ADMIN", "FRANCHISE", "FRANCHISE_ADMIN", "TEACHER"), getCertificate);

export default router;