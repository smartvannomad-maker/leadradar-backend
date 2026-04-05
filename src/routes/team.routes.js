import express from "express";
import db from "../db/knex.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

function requireWorkspaceOwner(req, res, next) {
  if (req.user.workspaceRole !== "owner") {
    return res.status(403).json({
      message: "Only workspace owners can manage team members",
    });
  }

  return next();
}

router.get("/members", requireWorkspaceOwner, async (req, res) => {
  try {
    const members = await db("workspace_members as wm")
      .join("users as u", "u.id", "wm.user_id")
      .select(
        "u.id",
        "u.email",
        "u.full_name",
        "wm.role as workspace_role",
        "wm.created_at"
      )
      .where("wm.workspace_id", req.user.workspaceId)
      .orderBy("wm.created_at", "asc");

    return res.json({
      members: members.map((member) => ({
        id: member.id,
        email: member.email,
        fullName: member.full_name || "",
        workspaceRole: member.workspace_role || "member",
        createdAt: member.created_at,
      })),
    });
  } catch (error) {
    console.error("GET /api/team/members error:", error);
    return res.status(500).json({ message: "Failed to load team members" });
  }
});

export default router;