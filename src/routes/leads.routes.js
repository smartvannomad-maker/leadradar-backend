import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";

import {
  searchJobLeads,
  getSavedPortals,
  createSavedPortal,
  deleteSavedPortal,
  deleteAllSavedPortals,
} from "../controllers/jobLeads.controller.js";

const router = express.Router();

// protect all routes
router.use(requireAuth);

// SEARCH
router.post("/job-leads/search", searchJobLeads);

// PORTALS
router.get("/job-leads/portals", getSavedPortals);
router.post("/job-leads/portals", createSavedPortal);
router.delete("/job-leads/portals/:id", deleteSavedPortal);
router.delete("/job-leads/portals", deleteAllSavedPortals);

export default router;