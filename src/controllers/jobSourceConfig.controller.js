import {
  listJobSourceConfigs,
  createJobSourceConfig,
  deleteJobSourceConfig,
} from "../services/jobSourceConfig.service.js";

function getWorkspaceId(req) {
  return req.user?.workspaceId || req.user?.workspace_id;
}

export async function getJobSourceConfigs(req, res, next) {
  try {
    const workspaceId = getWorkspaceId(req);
    const sources = await listJobSourceConfigs(workspaceId);

    res.json({ sources });
  } catch (error) {
    next(error);
  }
}

export async function postJobSourceConfig(req, res, next) {
  try {
    const workspaceId = getWorkspaceId(req);
    const source = await createJobSourceConfig(workspaceId, req.body);

    res.status(201).json({
      message: "Job source saved.",
      source,
    });
  } catch (error) {
    next(error);
  }
}

export async function removeJobSourceConfig(req, res, next) {
  try {
    const workspaceId = getWorkspaceId(req);
    const { sourceId } = req.params;

    const deleted = await deleteJobSourceConfig(workspaceId, sourceId);

    if (!deleted) {
      return res.status(404).json({ message: "Saved source not found." });
    }

    res.json({ message: "Saved source deleted." });
  } catch (error) {
    next(error);
  }
}