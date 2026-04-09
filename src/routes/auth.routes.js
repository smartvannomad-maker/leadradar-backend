import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import knex from "../db/knex.js";
import { getTrialEndsAt, resolveWorkspaceAccess } from "../utils/billing.js";

const router = express.Router();

function signAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
}

function signRefreshToken(payload) {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "30d",
  });
}

function makeDefaultNameFromEmail(email = "") {
  const localPart = String(email).split("@")[0] || "User";
  const cleaned = localPart
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return "New User";

  return cleaned
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function handleSignup(req, res, next) {
  try {
    const { fullName, email, password, workspaceName } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const resolvedFullName = (fullName || "").trim() || makeDefaultNameFromEmail(cleanEmail);
    const resolvedWorkspaceName =
      (workspaceName || "").trim() || `${resolvedFullName}'s Workspace`;

    const existingUser = await knex("users")
      .whereRaw("LOWER(email) = LOWER(?)", [cleanEmail])
      .first();

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await knex.transaction(async (trx) => {
      const insertedUsers = await trx("users")
        .insert({
          full_name: resolvedFullName,
          email: cleanEmail,
          password_hash: passwordHash,
        })
        .returning("*");

      const user = insertedUsers[0];

      const insertedWorkspaces = await trx("workspaces")
        .insert({
          name: resolvedWorkspaceName,
          owner_user_id: user.id,
          plan: "starter",
          subscription_status: "trialing",
          trial_ends_at: getTrialEndsAt(),
        })
        .returning("*");

      const workspace = insertedWorkspaces[0];

      await trx("workspace_members").insert({
        workspace_id: workspace.id,
        user_id: user.id,
        role: "owner",
      });

      return { user, workspace };
    });

    const workspaceAccess = resolveWorkspaceAccess(result.workspace);

    const tokenPayload = {
      userId: result.user.id,
      email: result.user.email,
      workspaceId: result.workspace.id,
    };

    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    return res.status(201).json({
      user: {
        id: result.user.id,
        fullName: result.user.full_name,
        email: result.user.email,
      },
      workspace: {
        id: result.workspace.id,
        name: result.workspace.name,
        plan: workspaceAccess.plan,
        subscriptionStatus: workspaceAccess.subscriptionStatus,
        trialEndsAt: workspaceAccess.trialEndsAt,
        trialDaysLeft: workspaceAccess.trialDaysLeft,
        isTrialing: workspaceAccess.isTrialing,
        isExpired: workspaceAccess.isExpired,
        isPaid: workspaceAccess.isPaid,
        hasFullTrialAccess: workspaceAccess.hasFullTrialAccess,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Signup error:", error);
    next(error);
  }
}

router.post("/signup", handleSignup);
router.post("/register", handleSignup);

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const cleanEmail = email.trim().toLowerCase();

    const user = await knex("users")
      .whereRaw("LOWER(email) = LOWER(?)", [cleanEmail])
      .first();

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const passwordOk = await bcrypt.compare(password, user.password_hash);

    if (!passwordOk) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const workspaceMember = await knex("workspace_members")
      .where({ user_id: user.id })
      .first();

    if (!workspaceMember) {
      return res.status(404).json({ message: "Workspace membership not found." });
    }

    const workspace = await knex("workspaces")
      .where({ id: workspaceMember.workspace_id })
      .first();

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found." });
    }

    const workspaceAccess = resolveWorkspaceAccess(workspace);

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      workspaceId: workspace.id,
    };

    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    return res.json({
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
      },
      workspace: {
        id: workspace.id,
        name: workspace.name,
        plan: workspaceAccess.plan,
        subscriptionStatus: workspaceAccess.subscriptionStatus,
        trialEndsAt: workspaceAccess.trialEndsAt,
        trialDaysLeft: workspaceAccess.trialDaysLeft,
        isTrialing: workspaceAccess.isTrialing,
        isExpired: workspaceAccess.isExpired,
        isPaid: workspaceAccess.isPaid,
        hasFullTrialAccess: workspaceAccess.hasFullTrialAccess,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
});

export default router;