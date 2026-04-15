import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { runKeywordJobScan } from "../controllers/jobKeywordScan.controller.js";

const router = Router();

router.use(requireAuth);

router.post("/job-scan/keyword", runKeywordJobScan);

export default router;