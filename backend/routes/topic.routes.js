import express from "express";
import { createTopic, getTopics, getTopicById } from "../controller/admin/topic.controller.js";
import { authorize, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getTopics);
router.post("/", protect, authorize("SUPER_ADMIN", "ADMIN"), createTopic);
router.get("/:id", protect, getTopicById);

export default router;