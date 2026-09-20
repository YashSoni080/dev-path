import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getUserProgress,
  toggleTopicProgress,
  syncProgress,
} from "../controllers/progressController.js";

const router = express.Router();

router.get("/", protect, getUserProgress);
router.post("/toggle", protect, toggleTopicProgress);
router.post("/sync", protect, syncProgress);

export default router;
