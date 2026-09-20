import express from "express";
import { getDomains, getDomainBySlug, getAllData } from "../controllers/domainController.js";

const router = express.Router();

router.get("/", getDomains);
router.get("/all", getAllData);
router.get("/:slug", getDomainBySlug);

export default router;
