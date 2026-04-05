// popup.js
const statusEl = document.getElementById("status");
const fullNameEl = document.getElementById("fullName");
const headlineEl = document.getElementById("headline");
const locationEl = document.getElementById("location");
const companyEl = document.getElementById("company");
const linkedinUrlEl = document.getElementById("linkedinUrl");
const categoryEl = document.getElementById("category");
const statusValueEl = document.getElementById("statusValue");
const stageEl = document.getElementById("stage");
const followUpDateEl = document.getElementById("followUpDate");
const notesEl = document.getElementById("notes");
const manualProfileTextEl = document.getElementById("manualProfileText");
const refreshBtn = document.getElementById("refreshBtn");
const parseManualBtn = document.getElementById("parseManualBtn");
const saveBtn = document.getElementById("saveBtn");

const API_URL = "http://localhost:5000/api";
const TEST_EMAIL = "smartvannomad@gmail.com";
const TEST_PASSWORD = "123456";

function setStatus(message, type = "") {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`.trim();
}

function safeTrim(value) {
  return typeof value === "string" ? value.trim() : "";
}

function cleanText(value) {
  return (value || "").replace(/\s+/g, " ").trim();
}

function unique(values) {
  return [...new Set(values.map(cleanText).filter(Boolean))];
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
  if (text.length < 8 || text.length > 220) return false;
  if (isBadLine(text)) return false;
  if (looksLikeLocation(text)) return false;
  if (fullName && (text === fullName || text.includes(fullName))) return false;
  return true;
}

function normalizeManualText(rawText) {
  if (!rawText) return [];

  const normalized = String(rawText)
    .replace(/\r\n/g, "\n")
    .replace(/[\|•·–—]/g, "\n")
    .replace(/\s*\n\s*/g, "\n")
    .trim();

  return unique(
    normalized
      .split("\n")
      .map((line) => cleanText(line))
      .filter(Boolean)
  );
}

function parseProfileText(rawText) {
  let lines = normalizeManualText(rawText);

  if (lines.length === 1 && /[\|•·–—\/]/.test(lines[0])) {
    const split = unique(
      lines[0]
        .split(/[\|•·–—\/]/)
        .map((item) => cleanText(item))
        .filter(Boolean)
    );

    if (split.length > 1) {
      lines = split;
    }
  }

  let fullName = lines.find(looksLikeName) || "";
  if (!fullName && lines.length > 0) {
    const firstLine = lines[0];
    if (!isBadLine(firstLine) && firstLine.split(" ").length <= 5) {
      fullName = firstLine;
    }
  }

  let headline = lines.find((line) => looksLikeHeadline(line, fullName)) || "";
  let location = lines.find((line) => looksLikeLocation(line)) || "";
  let company = "";

  const companyMatch = headline.match(/\bat\s+(.+)$/i);
  if (companyMatch?.[1]) {
    company = cleanText(companyMatch[1]);
  }

  if (!company && headline) {
    const secondaryMatch = headline.match(/(.+?)\s+at\s+(.+)/i);
    if (secondaryMatch?.[2]) {
      company = cleanText(secondaryMatch[2]);
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
        return /company|inc|ltd|pty|group|solutions|hotel|consulting|maintenance|electrical|capital|llc|co\.?|gmbh|sarl|ltda?/i.test(
          line
        );
      }) || "";
  }

  return {
    fullName,
    headline,
    location,
    company,
    lines,
  };
}

async function getActiveTab() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

function isLinkedInProfileUrl(url) {
  return /^https:\/\/(?:[A-Za-z0-9-]+\.)?linkedin\.com\/(?:in|pub)\/[^/?#]+(?:\/.*)?/i.test(url || "");
}

async function ensureContentScript(tabId) {
  if (!chrome.scripting) return;

  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["content.js"]
    });
  } catch (error) {
    console.warn("scripting fallback failed:", error);
  }
}

async function requestProfile(tabId) {
  let response;

  try {
    response = await chrome.tabs.sendMessage(tabId, {
      type: "LEADRADAR_GET_PROFILE"
    });
  } catch (error) {
    console.warn("sendMessage failed, injecting content script fallback:", error);
    await ensureContentScript(tabId);
    response = await chrome.tabs.sendMessage(tabId, {
      type: "LEADRADAR_GET_PROFILE"
    });
  }

  if (!response) {
    console.warn("No response from content script, injecting fallback content script.");
    await ensureContentScript(tabId);
    response = await chrome.tabs.sendMessage(tabId, {
      type: "LEADRADAR_GET_PROFILE"
    });
  }

  return response;
}

function applyProfile(profile, fallbackUrl = "") {
  fullNameEl.value = profile.fullName || "";
  headlineEl.value = profile.headline || "";
  locationEl.value = profile.location || "";
  companyEl.value = profile.company || "";
  linkedinUrlEl.value = profile.url || fallbackUrl || "";
  followUpDateEl.value = profile.followUpDate || "";
  manualProfileTextEl.value = profile.rawProfileText || manualProfileTextEl.value || "";
}

function applyParsedFields(parsed) {
  if (parsed.fullName) fullNameEl.value = parsed.fullName;
  if (parsed.headline) headlineEl.value = parsed.headline;
  if (parsed.location) locationEl.value = parsed.location;
  if (parsed.company) companyEl.value = parsed.company;
}

async function loadProfile() {
  try {
    setStatus("Checking page...");

    const tab = await getActiveTab();

    if (!tab?.id) {
      setStatus("No active tab found.", "error");
      return;
    }

    if (!isLinkedInProfileUrl(tab.url)) {
      setStatus("Open a LinkedIn profile page.", "error");
      return;
    }

    setStatus("Reading profile...");

    let profile;
    try {
      profile = await requestProfile(tab.id);
    } catch (error) {
      console.error("requestProfile error:", error);
      setStatus("Refresh LinkedIn page and try again.", "error");
      return;
    }

    if (!profile) {
      setStatus("No response from profile page.", "error");
      return;
    }

    if (!profile.ok) {
      setStatus(profile.error || "Could not read profile.", "error");
      return;
    }

    console.log("LeadRadar extracted profile:", profile);
    applyProfile(profile, tab.url);

    if (profile.fullName || profile.headline || profile.location || profile.company) {
      const methodLabel =
        profile.extractMethod === "dom"
          ? "Auto extract"
          : profile.extractMethod === "text"
          ? "Text fallback"
          : "Detected";

      setStatus(`${methodLabel} ✅`, "success");
    } else {
      console.log("LeadRadar debug:", profile.debug);
      setStatus("No profile data found. Paste manual text below.", "error");
    }
  } catch (error) {
    console.error("loadProfile error:", error);
    setStatus(`Load failed: ${error.message}`, "error");
  }
}

async function signInToBackend() {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    })
  });

  const rawText = await response.text();
  let data = {};

  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    data = { rawText };
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.error || data?.rawText || `Login failed (${response.status})`);
  }

  if (!data?.accessToken) {
    throw new Error("No access token returned from backend");
  }

  return data.accessToken;
}

function buildLeadPayload() {
  const fullName = safeTrim(fullNameEl.value);
  const headline = safeTrim(headlineEl.value);
  const location = safeTrim(locationEl.value);
  const company = safeTrim(companyEl.value);
  const linkedinUrl = safeTrim(linkedinUrlEl.value);
  const followUpDate = safeTrim(followUpDateEl.value);
  const initialNote = safeTrim(notesEl.value);
  const rawProfileText = safeTrim(manualProfileTextEl.value);

  return {
    businessName: company || fullName || "LinkedIn Lead",
    contactName: fullName,
    mobile: "",
    category: categoryEl.value || "Small Business",
    status: (statusValueEl.value || "new").toLowerCase(),
    stage: (stageEl.value || "new").toLowerCase(),
    followUpDate: followUpDate || null,
    notes: initialNote,
    notesHistory: initialNote
      ? [{ text: initialNote, createdAt: new Date().toISOString() }]
      : [],
    quoteAmount: null,
    quoteStatus: "not_sent",
    linkedinRole: headline,
    linkedinLocation: location,
    linkedinKeywords: "",
    linkedinCompany: company,
    linkedinProfileUrl: linkedinUrl,
    linkedinHeadline: headline,
    rawProfileText
  };
}

async function saveLeadToApi(accessToken) {
  const payload = buildLeadPayload();

  const response = await fetch(`${API_URL}/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify(payload)
  });

  const rawText = await response.text();
  let data = {};

  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    data = { rawText };
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.error || data?.rawText || `Save failed (${response.status})`);
  }

  return data;
}

refreshBtn.addEventListener("click", loadProfile);

parseManualBtn.addEventListener("click", () => {
  const rawText = safeTrim(manualProfileTextEl.value);

  if (!rawText) {
    setStatus("Paste profile text first.", "error");
    return;
  }

  const parsed = parseProfileText(rawText);
  applyParsedFields(parsed);

  if (parsed.fullName || parsed.headline || parsed.location || parsed.company) {
    setStatus("Manual parse fallback ✅", "success");
  } else {
    setStatus("Could not parse manual text.", "error");
  }
});

saveBtn.addEventListener("click", async () => {
  try {
    if (!safeTrim(linkedinUrlEl.value)) {
      setStatus("LinkedIn URL required.", "error");
      return;
    }

    setStatus("Signing in...");
    const accessToken = await signInToBackend();

    setStatus("Saving lead...");
    await saveLeadToApi(accessToken);

    setStatus("Lead saved successfully 🚀", "success");
  } catch (error) {
    console.error("save error:", error);
    setStatus(`Error: ${error.message}`, "error");
  }
});

loadProfile();