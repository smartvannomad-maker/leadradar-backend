import { fetchText } from "../../utils/http.js";

function extractMeta(html, property) {
  const regex = new RegExp(
    `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["'][^>]*>`,
    "i"
  );
  const match = html.match(regex);
  return match ? match[1] : null;
}

function extractTitle(html) {
  const match = html.match(/<title[^>]*>(.*?)<\/title>/i);
  return match ? match[1].replace(/\s+/g, " ").trim() : null;
}

function stripHtml(html = "") {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function fetchJobsFromManualUrl({ url }) {
  if (!url) {
    throw new Error("Manual URL is required.");
  }

  const html = await fetchText(url);

  let companyWebsite = null;
  let companyName = null;

  try {
    const parsedUrl = new URL(url);
    companyWebsite = `${parsedUrl.protocol}//${parsedUrl.hostname}`;
    companyName =
      extractMeta(html, "og:site_name") ||
      parsedUrl.hostname.replace(/^www\./, "");
  } catch {
    companyWebsite = null;
    companyName = "Unknown Company";
  }

  const title =
    extractMeta(html, "og:title") ||
    extractTitle(html) ||
    "Job Listing";

  const description =
    extractMeta(html, "og:description") ||
    stripHtml(html).slice(0, 4000);

  return [
    {
      source: "manual_url",
      externalId: url,
      url,
      title,
      companyName,
      description,
      companyWebsite,
      postedAt: null,
    },
  ];
}