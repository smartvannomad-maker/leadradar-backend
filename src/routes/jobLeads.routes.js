import express from "express";
import {
  requireAuth,
  attachWorkspaceAccess,
  requirePremiumAccess,
} from "../middleware/auth.middleware.js";

import {
  searchJobLeads,
  getSavedPortals,
  createSavedPortal,
  deleteSavedPortal,
  deleteAllSavedPortals,
} from "../controllers/jobLeads.controller.js";

const router = express.Router();

console.log("✅ jobLeads.routes.js loaded");

router.use((req, res, next) => {
  console.log(`📌 jobLeadsRoutes matched: ${req.method} ${req.originalUrl}`);
  next();
});

router.use(requireAuth, attachWorkspaceAccess, requirePremiumAccess);

router.post("/search", async (req, res, next) => {
  console.log("✅ HIT route: POST /api/job-leads/search");
  console.log("BODY:", req.body);
  try {
    await searchJobLeads(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.get("/portals", async (req, res, next) => {
  console.log("✅ HIT route: GET /api/job-leads/portals");
  try {
    await getSavedPortals(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post("/portals", async (req, res, next) => {
  console.log("✅ HIT route: POST /api/job-leads/portals");
  console.log("BODY:", req.body);
  try {
    await createSavedPortal(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.delete("/portals/:id", async (req, res, next) => {
  console.log("✅ HIT route: DELETE /api/job-leads/portals/:id");
  console.log("PARAMS:", req.params);
  try {
    await deleteSavedPortal(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.delete("/portals", async (req, res, next) => {
  console.log("✅ HIT route: DELETE /api/job-leads/portals");
  try {
    await deleteAllSavedPortals(req, res, next);
  } catch (error) {
    next(error);
  }
});

export default router;