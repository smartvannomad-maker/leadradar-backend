import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { detectAndScanJobUrl } from "../controllers/jobAutoDetect.controller.js";

const router = Router();

router.use(requireAuth);

router.post("/job-scan/auto-detect", detectAndScanJobUrl);

export default router;