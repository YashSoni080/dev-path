import express from "express";
import { getDomains, getDomainBySlug } from "../controllers/domainController.js";

const router = express.Router();

router.get("/", getDomains);
router.get("/:slug", getDomainBySlug);

export default router;
