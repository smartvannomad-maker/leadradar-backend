import db from "../db/knex.js";
import axios from "axios";
import * as cheerio from "cheerio";

function detectSourceFromUrl(url) {
  const value = String(url || "").toLowerCase();

  if (value.includes("linkedin.com")) return "LinkedIn";
  if (value.includes("facebook.com")) return "Facebook";
  if (value.includes("indeed.")) return "Indeed";
  if (value.includes("careers24.")) return "Careers24";
  if (value.includes("pnet.")) return "PNet";
  if (value.includes("glassdoor.")) return "Glassdoor";
  if (value.includes("careerjunction.")) return "CareerJunction";
  if (value.includes("google.")) return "Google";

  return "Custom";
}

function normalizeText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function safeAbsoluteUrl(baseUrl, href) {
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return "";
  }
}

function dedupeResults(results = []) {
  const seen = new Set();
  const output = [];

  for (const item of results) {
    const key =
      item.url ||
      `${item.title || ""}__${item.company || ""}__${item.location || ""}`;

    if (!key || seen.has(key)) continue;
    seen.add(key);
    output.push(item);
  }

  return output;
}

function textIncludesKeyword(text, keyword) {
  const cleanText = normalizeText(text).toLowerCase();
  const cleanKeyword = normalizeText(keyword).toLowerCase();

  if (!cleanKeyword) return true;
  if (!cleanText) return false;

  const parts = cleanKeyword.split(/\s+/).filter(Boolean);
  if (!parts.length) return true;

  return parts.some((part) => cleanText.includes(part));
}

function isBadTitle(title = "") {
  const t = normalizeText(title).toLowerCase();

  if (!t) return true;
  if (t.length < 4) return true;

  const bannedExact = new Set([
    "sign in",
    "sign up",
    "login",
    "log in",
    "register",
    "my alerts",
    "my jobs",
    "my profile",
    "profile",
    "cv",
    "jobs",
    "alerts",
    "search",
    "menu",
    "home",
    "learn more",
  ]);

  if (bannedExact.has(t)) return true;

  const bannedContains = [
    "sign in sign up",
    "my jobs my alerts",
    "my profile & cv",
    "privacy policy",
    "terms and conditions",
    "cookie policy",
    "contact us",
    "forgot password",
    "create alert",
    "job alerts",
    "browse jobs",
    "upload cv",
  ];

  return bannedContains.some((bad) => t.includes(bad));
}

function isBadHref(url = "") {
  const u = String(url || "").toLowerCase();

  if (!u) return true;

  const banned = [
    "/login",
    "/signin",
    "/signup",
    "/register",
    "/profile",
    "/alerts",
    "/privacy",
    "/terms",
    "/contact",
    "/help",
    "/companies",
    "/recruiters",
    "/career-advice",
    "#",
    "javascript:",
    "mailto:",
  ];

  return banned.some((item) => u.includes(item));
}

function isLikelyJobUrl(url) {
  const value = String(url || "").toLowerCase();

  if (!value) return false;
  if (isBadHref(value)) return false;

  return (
    value.includes("/job") ||
    value.includes("/jobs") ||
    value.includes("/viewjob") ||
    value.includes("/jobs/view/") ||
    value.includes("jk=") ||
    value.includes("jobid") ||
    value.includes("/vacancy") ||
    value.includes("/career") ||
    value.includes("/careers") ||
    value.includes("/opportunity") ||
    value.includes("/positions") ||
    value.includes("/adverts/") ||
    value.includes("/job-detail") ||
    value.includes("/job-details") ||
    value.includes("/result/")
  );
}

function buildKeywordSearchUrl(source, keyword, location) {
  const cleanKeyword = normalizeText(keyword);
  const cleanLocation = normalizeText(location);

  const encodedKeyword = encodeURIComponent(cleanKeyword);
  const encodedLocation = encodeURIComponent(cleanLocation);
  const combined = encodeURIComponent(
    [cleanKeyword, cleanLocation].filter(Boolean).join(" ")
  );

  switch (source) {
    case "Indeed":
      return `https://za.indeed.com/jobs?q=${encodedKeyword}&l=${encodedLocation}`;

    case "LinkedIn":
      return `https://www.linkedin.com/jobs/search/?keywords=${encodedKeyword}&location=${encodedLocation}`;

    case "Google":
      return `https://www.google.com/search?q=${combined}+jobs`;

    case "PNet":
      return `https://www.pnet.co.za/jobs/${combined}`;

    case "Careers24":
      return `https://www.careers24.com/jobs/lc-${encodedLocation}/kw-${encodedKeyword}/`;

    case "CareerJunction":
      return `https://www.careerjunction.co.za/jobs/results?keywords=${encodedKeyword}&location=${encodedLocation}`;

    default:
      return "";
  }
}

function extractLocationFromText(text) {
  const value = normalizeText(text);
  if (!value) return "";

  const knownLocations = [
    "Cape Town",
    "Johannesburg",
    "Durban",
    "Pretoria",
    "Midrand",
    "Bryanston",
    "Polokwane",
    "Pietersburg",
    "Randburg",
    "Germiston",
    "Primrose",
    "Sandton",
    "Centurion",
    "Bloemfontein",
    "Port Elizabeth",
    "Gqeberha",
    "East London",
    "Nelspruit",
    "Mbombela",
    "Kimberley",
    "George",
    "Stellenbosch",
    "Paarl",
    "Bellville",
    "Somerset West",
    "Brackenfell",
    "Parow",
    "Limpopo",
    "Gauteng",
    "Western Cape",
    "Eastern Cape",
    "KwaZulu-Natal",
    "Free State",
    "Mpumalanga",
    "North West",
    "Northern Cape",
    "Remote",
    "Hybrid",
  ];

  const foundKnown = knownLocations.find((loc) =>
    value.toLowerCase().includes(loc.toLowerCase())
  );

  if (foundKnown) return foundKnown;

  const bracketMatch = value.match(/\(([^)]+)\)/);
  if (bracketMatch && bracketMatch[1]) {
    return normalizeText(bracketMatch[1]);
  }

  const locationPatterns = [
    /\b(?:in|at)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})\b/g,
    /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})\s*(?:Central|CBD|North|South|East|West)\b/g,
  ];

  for (const pattern of locationPatterns) {
    pattern.lastIndex = 0;
    const match = pattern.exec(value);
    if (match && match[1]) {
      return normalizeText(match[1]);
    }
  }

  return "";
}

function chooseBestLocation({ scrapedLocation = "", text = "" }) {
  const cleanScraped = normalizeText(scrapedLocation);
  if (cleanScraped) return cleanScraped;

  const textLocation = extractLocationFromText(text);
  if (textLocation) return textLocation;

  return "";
}

function matchesRequestedLocation(jobLocation, requestedLocation) {
  const wanted = normalizeText(requestedLocation).toLowerCase();
  if (!wanted) return true;

  const actual = normalizeText(jobLocation).toLowerCase();
  if (!actual) return false;

  return actual.includes(wanted);
}

async function fetchHtml(url) {
  const response = await axios.get(url, {
    timeout: 20000,
    maxRedirects: 5,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-ZA,en;q=0.9",
      Referer: "https://www.google.com/",
      Connection: "keep-alive",
      DNT: "1",
      "Upgrade-Insecure-Requests": "1",
    },
  });

  return response.data;
}

function makeFallbackResult({ source, url, keyword, location, reason = "" }) {
  const titleBase = keyword ? `${keyword} jobs on ${source}` : `${source} results`;

  return {
    id: `${source.toLowerCase()}-${Date.now()}-fallback`,
    title: titleBase,
    company: source,
    location: normalizeText(location),
    source,
    description:
      reason || `Open ${source} results page${location ? ` for ${location}` : ""}.`,
    url,
    jobType: "Search Results",
    isSearchResult: true,
  };
}

function buildResult({
  source,
  title,
  company = "",
  location = "",
  description = "",
  url = "",
  index = 0,
}) {
  const cleanTitle = normalizeText(title);
  const cleanCompany = normalizeText(company);
  const cleanDescription = normalizeText(description);
  const combinedText = `${cleanTitle} ${cleanCompany} ${cleanDescription}`;

  return {
    id: `${source.toLowerCase()}-${Date.now()}-${index}-${Math.random()
      .toString(36)
      .slice(2, 7)}`,
    title: cleanTitle,
    company: cleanCompany,
    location: chooseBestLocation({
      scrapedLocation: location,
      text: combinedText,
    }),
    source,
    description: cleanDescription.slice(0, 320),
    url,
    jobType: "Live Job Link",
    isSearchResult: false,
  };
}

function cleanFinalResults(results, keyword, requestedLocation = "") {
  return dedupeResults(results).filter((item) => {
    const title = normalizeText(item.title);
    const company = normalizeText(item.company);
    const description = normalizeText(item.description);
    const url = String(item.url || "");
    const location = normalizeText(item.location);

    if (!url) return false;
    if (isBadHref(url)) return false;
    if (isBadTitle(title)) return false;

    const combined = `${title} ${company} ${description}`;
    if (!textIncludesKeyword(combined, keyword)) return false;

    if (!matchesRequestedLocation(location, requestedLocation)) return false;

    return true;
  });
}

function extractIndeedJobs(html, pageUrl, keyword = "", requestedLocation = "") {
  const $ = cheerio.load(html);
  const results = [];

  $("a[href]").each((index, el) => {
    if (results.length >= 20) return false;

    const href = $(el).attr("href");
    const absoluteUrl = safeAbsoluteUrl(pageUrl, href);

    if (
      !absoluteUrl.includes("/viewjob") &&
      !absoluteUrl.includes("jk=") &&
      !absoluteUrl.includes("/rc/clk")
    ) {
      return;
    }

    const title =
      normalizeText($(el).attr("aria-label")) || normalizeText($(el).text());

    if (isBadTitle(title)) return;

    const card = $(el).closest("div, article, li");
    const context = normalizeText(card.text());

    let company = "";
    const companyEl = card.find("[data-testid='company-name']").first();
    if (companyEl.length) company = normalizeText(companyEl.text());

    let location = "";
    const locEl = card.find("[data-testid='text-location']").first();
    if (locEl.length) location = normalizeText(locEl.text());

    results.push(
      buildResult({
        source: "Indeed",
        title,
        company: company || "Indeed",
        location,
        description: context,
        url: absoluteUrl,
        index,
      })
    );
  });

  return cleanFinalResults(results, keyword, requestedLocation);
}

function extractLinkedInJobs(html, pageUrl, keyword = "", requestedLocation = "") {
  const $ = cheerio.load(html);
  const results = [];

  $("a[href]").each((index, el) => {
    if (results.length >= 20) return false;

    const href = $(el).attr("href");
    const absoluteUrl = safeAbsoluteUrl(pageUrl, href);
    const title = normalizeText($(el).text());

    if (!absoluteUrl.includes("/jobs/view/")) return;
    if (isBadTitle(title)) return;

    const card = $(el).closest("li, div, article");
    const context = normalizeText(card.text());

    let company = "";
    const subtitle = card.find(".base-search-card__subtitle").first();
    if (subtitle.length) company = normalizeText(subtitle.text());

    let location = "";
    const locEl = card.find(".job-search-card__location").first();
    if (locEl.length) location = normalizeText(locEl.text());

    results.push(
      buildResult({
        source: "LinkedIn",
        title,
        company: company || "LinkedIn",
        location,
        description: context,
        url: absoluteUrl,
        index,
      })
    );
  });

  return cleanFinalResults(results, keyword, requestedLocation);
}

function extractCareerJunctionJobs(
  html,
  pageUrl,
  keyword = "",
  requestedLocation = ""
) {
  const $ = cheerio.load(html);
  const results = [];

  const cardSelectors = [
    "article",
    "[class*='job']",
    "[class*='result']",
    "[class*='vacancy']",
    "li",
  ];

  cardSelectors.forEach((selector) => {
    $(selector).each((index, el) => {
      if (results.length >= 20) return false;

      const card = $(el);
      const cardText = normalizeText(card.text());

      if (!textIncludesKeyword(cardText, keyword)) return;
      if (cardText.length < 20) return;
      if (
        cardText.toLowerCase().includes("sign in") ||
        cardText.toLowerCase().includes("my alerts") ||
        cardText.toLowerCase().includes("my jobs") ||
        cardText.toLowerCase().includes("sign up")
      ) {
        return;
      }

      let chosenUrl = "";
      let chosenTitle = "";

      card.find("a[href]").each((_, linkEl) => {
        if (chosenUrl) return false;

        const href = $(linkEl).attr("href");
        const absoluteUrl = safeAbsoluteUrl(pageUrl, href);
        const text = normalizeText($(linkEl).text());

        if (!absoluteUrl || !isLikelyJobUrl(absoluteUrl)) return;
        if (isBadTitle(text)) return;
        if (!textIncludesKeyword(`${text} ${cardText}`, keyword)) return;

        chosenUrl = absoluteUrl;
        chosenTitle = text;
        return false;
      });

      if (!chosenUrl || !chosenTitle) return;

      let company = "";
      let location = "";

      const companyCandidates = card
        .find("h4, h5, [class*='company'], [class*='recruiter'], strong")
        .map((_, node) => normalizeText($(node).text()))
        .get()
        .filter(Boolean)
        .filter((value) => !isBadTitle(value))
        .filter((value) => value !== chosenTitle);

      if (companyCandidates.length) {
        company = companyCandidates[0];
      }

      const locationCandidates = card
        .find("[class*='location'], [class*='region'], [class*='area'], span, small")
        .map((_, node) => normalizeText($(node).text()))
        .get()
        .filter(Boolean);

      const matchedLocation = locationCandidates.find((value) =>
        /(cape town|johannesburg|durban|pretoria|midrand|bryanston|polokwane|pietersburg|randburg|germiston|primrose|sandton|centurion|bloemfontein|port elizabeth|gqeberha|east london|nelspruit|mbombela|kimberley|george|stellenbosch|paarl|bellville|somerset west|brackenfell|parow|remote|hybrid|gauteng|western cape|eastern cape|limpopo|mpumalanga|north west|northern cape|free state|kwazulu-natal)/i.test(
          value
        )
      );

      if (matchedLocation) {
        location = matchedLocation;
      }

      results.push(
        buildResult({
          source: "CareerJunction",
          title: chosenTitle,
          company: company || "CareerJunction",
          location,
          description: cardText,
          url: chosenUrl,
          index,
        })
      );
    });
  });

  return cleanFinalResults(results, keyword, requestedLocation);
}

function extractPnetJobs(html, pageUrl, keyword = "", requestedLocation = "") {
  const $ = cheerio.load(html);
  const results = [];

  $("article, li, div").each((index, el) => {
    if (results.length >= 20) return false;

    const card = $(el);
    const cardText = normalizeText(card.text());

    if (!textIncludesKeyword(cardText, keyword)) return;
    if (cardText.length < 20) return;

    let chosenUrl = "";
    let chosenTitle = "";

    card.find("a[href]").each((_, linkEl) => {
      if (chosenUrl) return false;

      const href = $(linkEl).attr("href");
      const absoluteUrl = safeAbsoluteUrl(pageUrl, href);
      const text = normalizeText($(linkEl).text());

      if (!absoluteUrl || !isLikelyJobUrl(absoluteUrl)) return;
      if (isBadTitle(text)) return;

      chosenUrl = absoluteUrl;
      chosenTitle = text;
      return false;
    });

    if (!chosenUrl || !chosenTitle) return;

    results.push(
      buildResult({
        source: "PNet",
        title: chosenTitle,
        company: "PNet",
        location: "",
        description: cardText,
        url: chosenUrl,
        index,
      })
    );
  });

  return cleanFinalResults(results, keyword, requestedLocation);
}

function extractCareers24Jobs(html, pageUrl, keyword = "", requestedLocation = "") {
  const $ = cheerio.load(html);
  const results = [];

  $("article, li, div").each((index, el) => {
    if (results.length >= 20) return false;

    const card = $(el);
    const cardText = normalizeText(card.text());

    if (!textIncludesKeyword(cardText, keyword)) return;
    if (cardText.length < 20) return;

    let chosenUrl = "";
    let chosenTitle = "";

    card.find("a[href]").each((_, linkEl) => {
      if (chosenUrl) return false;

      const href = $(linkEl).attr("href");
      const absoluteUrl = safeAbsoluteUrl(pageUrl, href);
      const text = normalizeText($(linkEl).text());

      if (!absoluteUrl || !isLikelyJobUrl(absoluteUrl)) return;
      if (isBadTitle(text)) return;

      chosenUrl = absoluteUrl;
      chosenTitle = text;
      return false;
    });

    if (!chosenUrl || !chosenTitle) return;

    results.push(
      buildResult({
        source: "Careers24",
        title: chosenTitle,
        company: "Careers24",
        location: "",
        description: cardText,
        url: chosenUrl,
        index,
      })
    );
  });

  return cleanFinalResults(results, keyword, requestedLocation);
}

function extractGenericJobLinks(
  html,
  pageUrl,
  source,
  keyword = "",
  requestedLocation = ""
) {
  const $ = cheerio.load(html);
  const results = [];

  $("a[href]").each((index, el) => {
    if (results.length >= 20) return false;

    const href = $(el).attr("href");
    const absoluteUrl = safeAbsoluteUrl(pageUrl, href);
    const text = normalizeText($(el).text());

    if (!absoluteUrl) return;
    if (!isLikelyJobUrl(absoluteUrl)) return;
    if (isBadTitle(text)) return;

    const card = $(el).closest("article, li, div");
    const context = normalizeText(card.text());

    if (context.length < 20) return;
    if (!textIncludesKeyword(`${text} ${context}`, keyword)) return;

    results.push(
      buildResult({
        source,
        title: text,
        company: source,
        location: "",
        description: context,
        url: absoluteUrl,
        index,
      })
    );
  });

  return cleanFinalResults(results, keyword, requestedLocation);
}

async function scrapeJobsFromSearchUrl({
  searchUrl,
  source,
  keyword = "",
  location = "",
}) {
  try {
    const html = await fetchHtml(searchUrl);

    let extracted = [];

    if (source === "Indeed") {
      extracted = extractIndeedJobs(html, searchUrl, keyword, location);
    } else if (source === "LinkedIn") {
      extracted = extractLinkedInJobs(html, searchUrl, keyword, location);
    } else if (source === "CareerJunction") {
      extracted = extractCareerJunctionJobs(html, searchUrl, keyword, location);
    } else if (source === "PNet") {
      extracted = extractPnetJobs(html, searchUrl, keyword, location);
    } else if (source === "Careers24") {
      extracted = extractCareers24Jobs(html, searchUrl, keyword, location);
    } else {
      extracted = extractGenericJobLinks(
        html,
        searchUrl,
        source,
        keyword,
        location
      );
    }

    if (extracted.length) {
      return extracted;
    }

    return [];
  } catch (error) {
    return [];
  }
}

export async function searchJobsByKeyword({ keyword, location }) {
  const cleanKeyword = normalizeText(keyword);
  const cleanLocation = normalizeText(location);

  if (!cleanKeyword) return [];

  const sources = ["Indeed", "LinkedIn", "PNet", "Careers24", "CareerJunction"];
  const searches = sources
    .map((source) => ({
      source,
      url: buildKeywordSearchUrl(source, cleanKeyword, cleanLocation),
    }))
    .filter((item) => item.url);

  const settled = await Promise.allSettled(
    searches.map((item) =>
      scrapeJobsFromSearchUrl({
        searchUrl: item.url,
        source: item.source,
        keyword: cleanKeyword,
        location: cleanLocation,
      })
    )
  );

  const merged = [];
  settled.forEach((result) => {
    if (result.status === "fulfilled" && Array.isArray(result.value)) {
      merged.push(...result.value);
    }
  });

  const cleaned = dedupeResults(merged);

  if (cleanLocation) {
    return cleaned.filter((item) =>
      matchesRequestedLocation(item.location, cleanLocation)
    );
  }

  return cleaned;
}

export async function searchJobsByUrl({ url, keyword = "", location = "" }) {
  const source = detectSourceFromUrl(url);
  const cleanKeyword = normalizeText(keyword);
  const cleanLocation = normalizeText(location);

  let finalSearchUrl = String(url || "").trim();

  if (cleanKeyword) {
    const built = buildKeywordSearchUrl(source, cleanKeyword, cleanLocation);
    if (built) {
      finalSearchUrl = built;
    }
  }

  const jobs = await scrapeJobsFromSearchUrl({
    searchUrl: finalSearchUrl,
    source,
    keyword: cleanKeyword,
    location: cleanLocation,
  });

  const cleaned = dedupeResults(jobs);

  if (cleanLocation) {
    return cleaned.filter((item) =>
      matchesRequestedLocation(item.location, cleanLocation)
    );
  }

  return cleaned;
}

export async function listSavedPortals({ userId, workspaceId }) {
  return db("saved_job_portals")
    .where({
      user_id: userId,
      workspace_id: workspaceId,
    })
    .orderBy("created_at", "desc");
}

export async function addSavedPortal({
  userId,
  workspaceId,
  name,
  url,
  source,
}) {
  const result = await db("saved_job_portals")
    .insert({
      user_id: userId,
      workspace_id: workspaceId,
      name,
      url,
      source: source || detectSourceFromUrl(url),
    })
    .returning("*");

  return Array.isArray(result) ? result[0] : result;
}

export async function removeSavedPortal({ id, userId, workspaceId }) {
  await db("saved_job_portals")
    .where({
      id,
      user_id: userId,
      workspace_id: workspaceId,
    })
    .del();
}

export async function removeAllSavedPortals({ userId, workspaceId }) {
  await db("saved_job_portals")
    .where({
      user_id: userId,
      workspace_id: workspaceId,
    })
    .del();
}

export async function saveJobPosts({ posts = [], userId, workspaceId }) {
  if (!Array.isArray(posts) || posts.length === 0) {
    return [];
  }

  return posts.map((post) => ({
    user_id: userId,
    workspace_id: workspaceId,
    title: post.title || "Untitled Job",
    company: post.company || "",
    location: post.location || "",
    source: post.source || "",
    url: post.url || post.link || "",
    description: post.description || post.snippet || "",
    created_at: new Date(),
    updated_at: new Date(),
  }));
}