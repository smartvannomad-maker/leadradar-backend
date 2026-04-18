import jwt from "jsonwebtoken";
import knex from "../db/knex.js";

function resolveWorkspaceState(workspace = {}) {
  const subscriptionStatus = workspace.subscription_status || "trialing";
  const plan = workspace.plan || "starter";
  const trialEndsAt = workspace.trial_ends_at || null;

  const now = Date.now();
  const trialEndTime = trialEndsAt ? new Date(trialEndsAt).getTime() : null;

  const isPaid = subscriptionStatus === "active" && plan !== "starter";
  const isExpired =
    subscriptionStatus === "expired" ||
    (subscriptionStatus === "trialing" &&
      !!trialEndTime &&
      trialEndTime <= now);

  const isTrialing =
    subscriptionStatus === "trialing" &&
    !!trialEndTime &&
    trialEndTime > now;

  return {
    ...workspace,
    plan,
    subscriptionStatus,
    trialEndsAt,
    isPaid,
    isTrialing,
    isExpired,
    hasFullTrialAccess: isTrialing || isPaid,
  };
}

export function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      console.log("AUTH FAIL: no bearer token");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      ...decoded,
      id: decoded.userId,
      userId: decoded.userId,
      workspaceId: decoded.workspaceId,
      email: decoded.email,
      role: decoded.role || "user",
    };

    console.log("AUTH OK:", req.user);

    return next();
  } catch (error) {
    console.log("AUTH FAIL:", error.name, error.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  return next();
}

export async function attachWorkspaceAccess(req, res, next) {
  try {
    if (!req.user?.workspaceId) {
      return res.status(400).json({ message: "Workspace not resolved" });
    }

    const workspace = await knex("workspaces")
      .where({ id: req.user.workspaceId })
      .first();

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const resolved = resolveWorkspaceState(workspace);

    if (
      workspace.subscription_status !== "expired" &&
      resolved.isExpired
    ) {
      await knex("workspaces")
        .where({ id: workspace.id })
        .update({
          subscription_status: "expired",
          updated_at: new Date(),
        });

      resolved.subscription_status = "expired";
      resolved.subscriptionStatus = "expired";
      resolved.isExpired = true;
      resolved.isTrialing = false;
      resolved.hasFullTrialAccess = false;
    }

    req.workspaceAccess = resolved;
    return next();
  } catch (error) {
    console.error("attachWorkspaceAccess error:", error);
    return res.status(500).json({ message: "Could not verify workspace access" });
  }
}

export function requirePremiumAccess(req, res, next) {
  if (req.user?.role === "admin") {
    return next();
  }

  const workspace = req.workspaceAccess;

  if (!workspace) {
    return res.status(500).json({ message: "Workspace access not loaded" });
  }

  if (workspace.hasFullTrialAccess) {
    return next();
  }

  return res.status(403).json({
    message: "Trial expired. Upgrade your plan to continue using this feature.",
    code: "TRIAL_EXPIRED",
  });
}