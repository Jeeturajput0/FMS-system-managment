import express from "express";
import { authorize, protect } from "../middleware/auth.middleware.js";
import {
  getCertificate,
  listCertificates,
  revokeCertificate,
  setCompletionDate,
  verifyCertificate,
} from "../controller/certificate.controller.js";

const router = express.Router();

// Public verification (no auth — only verification-safe fields are exposed)
router.get("/verify/:certificateNumber", verifyCertificate);

router.get("/me", protect, authorize("STUDENT"), (req, res, next) => {
  req.params.studentId = "me";
  return getCertificate(req, res, next);
});

router.get("/student/:studentId", protect, authorize("SUPER_ADMIN", "ADMIN", "AI_SCHOLAR_ADMIN", "FRANCHISE", "FRANCHISE_ADMIN", "TEACHER"), getCertificate);

// Set/override completion date + optionally force-issue (SUPER_ADMIN only)
router.patch("/student/:studentId/completion", protect, authorize("SUPER_ADMIN"), setCompletionDate);

// Certificate Management list (SUPER_ADMIN, ADMIN)
router.get("/", protect, authorize("SUPER_ADMIN", "ADMIN", "AI_SCHOLAR_ADMIN"), listCertificates);

// Revoke / restore (SUPER_ADMIN only)
router.post("/:certificateNumber/revoke", protect, authorize("SUPER_ADMIN"), revokeCertificate);

export default router;
