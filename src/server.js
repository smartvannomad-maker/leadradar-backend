import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import leadsRoutes from "./routes/leads.routes.js";
import jobLeadsRoutes from "./routes/jobLeads.routes.js";
import teamRoutes from "./routes/team.routes.js";

const app = express();

/* =========================
   CORS CONFIG
========================= */
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3002",
  "http://127.0.0.1:3002",
  "http://localhost:5000",
  "http://127.0.0.1:5000",
  "https://www.linkedin.com",
  "https://linkedin.com",
  "https://wondrous-pothos-1d6004.netlify.app",
  "https://gentle-figolla-049e60.netlify.app",
  (process.env.FRONTEND_URL || "").trim(),
  "chrome-extension://ipbgijgfpcollnkaekgkgdlbddciglbj",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      const cleanOrigin = String(origin).trim();

      if (cleanOrigin.startsWith("chrome-extension://")) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(cleanOrigin)) {
        return callback(null, true);
      }

      console.log("❌ Blocked by CORS:", cleanOrigin);
      return callback(new Error(`CORS blocked for origin: ${cleanOrigin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("LeadRadar API running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadsRoutes);
app.use("/api/team", teamRoutes);
app.use("/api", jobLeadsRoutes);

app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);

  if (err.message?.includes("CORS blocked")) {
    return res.status(403).json({ message: err.message });
  }

  return res.status(500).json({
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 LeadRadar API running on port ${PORT}`);
});