import express from "express";
import knex from "../db/knex.js";
import { requireAuth, requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth, requireAdmin);

function normalizeNullableDate(value) {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "__INVALID_DATE__";
  }

  return date;
}

function getTrialDaysRemaining(trialExpiresAt) {
  if (!trialExpiresAt) return null;

  const end = new Date(trialExpiresAt).getTime();
  if (Number.isNaN(end)) return null;

  const now = Date.now();
  if (end <= now) return 0;

  return Math.max(0, Math.ceil((end - now) / (1000 * 60 * 60 * 24)));
}

router.get("/overview", async (req, res, next) => {
  try {
    const [usersCountRow, workspacesCountRow, adminsCountRow] = await Promise.all([
      knex("users").count("* as count").first(),
      knex("workspaces").count("* as count").first(),
      knex("users").where({ role: "admin" }).count("* as count").first(),
    ]);

    return res.json({
      totals: {
        users: Number(usersCountRow?.count || 0),
        workspaces: Number(workspacesCountRow?.count || 0),
        admins: Number(adminsCountRow?.count || 0),
      },
    });
  } catch (error) {
    console.error("Admin overview error:", error);
    next(error);
  }
});

router.get("/users", async (req, res, next) => {
  try {
    const rows = await knex("users as u")
      .leftJoin("workspaces as w", "u.workspace_id", "w.id")
      .select(
        "u.id",
        "u.email",
        "u.full_name",
        "u.role",
        "u.account_status",
        "u.workspace_id",
        "u.created_at",
        "u.updated_at",
        "w.name as workspace_name",
        "w.plan",
        "w.subscription_status",
        "w.trial_expires_at",
        "w.billing_provider",
        "w.manual_access_override",
        "w.manual_access_expires_at",
        "w.is_active as workspace_is_active"
      )
      .orderBy("u.created_at", "desc");

    const users = rows.map((row) => ({
      ...row,
      trial_days_remaining: getTrialDaysRemaining(row.trial_expires_at),
    }));

    return res.json({ users });
  } catch (error) {
    console.error("Admin users error:", error);
    next(error);
  }
});

router.get("/workspaces", async (req, res, next) => {
  try {
    const rows = await knex("workspaces as w")
      .leftJoin("users as owner_user", "w.id", "owner_user.workspace_id")
      .select(
        "w.id",
        "w.name",
        "w.plan",
        "w.subscription_status",
        "w.trial_expires_at",
        "w.billing_provider",
        "w.manual_access_override",
        "w.manual_access_expires_at",
        "w.is_active",
        "w.created_at",
        "w.updated_at"
      )
      .countDistinct("owner_user.id as user_count")
      .groupBy(
        "w.id",
        "w.name",
        "w.plan",
        "w.subscription_status",
        "w.trial_expires_at",
        "w.billing_provider",
        "w.manual_access_override",
        "w.manual_access_expires_at",
        "w.is_active",
        "w.created_at",
        "w.updated_at"
      )
      .orderBy("w.created_at", "desc");

    const workspaces = rows.map((row) => ({
      ...row,
      trial_days_remaining: getTrialDaysRemaining(row.trial_expires_at),
    }));

    return res.json({ workspaces });
  } catch (error) {
    console.error("Admin workspaces error:", error);
    next(error);
  }
});

router.get("/workspace-members", async (req, res, next) => {
  try {
    const members = await knex("workspace_members as wm")
      .leftJoin("users as u", "wm.user_id", "u.id")
      .leftJoin("workspaces as w", "wm.workspace_id", "w.id")
      .select(
        "wm.id",
        "wm.workspace_id",
        "wm.user_id",
        "wm.role as workspace_role",
        "wm.created_at",
        "wm.updated_at",
        "u.email",
        "u.full_name",
        "u.role as platform_role",
        "u.account_status",
        "w.name as workspace_name",
        "w.plan",
        "w.subscription_status",
        "w.trial_expires_at",
        "w.is_active"
      )
      .orderBy("wm.created_at", "desc");

    return res.json({ members });
  } catch (error) {
    console.error("Admin workspace members error:", error);
    next(error);
  }
});

router.patch("/users/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role, account_status } = req.body || {};

    const updates = {};
    const now = new Date();

    if (role !== undefined) {
      const allowedRoles = ["admin", "user"];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role value" });
      }
      updates.role = role;
    }

    if (account_status !== undefined) {
      const allowedStatuses = ["active", "suspended"];
      if (!allowedStatuses.includes(account_status)) {
        return res.status(400).json({ message: "Invalid account_status value" });
      }
      updates.account_status = account_status;
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const targetUser = await knex("users").where({ id }).first();

    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (String(targetUser.id) === String(req.user.id) && account_status === "suspended") {
      return res.status(400).json({ message: "You cannot suspend your own account" });
    }

    updates.updated_at = now;

    const updated = await knex("users")
      .where({ id })
      .update(updates)
      .returning([
        "id",
        "email",
        "full_name",
        "role",
        "account_status",
        "workspace_id",
        "created_at",
        "updated_at",
      ]);

    return res.json({
      message: "User updated successfully",
      user: updated[0],
    });
  } catch (error) {
    console.error("Admin update user error:", error);
    next(error);
  }
});

router.patch("/workspaces/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      plan,
      subscription_status,
      trial_expires_at,
      billing_provider,
      manual_access_override,
      manual_access_expires_at,
      is_active,
      name,
    } = req.body || {};

    const updates = {};
    const now = new Date();

    if (name !== undefined) {
      updates.name = String(name || "").trim();
    }

    if (plan !== undefined) {
      const allowedPlans = ["free", "starter", "pro", "enterprise"];
      if (!allowedPlans.includes(plan)) {
        return res.status(400).json({ message: "Invalid plan value" });
      }
      updates.plan = plan;
    }

    if (subscription_status !== undefined) {
      const allowedStatuses = ["trialing", "active", "past_due", "cancelled", "expired"];
      if (!allowedStatuses.includes(subscription_status)) {
        return res.status(400).json({ message: "Invalid subscription_status value" });
      }
      updates.subscription_status = subscription_status;
    }

    if (billing_provider !== undefined) {
      const allowedProviders = ["stripe", "payfast", "manual", null, ""];
      if (!allowedProviders.includes(billing_provider)) {
        return res.status(400).json({ message: "Invalid billing_provider value" });
      }
      updates.billing_provider = billing_provider || null;
    }

    if (manual_access_override !== undefined) {
      updates.manual_access_override = Boolean(manual_access_override);
    }

    if (is_active !== undefined) {
      updates.is_active = Boolean(is_active);
    }

    if (trial_expires_at !== undefined) {
      const parsedTrialExpiresAt = normalizeNullableDate(trial_expires_at);
      if (parsedTrialExpiresAt === "__INVALID_DATE__") {
        return res.status(400).json({ message: "Invalid trial_expires_at value" });
      }
      updates.trial_expires_at = parsedTrialExpiresAt;
    }

    if (manual_access_expires_at !== undefined) {
      const parsedManualAccessExpiresAt = normalizeNullableDate(manual_access_expires_at);
      if (parsedManualAccessExpiresAt === "__INVALID_DATE__") {
        return res.status(400).json({ message: "Invalid manual_access_expires_at value" });
      }
      updates.manual_access_expires_at = parsedManualAccessExpiresAt;
    }

    if (!Object.keys(updates).length) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const existingWorkspace = await knex("workspaces").where({ id }).first();

    if (!existingWorkspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    updates.updated_at = now;

    const updated = await knex("workspaces")
      .where({ id })
      .update(updates)
      .returning([
        "id",
        "name",
        "plan",
        "subscription_status",
        "trial_expires_at",
        "billing_provider",
        "manual_access_override",
        "manual_access_expires_at",
        "is_active",
        "created_at",
        "updated_at",
      ]);

    return res.json({
      message: "Workspace updated successfully",
      workspace: updated[0],
    });
  } catch (error) {
    console.error("Admin update workspace error:", error);
    next(error);
  }
});

export default router;