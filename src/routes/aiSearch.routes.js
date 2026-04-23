import express from "express";
import requireAuth from "../middleware/requireAuth.js";
import { runAISearchController } from "../controllers/aiSearch.controller.js";

const router = express.Router();

router.post("/", requireAuth, runAISearchController);

export default router;