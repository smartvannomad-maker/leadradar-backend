import { fetchJson } from "../../utils/http.js";

export async function fetchLeverJobs({ companyHandle, keyword = "" }) {
  if (!companyHandle) {
    throw new Error("Lever companyHandle is required.");
  }

  const url = `https://api.lever.co/v0/postings/${encodeURIComponent(
    companyHandle
  )}?mode=json`;

  const data = await fetchJson(url);

  const jobs = (data || []).map((job) => ({
    source: "lever",
    externalId: String(job.id),
    url: job.hostedUrl,
    title: job.text,
    companyName: companyHandle,
    location: job.categories?.location || null,
    description: job.descriptionPlain || job.description || "",
    employmentType: job.categories?.commitment || null,
    workModel: job.categories?.workplaceType || null,
    postedAt: job.createdAt ? new Date(job.createdAt).toISOString() : null,
    companyWebsite: null,
  }));

  if (!keyword) return jobs;

  const q = keyword.toLowerCase();
  return jobs.filter((job) =>
    `${job.title} ${job.description} ${job.location || ""}`
      .toLowerCase()
      .includes(q)
  );
}