import { fetchJson } from "../../utils/http.js";

export async function fetchGreenhouseJobs({ boardToken, keyword = "" }) {
  if (!boardToken) {
    throw new Error("Greenhouse boardToken is required.");
  }

  const url = `https://boards-api.greenhouse.io/v1/boards/${encodeURIComponent(
    boardToken
  )}/jobs`;

  const data = await fetchJson(url);

  const jobs = (data.jobs || []).map((job) => ({
    source: "greenhouse",
    externalId: String(job.id),
    url: job.absolute_url,
    title: job.title,
    companyName: boardToken,
    location: job.location?.name || null,
    description: job.content || "",
    postedAt: null,
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