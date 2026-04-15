import { scanJobsFromSources } from "../services/jobScanner.service.js";

function getWorkspaceId(req) {
  return req.user?.workspaceId || req.user?.workspace_id;
}

export async function runJobSourceScan(req, res, next) {
  try {
    const workspaceId = getWorkspaceId(req);
    const { scans = [] } = req.body;

    const result = await scanJobsFromSources({
      workspaceId,
      scans,
    });

    res.json({
      message: "Job scan completed.",
      ...result,
    });
  } catch (error) {
    next(error);
  }
}