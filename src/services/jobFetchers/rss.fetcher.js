import { XMLParser } from "fast-xml-parser";
import { fetchText } from "../../utils/http.js";

export async function fetchRssJobs({ feedUrl, keyword = "" }) {
  if (!feedUrl) {
    throw new Error("RSS feedUrl is required.");
  }

  const xml = await fetchText(feedUrl);

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "",
  });

  const parsed = parser.parse(xml);

  const items =
    parsed?.rss?.channel?.item ||
    parsed?.feed?.entry ||
    [];

  const list = Array.isArray(items) ? items : [items];

  const jobs = list
    .filter(Boolean)
    .map((item, index) => ({
      source: "rss",
      externalId: String(item.guid || item.id || item.link || index),
      url: item.link?.href || item.link || null,
      title: item.title?.["#text"] || item.title || "Untitled Job",
      companyName: "RSS Source",
      location: null,
      description:
        item.description || item.summary || item.content || "",
      postedAt: item.pubDate || item.published || item.updated || null,
      companyWebsite: null,
    }));

  if (!keyword) return jobs;

  const q = keyword.toLowerCase();
  return jobs.filter((job) =>
    `${job.title} ${job.description}`.toLowerCase().includes(q)
  );
}