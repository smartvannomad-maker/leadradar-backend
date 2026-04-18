import express from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../db/knex.js";
import {
  requireAuth,
  attachWorkspaceAccess,
  requirePremiumAccess,
} from "../middleware/auth.middleware.js";
import { sendWorkspaceInviteEmail } from "../utils/email.js";

const router = express.Router();

router.use(requireAuth, attachWorkspaceAccess, requirePremiumAccess);

async function getWorkspaceRole(userId, workspaceId) {
  const membership = await db("workspace_members")
    .where({
      user_id: userId,
      workspace_id: workspaceId,
    })
    .first();

  return membership?.role || "member";
}

async function requireWorkspaceOwner(req, res, next) {
  try {
    const role = await getWorkspaceRole(req.user.id, req.user.workspaceId);

    if (role !== "owner") {
      return res.status(403).json({
        message: "Only workspace owners can manage team members",
      });
    }

    req.user.workspaceRole = role;
    return next();
  } catch (error) {
    console.error("Workspace owner check failed:", error);
    return res.status(500).json({ message: "Authorization check failed" });
  }
}

router.get("/members", async (req, res) => {
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

router.get("/invites", requireWorkspaceOwner, async (req, res) => {
  try {
    const invites = await db("workspace_invites")
      .where({ workspace_id: req.user.workspaceId })
      .orderBy("created_at", "desc");

    return res.json({
      invites: invites.map((invite) => ({
        id: invite.id,
        email: invite.email,
        role: invite.role,
        status: invite.status,
        createdAt: invite.created_at,
        acceptedAt: invite.accepted_at,
      })),
    });
  } catch (error) {
    console.error("GET /api/team/invites error:", error);
    return res.status(500).json({ message: "Failed to load invites" });
  }
});

router.post("/invite", requireWorkspaceOwner, async (req, res) => {
  try {
    const email = (req.body?.email || "").trim().toLowerCase();
    const role = (req.body?.role || "member").trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!["member", "owner"].includes(role)) {
      return res.status(400).json({ message: "Invalid workspace role" });
    }

    const currentWorkspace = await db("workspaces")
      .select("id", "name")
      .where({ id: req.user.workspaceId })
      .first();

    if (!currentWorkspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const inviter = await db("users")
      .select("id", "email")
      .where({ id: req.user.id })
      .first();

    if (!inviter) {
      return res.status(404).json({ message: "Inviting user not found" });
    }

    const existingUser = await db("users")
      .where({
        email,
        workspace_id: req.user.workspaceId,
      })
      .first();

    if (existingUser) {
      return res.status(409).json({ message: "User is already in this workspace" });
    }

    const pendingInvite = await db("workspace_invites")
      .where({
        workspace_id: req.user.workspaceId,
        email,
        status: "pending",
      })
      .first();

    if (pendingInvite) {
      return res.status(409).json({
        message: "An invite is already pending for this email",
      });
    }

    const invite = {
      id: uuidv4(),
      workspace_id: req.user.workspaceId,
      email,
      role,
      status: "pending",
      invited_by: req.user.id,
      accepted_at: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    await db("workspace_invites").insert(invite);

    let emailSent = false;
    let emailError = null;

    try {
      if (typeof sendWorkspaceInviteEmail === "function") {
        await sendWorkspaceInviteEmail({
          toEmail: email,
          invitedByEmail: inviter.email,
          workspaceName: currentWorkspace.name || "LeadRadar Workspace",
          role,
        });
        emailSent = true;
      }
    } catch (err) {
      emailError = err.message || "Failed to send invite email";
      console.error("Invite email send error:", err);
    }

    return res.status(201).json({
      invite: {
        id: invite.id,
        email: invite.email,
        role: invite.role,
        status: invite.status,
        createdAt: invite.created_at,
      },
      emailSent,
      message: emailSent
        ? "Invite created and email sent."
        : "Invite created.",
      emailError,
    });
  } catch (error) {
    console.error("POST /api/team/invite error:", error);
    return res.status(500).json({ message: "Failed to create invite" });
  }
});

export default router;