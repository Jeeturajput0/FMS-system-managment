import express from "express";
import { getCurrentUser, loginUser, registerUser } from "../controller/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { requireDatabase } from "../middleware/db.middleware.js";

const router = express.Router();
router.use(requireDatabase);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getCurrentUser);

export default router;
