import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import leadsRoutes from "./routes/leads.routes.js";

const app = express();

/* =========================
   CORS CONFIG (FIXED + EXTENSION SUPPORT)
========================= */
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://wondrous-pothos-1d6004.netlify.app",

  // ✅ Chrome Extension (IMPORTANT)
  "chrome-extension://ipbgijgfpcollnkaekgkgdlbddciglb",
];

app.use(
  cors({
    origin(origin, callback) {
      // allow requests with no origin (Postman, curl, etc)
      if (!origin) return callback(null, true);

      // ✅ allow chrome extensions dynamically (safer than hardcoding only one)
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

/* =========================
   MIDDLEWARE
========================= */
app.use(express.json());

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("LeadRadar API running 🚀");
});

/* =========================
   ROUTES
========================= */
app.use("/api/auth", authRoutes);
app.use("/api/leads", leadsRoutes);

/* =========================
   ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err);

  if (err.message?.includes("CORS blocked")) {
    return res.status(403).json({ message: err.message });
  }

  return res.status(500).json({
    message: err.message || "Internal server error",
  });
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 LeadRadar API running on port ${PORT}`);
});