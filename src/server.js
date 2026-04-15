import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import leadsRoutes from "./routes/leads.routes.js";
import jobLeadsRoutes from "./routes/jobLeads.routes.js";
import jobScanRoutes from "./routes/jobScan.routes.js";
import jobAutoDetectRoutes from "./routes/jobAutoDetect.routes.js";
import jobSourceConfigRoutes from "./routes/jobSourceConfig.routes.js";

const app = express();

/* =========================
   CORS CONFIG
========================= */
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://wondrous-pothos-1d6004.netlify.app",
  (process.env.FRONTEND_URL || "").trim(),
  "chrome-extension://ipbgijgfpcollnkaekgkgdlbddciglb",
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (origin.startsWith("chrome-extension://")) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ Blocked by CORS:", origin);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
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
app.use("/api", jobLeadsRoutes);
app.use("/api", jobScanRoutes);
app.use("/api", jobAutoDetectRoutes);
app.use("/api", jobSourceConfigRoutes);

app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);

  if (err.message?.includes("CORS blocked")) {
    return res.status(403).json({ message: err.message });
  }

  return res.status(500).json({
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 LeadRadar API running on port ${PORT}`);
});