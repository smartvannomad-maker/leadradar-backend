import { jobSourceRegistry } from "./jobSourceRegistry.service.js";
import { normalizeJob, dedupeNormalizedJobs } from "./jobNormalizer.service.js";
import { saveJobPosts } from "./jobLead.service.js";

export async function scanJobsFromSources({ workspaceId, scans = [] }) {
  const allJobs = [];
  const sourceResults = [];

  for (const scan of scans) {
    const source = scan.source;
    const handler = jobSourceRegistry[source];

    if (!handler) {
      sourceResults.push({
        source,
        success: false,
        error: `Unsupported source: ${source}`,
        count: 0,
      });
      continue;
    }

    try {
      const rawJobs = await handler(scan.config || {});
      const normalized = dedupeNormalizedJobs(
        (rawJobs || []).map(normalizeJob)
      );

      allJobs.push(...normalized);

      sourceResults.push({
        source,
        success: true,
        count: normalized.length,
      });
    } catch (error) {
      sourceResults.push({
        source,
        success: false,
        error: error.message || "Unknown source error",
        count: 0,
      });
    }
  }

  const dedupedAcrossSources = dedupeNormalizedJobs(allJobs);
  const saved = await saveJobPosts(workspaceId, dedupedAcrossSources);

  return {
    totalFound: dedupedAcrossSources.length,
    totalSaved: saved.length,
    sourceResults,
    jobs: saved,
  };
}