// content.js
(function () {
  function cleanText(value) {
    return (value || "").replace(/\s+/g, " ").trim();
  }

  function textOf(node) {
    return cleanText(node?.innerText || node?.textContent || "");
  }

  function metaContent(selector) {
    return cleanText(document.querySelector(selector)?.content || "");
  }

  function unique(values) {
    return [...new Set(values.map(cleanText).filter(Boolean))];
  }

  function getTextFromSelectors(selectors = []) {
    for (const selector of selectors) {
      const node = document.querySelector(selector);
      const text = textOf(node);
      if (text) return text;
    }
    return "";
  }

  function splitTextToLines(text) {
    return unique(
      String(text)
        .split(/[\n\|•·–—\/]+/)
        .map((line) => cleanText(line))
        .filter(Boolean)
    );
  }

  function isProfilePage() {
    return /^\/(?:in|pub)\/[^/?#]+(?:\/.*)?$/i.test(window.location.pathname);
  }

  function isBadLine(text) {
    return /followers|connections|contact info|message|follow|more|get introduced|mutual|connect|pending|remove from your network|open to work|open to|hiring|reposted|commented/i.test(
      text || ""
    );
  }

  function looksLikeLocation(text) {
    if (!text) return false;
    if (text.length < 3 || text.length > 120) return false;
    if (isBadLine(text)) return false;

    return (
      /,\s*[A-Za-z]/.test(text) ||
      /\b(?:South Africa|Western Cape|Cape Town|Johannesburg|Gauteng|Durban|Pretoria|Port Elizabeth|Gqeberha|Eastern Cape|KwaZulu-Natal|United States|United Kingdom|Netherlands|Belgium|Virginia|London|Remote|Hybrid)\b/i.test(text)
    );
  }

  function looksLikeName(text) {
    if (!text) return false;
    if (text.length < 2 || text.length > 80) return false;
    if (isBadLine(text)) return false;
    if (looksLikeLocation(text)) return false;
    if (/\bat\s+/i.test(text)) return false;
    return true;
  }

  function looksLikeHeadline(text, fullName = "") {
    if (!text) return false;
    if (text.length < 4 || text.length > 220) return false;
    if (isBadLine(text)) return false;
    if (looksLikeLocation(text)) return false;
    if (fullName && (text === fullName || text.includes(fullName))) return false;
    return true;
  }

  function scoreSection(section) {
    const text = textOf(section);
    if (!text) return -1;

    const lines = text
      .split("\n")
      .map((line) => cleanText(line))
      .filter(Boolean);

    if (!lines.length) return -1;
    if (text.length > 4500) return -1;

    let score = 0;

    if (section.querySelector("h1")) score += 10;
    if (/contact info/i.test(text)) score += 6;
    if (/followers|connections/i.test(text)) score += 4;
    if (lines.some(looksLikeLocation)) score += 5;
    if (lines.some((line) => /\bat\s+/i.test(line))) score += 3;
    if (lines.some(looksLikeName)) score += 2;

    return score;
  }

  function getTopCard() {
    const selectors = [
      '[data-test-top-card]',
      '.pv-top-card',
      '.profile-top-card',
      '.profile-card',
      'main section',
      'section',
      'main div'
    ];

    for (const selector of selectors) {
      const node = document.querySelector(selector);
      if (node) return node;
    }

    const sections = Array.from(document.querySelectorAll("main section, section, main div"));
    let best = null;
    let bestScore = -1;

    for (const section of sections) {
      const score = scoreSection(section);
      if (score > bestScore) {
        best = section;
        bestScore = score;
      }
    }

    if (best) return best;

    const h1 = document.querySelector("main h1, h1");
    return h1?.closest("section") || h1?.parentElement || document.querySelector("main") || document.body;
  }

  function parseFromLines(lines) {
    let fullName = "";
    let headline = "";
    let location = "";
    let company = "";

    const explicitName = getTextFromSelectors([
      'main h1 span[aria-hidden="true"]',
      'main h1',
      'h1 span[aria-hidden="true"]',
      'h1',
      '[class*="pv-top-card"] h1',
      '[class*="text-heading-xlarge"]',
      '[class*="profile-topcard"] h1',
      '[class*="top-card-layout__title"]'
    ]);

    const explicitHeadline = getTextFromSelectors([
      '[class*="pv-text-details__left-panel"] .text-body-medium',
      '[class*="pv-top-card"] .text-body-medium',
      '[class*="pv-top-card"] .text-body-small',
      '[class*="headline"]',
      '[class*="profile-topcard__position"]',
      '[class*="top-card-layout__headline"]'
    ]);

    const explicitLocation = getTextFromSelectors([
      '[class*="pv-top-card"] .text-body-small.inline',
      '[class*="pv-text-details__left-panel"] .text-body-small.inline',
      '[class*="pv-top-card"] .text-body-small',
      '[class*="top-card__subline-item"]',
      '[class*="top-card-layout__location"]'
    ]);

    if (looksLikeName(explicitName)) {
      fullName = explicitName;
    } else {
      fullName = lines.find(looksLikeName) || "";
    }

    if (!fullName && explicitName) {
      const candidate = cleanText(explicitName);
      const words = candidate.split(/\s+/).filter(Boolean);
      if (
        words.length > 0 &&
        words.length <= 5 &&
        candidate.length <= 80 &&
        !isBadLine(candidate) &&
        !looksLikeLocation(candidate)
      ) {
        fullName = candidate;
      }
    }

    if (!fullName) {
      fullName = lines.find((line) => {
        if (!line) return false;
        if (isBadLine(line)) return false;
        if (looksLikeLocation(line)) return false;
        if (/\bat\s+/i.test(line)) return false;
        const wordCount = line.split(/\s+/).length;
        return wordCount <= 5 && line.length <= 80;
      }) || "";
    }

    headline = explicitHeadline ||
      lines.find((line) => looksLikeHeadline(line, fullName)) ||
      lines.find((line) => line !== fullName && line !== location && !isBadLine(line) && line.length <= 220) ||
      "";
    location = explicitLocation || lines.find((line) => looksLikeLocation(line)) || "";

    const companyMatch = headline.match(/\bat\s+(.+)$/i);
    if (companyMatch?.[1]) {
      company = cleanText(companyMatch[1]);
    }

    if (!company) {
      const headlineCompanyMatch = headline.match(/(.+?)\s+at\s+(.+)/i);
      if (headlineCompanyMatch?.[2]) {
        company = cleanText(headlineCompanyMatch[2]);
      }
    }

    if (!company && headline) {
      const headlineParts = headline.split(/\||·|•|—|–/).map((part) => cleanText(part));
      if (headlineParts.length > 1) {
        const likelyCompany = headlineParts.reverse().find((part) => {
          return /company|inc|ltd|pty|group|solutions|hotel|consulting|maintenance|electrical|capital|llc|co\.?|gmbh|sarl|ltda?|studio|agency|ventures|labs|technologies|tech|partners/i.test(part) || part.split(/\s+/).length <= 4;
        });
        if (likelyCompany) {
          company = likelyCompany;
        }
      }
    }

    if (!company) {
      company =
        lines.find((line) => {
          if (!line) return false;
          if (line === fullName || line === headline || line === location) return false;
          if (isBadLine(line)) return false;
          if (looksLikeLocation(line)) return false;
          if (line.length < 2 || line.length > 120) return false;
          if (/^\d+\+?\s+(follower|connection)/i.test(line)) return false;
          return /company|inc|ltd|pty|group|solutions|hotel|consulting|maintenance|electrical|capital|llc|co\.?|gmbh|sarl|ltda?|studio|agency|ventures|labs|technologies|tech|partners/i.test(
            line
          );
        }) || "";
    }

    return {
      fullName,
      headline,
      location,
      company
    };
  }

  function extractStructured() {
    const topCard = getTopCard();
    const rawText = textOf(topCard);
    const lines = splitTextToLines(rawText);
    const parsed = parseFromLines(lines);

    return {
      method: "dom",
      source: "topCard",
      topCard,
      rawText,
      lines,
      ...parsed
    };
  }

  function extractMetaFallback() {
    const title = metaContent('meta[property="og:title"]') || document.title || "";
    const description = metaContent('meta[property="og:description"]') || "";
    const rawText = [title, description].filter(Boolean).join("\n");
    const lines = unique(
      rawText
        .split(/\||\u2014|\u2013|–|—|·|•|\//)
        .map((line) => cleanText(line))
        .filter(Boolean)
    );
    const parsed = parseFromLines(lines);

    return {
      method: "meta",
      source: "meta",
      rawText,
      lines,
      ...parsed
    };
  }

  function extractVisibleTextFallback() {
    const main = document.querySelector("main") || document.body;
    const rawText = textOf(main);
    const lines = splitTextToLines(rawText).slice(0, 120);
    const parsed = parseFromLines(lines);

    return {
      method: "text",
      rawText,
      lines,
      ...parsed
    };
  }

  function scoreProfileResult(result) {
    return (
      Number(Boolean(result.fullName)) * 4 +
      Number(Boolean(result.headline)) * 3 +
      Number(Boolean(result.location)) * 2 +
      Number(Boolean(result.company))
    );
  }

  function extractProfile() {
    if (!isProfilePage()) {
      return {
        ok: false,
        error: "Not on a LinkedIn profile page"
      };
    }

    const first = extractStructured();
    const second = extractVisibleTextFallback();
    const third = extractMetaFallback();

    const results = [first, second, third];
    const best = results.reduce((bestSoFar, candidate) => {
      if (!bestSoFar) return candidate;
      return scoreProfileResult(candidate) > scoreProfileResult(bestSoFar)
        ? candidate
        : bestSoFar;
    }, null);

    return {
      ok: true,
      url: window.location.href,
      fullName: best?.fullName || "",
      headline: best?.headline || "",
      location: best?.location || "",
      company: best?.company || "",
      extractMethod: best?.method || "unknown",
      rawProfileText: best?.rawText || "",
      debug: {
        structured: {
          method: first.method,
          fullName: first.fullName,
          headline: first.headline,
          location: first.location,
          company: first.company,
          lines: first.lines.slice(0, 20)
        },
        fallback: {
          method: second.method,
          fullName: second.fullName,
          headline: second.headline,
          location: second.location,
          company: second.company,
          lines: second.lines.slice(0, 20)
        },
        meta: {
          method: third.method,
          fullName: third.fullName,
          headline: third.headline,
          location: third.location,
          company: third.company,
          lines: third.lines.slice(0, 20)
        }
      }
    };
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === "LEADRADAR_GET_PROFILE") {
      try {
        sendResponse(extractProfile());
      } catch (error) {
        sendResponse({
          ok: false,
          error: error.message || "Failed to extract profile"
        });
      }
      return true;
    }
  });
})();