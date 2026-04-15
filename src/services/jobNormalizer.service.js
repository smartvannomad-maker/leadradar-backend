import {
  extractTechStack,
  detectWorkModel,
  detectEmploymentType,
  extractHiringSignals,
} from "../utils/jobLead.utils.js";

function safeString(value) {
  return value ? String(value).trim() : "";
}

export function normalizeJob(raw = {}) {
  const title = safeString(raw.title);
  const companyName = safeString(raw.companyName);
  const description = safeString(raw.description);
  const source = safeString(raw.source || "unknown");
  const url = safeString(raw.url);
  const location = safeString(raw.location);
  const companyWebsite = safeString(raw.companyWebsite);

  const techStack =
    Array.isArray(raw.techStack) && raw.techStack.length
      ? raw.techStack
      : extractTechStack(`${title} ${description}`);

  const workModel = raw.workModel || detectWorkModel(`${title} ${description}`);
  const employmentType =
    raw.employmentType || detectEmploymentType(`${title} ${description}`);

  const signals =
    raw.signals || extractHiringSignals({ title, description });

  return {
    source,
    externalId: safeString(raw.externalId || url || `${source}_${companyName}_${title}`),
    url: url || null,
    title: title || "Untitled Job",
    companyName: companyName || "Unknown Company",
    location: location || null,
    employmentType: employmentType || null,
    workModel: workModel || null,
    description: description || null,
    techStack,
    signals,
    contactName: safeString(raw.contactName) || null,
    contactEmail: safeString(raw.contactEmail) || null,
    companyWebsite: companyWebsite || null,
    postedAt: raw.postedAt || null,
  };
}

export function dedupeNormalizedJobs(jobs = []) {
  const seen = new Set();
  const output = [];

  for (const job of jobs) {
    const key = [
      job.source || "",
      job.externalId || "",
      job.url || "",
      (job.companyName || "").toLowerCase(),
      (job.title || "").toLowerCase(),
    ].join("::");

    if (seen.has(key)) continue;
    seen.add(key);
    output.push(job);
  }

  return output;
}