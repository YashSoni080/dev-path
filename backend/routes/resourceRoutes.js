import express from "express";
import { createResource, searchResources, deleteResource } from "../controllers/resourceController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/search", searchResources);
router.post("/", protect, createResource);
router.delete("/:id", protect, deleteResource);

export default router;
