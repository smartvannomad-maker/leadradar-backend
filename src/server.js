import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import leadsRoutes from "./routes/leads.routes.js";
import teamRoutes from "./routes/team.routes.js";
import templatesRoutes from "./routes/templates.routes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://wondrous-pothos-1d6004.netlify.app",
  "https://gentle-figolla-049e60.netlify.app",
  (process.env.FRONTEND_URL || "").trim(),
].filter(Boolean);

console.log("Allowed origins:", allowedOrigins);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      const cleanOrigin = String(origin).trim();

      const isExactMatch = allowedOrigins.includes(cleanOrigin);

      const isNetlifyPreview =
        /^https:\/\/[a-z0-9-]+--wondrous-pothos-1d6004\.netlify\.app$/i.test(
          cleanOrigin
        );

      if (
        isExactMatch ||
        isNetlifyPreview ||
        cleanOrigin.startsWith("chrome-extension://") ||
        cleanOrigin.startsWith("edge-extension://")
      ) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${cleanOrigin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
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
app.use("/api/templates", templatesRoutes);

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);

  if (err?.message?.includes("CORS blocked")) {
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