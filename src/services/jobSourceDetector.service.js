export function detectJobSourceFromUrl(rawUrl = "") {
  const url = String(rawUrl || "").trim().toLowerCase();

  if (!url) {
    return {
      source: "manual_url",
      reason: "empty-url",
    };
  }

  if (url.includes("boards.greenhouse.io")) {
    return {
      source: "greenhouse",
      reason: "matched-greenhouse-domain",
    };
  }

  if (url.includes("jobs.lever.co")) {
    return {
      source: "lever",
      reason: "matched-lever-domain",
    };
  }

  if (url.includes("ashbyhq.com")) {
    return {
      source: "ashby",
      reason: "matched-ashby-domain",
    };
  }

  if (
    url.endsWith(".xml") ||
    url.includes("/feed") ||
    url.includes("rss")
  ) {
    return {
      source: "rss",
      reason: "matched-rss-pattern",
    };
  }

  return {
    source: "manual_url",
    reason: "fallback-manual-url",
  };
}

export function extractSourceConfigFromUrl(rawUrl = "") {
  const url = String(rawUrl || "").trim();

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    const path = parsed.pathname;

    if (host.includes("boards.greenhouse.io")) {
      const parts = path.split("/").filter(Boolean);
      const boardToken = parts[0] || "";
      return {
        source: "greenhouse",
        config: {
          boardToken,
          keyword: "",
          url,
        },
      };
    }

    if (host.includes("jobs.lever.co")) {
      const parts = path.split("/").filter(Boolean);
      const companyHandle = parts[0] || "";
      return {
        source: "lever",
        config: {
          companyHandle,
          keyword: "",
          url,
        },
      };
    }

    if (host.includes("ashbyhq.com")) {
      const parts = path.split("/").filter(Boolean);
      const orgIndex = parts.findIndex((part) => part === "jobs");
      const organizationSlug =
        orgIndex >= 0 && parts[orgIndex + 1]
          ? parts[orgIndex + 1]
          : parts[0] || "";

      return {
        source: "ashby",
        config: {
          organizationSlug,
          keyword: "",
          url,
        },
      };
    }

    if (
      url.toLowerCase().endsWith(".xml") ||
      url.toLowerCase().includes("/feed") ||
      url.toLowerCase().includes("rss")
    ) {
      return {
        source: "rss",
        config: {
          feedUrl: url,
          keyword: "",
        },
      };
    }

    return {
      source: "manual_url",
      config: {
        url,
      },
    };
  } catch {
    return {
      source: "manual_url",
      config: {
        url,
      },
    };
  }
}