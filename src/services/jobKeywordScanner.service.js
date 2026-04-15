import jobSourceConfigs from "../config/jobSourceConfigs.js";
import { jobSourceRegistry } from "./jobSourceRegistry.service.js";
import { normalizeJob, dedupeNormalizedJobs } from "./jobNormalizer.service.js";
import { saveJobPosts } from "./jobLead.service.js";

export async function scanJobsByKeywordAcrossSources({
  workspaceId,
  keyword,
}) {
  const trimmedKeyword = String(keyword || "").trim();

  if (!trimmedKeyword) {
    const error = new Error("Keyword is required.");
    error.status = 400;
    throw error;
  }

  const allJobs = [];
  const sourceResults = [];

  for (const entry of jobSourceConfigs) {
    const handler = jobSourceRegistry[entry.source];

    if (!handler) {
      sourceResults.push({
        source: entry.source,
        label: entry.label,
        success: false,
        count: 0,
        error: `Unsupported source: ${entry.source}`,
      });
      continue;
    }

    try {
      const rawJobs = await handler({
        ...entry.config,
        keyword: trimmedKeyword,
      });

      const normalized = dedupeNormalizedJobs(
        (rawJobs || []).map(normalizeJob)
      );

      allJobs.push(...normalized);

      sourceResults.push({
        source: entry.source,
        label: entry.label,
        success: true,
        count: normalized.length,
      });
    } catch (error) {
      sourceResults.push({
        source: entry.source,
        label: entry.label,
        success: false,
        count: 0,
        error: error.message || "Unknown source error",
      });
    }
  }

  const deduped = dedupeNormalizedJobs(allJobs);
  const saved = await saveJobPosts(workspaceId, deduped);

  return {
    keyword: trimmedKeyword,
    totalFound: deduped.length,
    totalSaved: saved.length,
    sourceResults,
    jobs: saved,
  };
}