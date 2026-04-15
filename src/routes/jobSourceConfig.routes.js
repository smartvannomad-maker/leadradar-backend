import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  getJobSourceConfigs,
  postJobSourceConfig,
  removeJobSourceConfig,
} from "../controllers/jobSourceConfig.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/job-sources", getJobSourceConfigs);
router.post("/job-sources", postJobSourceConfig);
router.delete("/job-sources/:sourceId", removeJobSourceConfig);

export default router;