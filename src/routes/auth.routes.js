import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import knex from "../db/knex.js";
import { v4 as uuidv4 } from "uuid";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

function signAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function buildWorkspaceAccess(workspace = {}) {
  const trialEndsAt =
    workspace.trial_expires_at ||
    workspace.trial_ends_at ||
    null;

  const subscriptionStatus = workspace.subscription_status || "trialing";
  const plan = workspace.plan || "free";
  const billingProvider = workspace.billing_provider || null;
  const manualAccessOverride = Boolean(workspace.manual_access_override);
  const manualAccessExpiresAt = workspace.manual_access_expires_at || null;
  const isActive =
    typeof workspace.is_active === "boolean" ? workspace.is_active : true;

  let trialDaysLeft = 0;

  if (trialEndsAt) {
    const now = Date.now();
    const trialEndTime = new Date(trialEndsAt).getTime();

    if (trialEndTime > now) {
      trialDaysLeft = Math.max(
        0,
        Math.ceil((trialEndTime - now) / (1000 * 60 * 60 * 24))
      );
    }
  }

  const manualAccessEndTime = manualAccessExpiresAt
    ? new Date(manualAccessExpiresAt).getTime()
    : null;

  const hasManualAccess =
    manualAccessOverride &&
    (!manualAccessEndTime || manualAccessEndTime > Date.now());

  const isPaid = subscriptionStatus === "active" && plan !== "free";
  const isTrialing = subscriptionStatus === "trialing" && trialDaysLeft > 0;
  const isExpired =
    subscriptionStatus === "expired" ||
    (subscriptionStatus === "trialing" &&
      !!trialEndsAt &&
      new Date(trialEndsAt).getTime() <= Date.now());

  return {
    id: workspace.id,
    name: workspace.name || "",
    plan,
    subscriptionStatus,
    billingProvider,
    manualAccessOverride,
    manualAccessExpiresAt,
    isActive,
    trialStartedAt: workspace.trial_started_at || null,
    trialEndsAt,
    trialDaysLeft,
    isPaid,
    isTrialing,
    isExpired,
    hasManualAccess,
    hasFullTrialAccess: isTrialing || isPaid || hasManualAccess,
  };
}

router.post("/register", async (req, res, next) => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const existingUser = await knex("users")
      .whereRaw("LOWER(email) = LOWER(?)", [cleanEmail])
      .first();

    if (existingUser) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const workspaceId = uuidv4();
    const userId = uuidv4();

    const now = new Date();
    const trialEndsAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const result = await knex.transaction(async (trx) => {
      await trx("workspaces").insert({
        id: workspaceId,
        name: fullName?.trim() || cleanEmail,
        plan: "free",
        subscription_status: "trialing",
        trial_started_at: now,
        trial_ends_at: trialEndsAt,
        trial_expires_at: trialEndsAt,
        billing_provider: null,
        manual_access_override: false,
        manual_access_expires_at: null,
        is_active: true,
        created_at: now,
        updated_at: now,
      });

      const insertedUsers = await trx("users")
        .insert({
          id: userId,
          email: cleanEmail,
          password_hash: passwordHash,
          full_name: fullName?.trim() || "",
          workspace_id: workspaceId,
          role: "user",
          account_status: "active",
          created_at: now,
          updated_at: now,
        })
        .returning("*");

      const newUser = insertedUsers[0];

      await trx("workspace_members").insert({
        id: uuidv4(),
        workspace_id: workspaceId,
        user_id: newUser.id,
        role: "owner",
        created_at: now,
        updated_at: now,
      });

      const workspace = await trx("workspaces")
        .where({ id: workspaceId })
        .first();

      return { user: newUser, workspace };
    });

    const accessToken = signAccessToken({
      userId: result.user.id,
      email: result.user.email,
      workspaceId: result.user.workspace_id,
      role: result.user.role || "user",
    });

    return res.status(201).json({
      user: {
        id: result.user.id,
        email: result.user.email,
        fullName: result.user.full_name || "",
        workspaceId: result.user.workspace_id,
        role: result.user.role || "user",
        accountStatus: result.user.account_status || "active",
      },
      workspace: buildWorkspaceAccess(result.workspace),
      accessToken,
    });
  } catch (error) {
    console.error("Register error:", error);
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

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

    if (user.account_status === "suspended") {
      return res.status(403).json({ message: "Account suspended." });
    }

    const workspace = await knex("workspaces")
      .where({ id: user.workspace_id })
      .first();

    const accessToken = signAccessToken({
      userId: user.id,
      email: user.email,
      workspaceId: user.workspace_id,
      role: user.role || "user",
    });

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name || "",
        workspaceId: user.workspace_id,
        role: user.role || "user",
        accountStatus: user.account_status || "active",
      },
      workspace: buildWorkspaceAccess(workspace),
      accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await knex("users")
      .select(
        "id",
        "email",
        "full_name",
        "workspace_id",
        "role",
        "account_status"
      )
      .where({ id: req.user.id })
      .first();

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const workspace = await knex("workspaces")
      .where({ id: user.workspace_id })
      .first();

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found." });
    }

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name || "",
        workspaceId: user.workspace_id,
        role: user.role || "user",
        accountStatus: user.account_status || "active",
      },
      workspace: buildWorkspaceAccess(workspace),
    });
  } catch (error) {
    console.error("Auth /me error:", error);
    next(error);
  }
});

export default router;