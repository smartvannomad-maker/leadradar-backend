import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import { runJobSourceScan } from "../controllers/jobScan.controller.js";

const router = Router();

router.use(requireAuth);

router.post("/job-scan/run", runJobSourceScan);

export default router;