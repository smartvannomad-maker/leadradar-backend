import express from "express";
import db from "../db/knex.js";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/users", async (req, res) => {
  try {
    const users = await db("users")
      .select("id", "email", "role", "created_at")
      .orderBy("created_at", "desc");

    return res.json(users);
  } catch (error) {
    console.error("GET /api/admin/users error:", error);
    return res.status(500).json({ message: "Failed to load users" });
  }
});

router.patch("/users/:id/role", async (req, res) => {
  try {
    const role = (req.body?.role || "").trim();

    if (!["admin", "user"].includes(role)) {
      return res.status(400).json({ message: "Role must be admin or user" });
    }

    const [updatedUser] = await db("users")
      .where({ id: req.params.id })
      .update({
        role,
        updated_at: new Date(),
      })
      .returning(["id", "email", "role", "created_at"]);

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(updatedUser);
  } catch (error) {
    console.error("PATCH /api/admin/users/:id/role error:", error);
    return res.status(500).json({ message: "Failed to update role" });
  }
});

export default router;