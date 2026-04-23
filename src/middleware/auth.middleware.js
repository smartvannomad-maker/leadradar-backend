import jwt from "jsonwebtoken";
import knex from "../db/knex.js";

function resolveWorkspaceState(workspace = {}) {
  const subscriptionStatus = workspace.subscription_status || "trialing";
  const plan = workspace.plan || "free";

  const trialEndsAt =
    workspace.trial_expires_at ||
    workspace.trial_ends_at ||
    null;

  const manualAccessOverride = Boolean(workspace.manual_access_override);
  const manualAccessExpiresAt = workspace.manual_access_expires_at || null;
  const isActive =
    typeof workspace.is_active === "boolean" ? workspace.is_active : true;

  const now = Date.now();
  const trialEndTime = trialEndsAt ? new Date(trialEndsAt).getTime() : null;
  const manualAccessEndTime = manualAccessExpiresAt
    ? new Date(manualAccessExpiresAt).getTime()
    : null;

  const hasManualAccess =
    manualAccessOverride &&
    (!manualAccessEndTime || manualAccessEndTime > now);

  const isPaid = subscriptionStatus === "active" && plan !== "free";

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
    manualAccessOverride,
    manualAccessExpiresAt,
    isActive,
    isPaid,
    isTrialing,
    isExpired,
    hasManualAccess,
    hasFullTrialAccess: isTrialing || isPaid || hasManualAccess,
  };
}

export async function requireAuth(req, res, next) {
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

    const userId = decoded.userId || decoded.id;
    if (!userId) {
      console.log("AUTH FAIL: token missing user id");
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!decoded.workspaceId) {
      console.log("AUTH FAIL: token missing workspace id");
      return res.status(401).json({
        message: "Invalid session: workspace missing",
        code: "STALE_SESSION",
      });
    }

    const dbUser = await knex("users")
      .select(
        "id",
        "email",
        "workspace_id",
        "role",
        "full_name",
        "account_status",
        "created_at",
        "updated_at"
      )
      .where({ id: userId })
      .first();

    if (!dbUser) {
      console.log("AUTH FAIL: user not found for token");
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (dbUser.account_status === "suspended") {
      console.log("AUTH FAIL: suspended user", dbUser.email);
      return res.status(403).json({ message: "Account suspended" });
    }

    req.user = {
      id: dbUser.id,
      userId: dbUser.id,
      email: dbUser.email,
      workspaceId: decoded.workspaceId,
      role: dbUser.role || "user",
      fullName: dbUser.full_name || "",
      accountStatus: dbUser.account_status || "active",
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