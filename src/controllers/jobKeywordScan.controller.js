import { scanJobsByKeywordAcrossSources } from "../services/jobKeywordScanner.service.js";

function getWorkspaceId(req) {
  return req.user?.workspaceId || req.user?.workspace_id;
}

export async function runKeywordJobScan(req, res, next) {
  try {
    const workspaceId = getWorkspaceId(req);
    const { keyword } = req.body;

    const result = await scanJobsByKeywordAcrossSources({
      workspaceId,
      keyword,
    });

    res.json({
      message: "Keyword job scan completed.",
      ...result,
    });
  } catch (error) {
    next(error);
  }
}