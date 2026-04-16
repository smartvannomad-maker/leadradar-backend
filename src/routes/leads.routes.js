import express from "express";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  getLeads,
  createLead,
  updateLead,
  deleteLead,
  addLeadNote,
} from "../controllers/leads.controller.js";

const router = express.Router();

router.use(requireAuth);

router.get("/", getLeads);
router.post("/", createLead);
router.patch("/:id", updateLead);
router.delete("/:id", deleteLead);
router.post("/:id/notes", addLeadNote);

export default router;