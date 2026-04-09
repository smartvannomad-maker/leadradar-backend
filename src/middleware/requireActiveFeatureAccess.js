import knex from "../db/knex.js";
import { resolveWorkspaceAccess } from "../utils/billing.js";

export async function requireActiveFeatureAccess(req, res, next) {
  try {
    const workspaceId = req.user?.workspaceId || req.workspace?.id;

    if (!workspaceId) {
      return res.status(400).json({ message: "Workspace not resolved." });
    }

    const workspace = await knex("workspaces")
      .where({ id: workspaceId })
      .first();

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found." });
    }

    const access = resolveWorkspaceAccess(workspace);

    if (access.isExpired && !access.isPaid) {
      return res.status(402).json({
        message: "Trial expired. Upgrade required.",
        code: "TRIAL_EXPIRED",
        workspace: access,
      });
    }

    req.workspaceAccess = access;
    next();
  } catch (error) {
    next(error);
  }
}