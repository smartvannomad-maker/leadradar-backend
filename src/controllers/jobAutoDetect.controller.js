import {
  detectJobSourceFromUrl,
  extractSourceConfigFromUrl,
} from "../services/jobSourceDetector.service.js";
import { scanJobsFromSources } from "../services/jobScanner.service.js";

function getWorkspaceId(req) {
  return req.user?.workspaceId || req.user?.workspace_id;
}

export async function detectAndScanJobUrl(req, res, next) {
  try {
    const workspaceId = getWorkspaceId(req);
    const { url } = req.body;

    if (!url || !String(url).trim()) {
      return res.status(400).json({
        message: "Public job URL is required.",
      });
    }

    const detected = detectJobSourceFromUrl(url);
    const detectedScan = extractSourceConfigFromUrl(url);

    const result = await scanJobsFromSources({
      workspaceId,
      scans: [detectedScan],
    });

    return res.json({
      message: "Auto-detect scan completed.",
      detectedSource: detected.source,
      detectedReason: detected.reason,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}