import express from "express";
import { createPayment, getFees } from "../controller/fee.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";

const router = express.Router();
const feeAdmins = authorize("SUPER_ADMIN", "AI_SCHOLAR_ADMIN", "FRANCHISE_ADMIN", "ADMIN");

router.get("/", protect, getFees);
router.post("/:studentId/payments", protect, feeAdmins, createPayment);

export default router;
