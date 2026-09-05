import express from "express";
import { getCurrentUser, loginUser, registerUser } from "../controller/admin/auth.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";
import { requireDatabase } from "../middleware/db.middleware.js";
import { getAdminProfile, updateAdminProfile, deleteAdminProfile } from "../controller/admin/profile.controller.js";

const router = express.Router();
router.use(requireDatabase);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getCurrentUser);
router.get("/profile", protect, authorize("SUPER_ADMIN", "ADMIN"), getAdminProfile);
router.put("/profile", protect, authorize("SUPER_ADMIN", "ADMIN"), updateAdminProfile);
router.delete("/profile", protect, authorize("SUPER_ADMIN", "ADMIN"), deleteAdminProfile);
router.get("/portal", protect, async (req, res) => {
	res.json({
		success: true,
		portal: req.user.role,
		message: `${req.user.role} portal access verified`,
	});
});

export default router;
