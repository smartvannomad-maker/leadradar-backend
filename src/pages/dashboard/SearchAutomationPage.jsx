import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Sparkles,
  Building2,
  Users,
  MessageSquareText,
  Wand2,
  Globe,
} from "lucide-react";
import ExpiredTrialGate from "../../components/ExpiredTrialGate";
import { styles } from "../../styles/dashboardStyles";
import { getCurrentPlan } from "../../utils/currentPlan";
import { canAccess, getAllowedAiModes } from "../../utils/planAccess";

const pageStyles = {
  page: {
    display: "grid",
    gap: 24,
  },
  hero: {
    ...styles.card,
    padding: 24,
    background:
      "linear-gradient(135deg, #eff6ff 0%, #ffffff 52%, #f8fafc 100%)",
    border: "1px solid #dbeafe",
    boxShadow: "0 20px 50px rgba(15, 23, 42, 0.06)",
  },
  heroTop: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 18,
    flexWrap: "wrap",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    borderRadius: 999,
    background: "#dbeafe",
    color: "#1d4ed8",
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: "0.04em",
  },
  title: {
    margin: "12px 0 8px",
    fontSize: 34,
    lineHeight: 1.08,
    fontWeight: 900,
    color: "#0f172a",
    letterSpacing: "-0.04em",
  },
  subtitle: {
    margin: 0,
    maxWidth: 820,
    fontSize: 15,
    lineHeight: 1.75,
    color: "#64748b",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 14,
    marginTop: 22,
  },
  statCard: {
    padding: 16,
    borderRadius: 20,
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    boxShadow: "0 12px 28px rgba(15, 23, 42, 0.05)",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: 700,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 28,
    color: "#0f172a",
    fontWeight: 900,
    letterSpacing: "-0.03em",
  },
  mainGrid: {
    display: "grid",
    gridTemplateColumns: "minmax(380px, 1.05fr) minmax(360px, 0.95fr)",
    gap: 24,
    alignItems: "start",
  },
  sectionCard: {
    ...styles.card,
    padding: 24,
    borderRadius: 28,
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  sectionIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    background: "linear-gradient(135deg, #dbeafe 0%, #eef2ff 100%)",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 24px rgba(59,130,246,0.12)",
    flexShrink: 0,
  },
  sectionTitle: {
    margin: 0,
    fontSize: 26,
    color: "#0f172a",
    fontWeight: 900,
    letterSpacing: "-0.03em",
  },
  sectionSubtitle: {
    margin: "0 0 22px",
    color: "#64748b",
    fontSize: 14,
    lineHeight: 1.7,
  },
  modeRow: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 18,
  },
  modeButton: {
    padding: "10px 14px",
    borderRadius: 14,
    border: "1px solid #dbeafe",
    background: "#ffffff",
    color: "#1e293b",
    fontWeight: 800,
    fontSize: 13,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  modeButtonActive: {
    background: "#2563eb",
    color: "#ffffff",
    border: "1px solid #2563eb",
    boxShadow: "0 10px 24px rgba(37,99,235,0.18)",
  },
  toggleRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
    flexWrap: "wrap",
  },
  toggleButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 14px",
    borderRadius: 14,
    border: "1px solid #dbeafe",
    background: "#ffffff",
    color: "#1e293b",
    fontWeight: 800,
    fontSize: 13,
    cursor: "pointer",
  },
  toggleButtonActive: {
    background: "#eff6ff",
    color: "#1d4ed8",
    border: "1px solid #bfdbfe",
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 16,
  },
  fieldFull: {
    gridColumn: "1 / -1",
  },
  label: {
    display: "block",
    marginBottom: 8,
    fontSize: 13,
    fontWeight: 800,
    color: "#0f172a",
  },
  input: {
    ...styles.input,
    borderRadius: 16,
    minHeight: 54,
  },
  textarea: {
    ...styles.textarea,
    borderRadius: 16,
    minHeight: 104,
    resize: "vertical",
  },
  helper: {
    marginTop: 8,
    fontSize: 12,
    color: "#64748b",
    lineHeight: 1.6,
  },
  actionRow: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    marginTop: 22,
  },
  primaryButton: {
    border: 0,
    borderRadius: 16,
    padding: "13px 18px",
    fontWeight: 800,
    fontSize: 14,
    color: "#ffffff",
    background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
    cursor: "pointer",
    boxShadow: "0 16px 34px rgba(59,130,246,0.24)",
  },
  secondaryButton: {
    borderRadius: 16,
    padding: "13px 18px",
    fontWeight: 800,
    fontSize: 14,
    color: "#334155",
    background: "#ffffff",
    border: "1px solid #dbe3f0",
    cursor: "pointer",
  },
  subtleNote: {
    marginTop: 16,
    padding: 14,
    borderRadius: 18,
    background: "#f8fbff",
    border: "1px solid #dbeafe",
    color: "#475569",
    fontSize: 13,
    lineHeight: 1.7,
  },
  stack: {
    display: "grid",
    gap: 16,
  },
  outputCard: {
    borderRadius: 22,
    padding: 18,
    background: "#fbfdff",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 24px rgba(15,23,42,0.04)",
  },
  outputHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  outputTitle: {
    margin: 0,
    fontSize: 15,
    fontWeight: 900,
    color: "#0f172a",
  },
  outputBody: {
    margin: 0,
    fontSize: 14,
    lineHeight: 1.8,
    color: "#334155",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  copyButton: {
    border: "1px solid #dbe3f0",
    background: "#ffffff",
    color: "#1d4ed8",
    borderRadius: 12,
    padding: "8px 12px",
    fontSize: 12,
    fontWeight: 800,
    cursor: "pointer",
  },
  tagsWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  },
  tag: {
    display: "inline-flex",
    alignItems: "center",
    padding: "9px 12px",
    borderRadius: 999,
    background: "#eff6ff",
    border: "1px solid #dbeafe",
    color: "#1d4ed8",
    fontSize: 13,
    fontWeight: 800,
  },
  successMessage: {
    marginTop: 14,
    padding: "12px 14px",
    borderRadius: 16,
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#166534",
    fontSize: 13,
    fontWeight: 700,
  },
  infoBanner: {
    marginTop: 14,
    padding: "12px 14px",
    borderRadius: 16,
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    color: "#1e40af",
    fontSize: 13,
    fontWeight: 700,
    lineHeight: 1.6,
  },
};

const responsiveStyles = `
@media (max-width: 1180px) {
  .lead-search-main-grid {
    grid-template-columns: 1fr !important;
  }
}
@media (max-width: 820px) {
  .lead-search-form-grid,
  .lead-search-stats-grid {
    grid-template-columns: 1fr !important;
  }
}
`;

const defaultForm = {
  campaignName: "",
  industry: "",
  location: "",
  companyType: "",
  companySize: "",
  roles: "",
  keywords: "",
  excludeKeywords: "",
};

const roleSuggestionsMap = [
  {
    match: ["sales", "revenue", "growth", "business development"],
    titles: [
      "Head of Sales",
      "Sales Director",
      "VP Sales",
      "Revenue Operations Manager",
      "Business Development Director",
    ],
  },
  {
    match: ["marketing", "demand gen", "performance", "brand"],
    titles: [
      "Head of Marketing",
      "Marketing Director",
      "Growth Marketing Manager",
      "Demand Generation Manager",
      "CMO",
    ],
  },
  {
    match: ["hr", "people", "talent", "recruitment"],
    titles: [
      "HR Director",
      "Head of People",
      "Talent Acquisition Manager",
      "People Operations Lead",
      "Recruitment Manager",
    ],
  },
  {
    match: ["operations", "ops", "supply chain"],
    titles: [
      "Operations Director",
      "Head of Operations",
      "General Manager",
      "COO",
      "Supply Chain Manager",
    ],
  },
  {
    match: ["it", "technology", "tech", "engineering", "software"],
    titles: [
      "CTO",
      "Head of Engineering",
      "Engineering Manager",
      "IT Manager",
      "Technology Director",
    ],
  },
  {
    match: ["finance", "accounts", "accounting"],
    titles: [
      "Finance Director",
      "CFO",
      "Financial Controller",
      "Head of Finance",
      "Accounts Manager",
    ],
  },
];

const intentSignals = [
  "lead generation",
  "client acquisition",
  "sales pipeline",
  "business development",
  "outbound sales",
  "growth",
  "appointment setting",
  "new business",
];

function normalizeList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function titleCase(value) {
  return String(value || "")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function uniqueArray(values) {
  return [...new Set(values.filter(Boolean))];
}

function quoteIfNeeded(value) {
  const clean = String(value || "").trim();
  if (!clean) return "";
  return clean.includes(" ") ? `"${clean}"` : clean;
}

function makeOrGroup(values) {
  const cleaned = uniqueArray(
    values.map((v) => String(v || "").trim()).filter(Boolean)
  );
  if (!cleaned.length) return "";
  if (cleaned.length === 1) return quoteIfNeeded(cleaned[0]);
  return `(${cleaned.map(quoteIfNeeded).join(" OR ")})`;
}

function buildSuggestedTitles({ roles, industry, companyType, companySize }) {
  const rolesLower = String(roles || "").toLowerCase();
  const companyTypeLower = String(companyType || "").toLowerCase();
  const companySizeLower = String(companySize || "").toLowerCase();
  const industryLower = String(industry || "").toLowerCase();

  const suggestions = [];

  roleSuggestionsMap.forEach((group) => {
    if (group.match.some((term) => rolesLower.includes(term))) {
      suggestions.push(...group.titles);
    }
  });

  if (companyTypeLower.includes("startup")) {
    suggestions.push("Founder", "Co-Founder", "CEO");
  }

  if (companyTypeLower.includes("agency")) {
    suggestions.push("Managing Director", "Client Services Director");
  }

  if (
    companySizeLower.includes("1-10") ||
    companySizeLower.includes("11-50")
  ) {
    suggestions.push("Founder", "Owner", "Managing Director");
  }

  if (
    companySizeLower.includes("201") ||
    companySizeLower.includes("500")
  ) {
    suggestions.push("Department Head", "Regional Director");
  }

  if (industryLower.includes("software") || industryLower.includes("saas")) {
    suggestions.push("Product Manager", "VP Operations");
  }

  return uniqueArray(suggestions).slice(0, 8);
}

function buildCampaignName(form) {
  const parts = [form.industry, form.location, form.roles]
    .map((item) => String(item || "").trim())
    .filter(Boolean);

  if (!parts.length) return "New AI Lead Search";
  return parts.map(titleCase).join(" • ");
}

function compressLinkedInPeopleQuery(form, roles, keywords) {
  const primaryRole = roles[0] || "";
  const industry = String(form.industry || "").trim();
  const firstKeyword = keywords[0] || "";

  const simple = [primaryRole, industry].filter(Boolean).join(" ").trim();
  if (simple) return simple;

  const fallback = [primaryRole, firstKeyword].filter(Boolean).join(" ").trim();
  if (fallback) return fallback;

  return industry || firstKeyword || primaryRole || "";
}

function shouldAutoSimplifyLinkedInPeople(query) {
  if (!query) return false;

  const queryText = String(query);
  const wordCount = queryText.split(/\s+/).filter(Boolean).length;
  const hasBoolean = /\bOR\b|\bAND\b|\bNOT\b|\(|\)/.test(queryText);

  return queryText.length > 42 || wordCount > 5 || hasBoolean;
}

function buildQueries(form, mode, autoSimplifyLinkedIn) {
  const keywords = normalizeList(form.keywords);
  const excludes = normalizeList(form.excludeKeywords);
  const roles = normalizeList(form.roles);
  const titles = buildSuggestedTitles(form);

  const lightRoleBlock = uniqueArray([...roles]).slice(0, 2);
  const suggestedRoleBlock = uniqueArray([...roles, ...titles]).slice(0, 4);

  let rawLinkedinPeopleQuery = "";
  let linkedinPeopleQuery = "";
  let linkedinCompanyQuery = "";
  let googlePeopleQuery = "";
  let googleCompanyQuery = "";
  let googleOpenWebQuery = "";
  let googleIntentQuery = "";

  if (mode === "broad") {
    rawLinkedinPeopleQuery = [
      lightRoleBlock[0] || "",
      String(form.industry || "").trim(),
    ]
      .filter(Boolean)
      .join(" ")
      .trim();
  }

  if (mode === "balanced") {
    rawLinkedinPeopleQuery = [
      makeOrGroup(lightRoleBlock),
      form.industry ? quoteIfNeeded(form.industry) : "",
      keywords[0] ? quoteIfNeeded(keywords[0]) : "",
    ]
      .filter(Boolean)
      .join(" ")
      .trim();
  }

  if (mode === "precise") {
    rawLinkedinPeopleQuery = [
      makeOrGroup(suggestedRoleBlock),
      form.industry ? quoteIfNeeded(form.industry) : "",
      keywords.slice(0, 2).length ? makeOrGroup(keywords.slice(0, 2)) : "",
    ]
      .filter(Boolean)
      .join(" ")
      .trim();
  }

  const simplifiedLinkedinPeopleQuery = compressLinkedInPeopleQuery(
    form,
    lightRoleBlock,
    keywords
  );

  const autoSimplified =
    autoSimplifyLinkedIn &&
    shouldAutoSimplifyLinkedInPeople(rawLinkedinPeopleQuery);

  linkedinPeopleQuery = autoSimplified
    ? simplifiedLinkedinPeopleQuery
    : rawLinkedinPeopleQuery || simplifiedLinkedinPeopleQuery;

  linkedinCompanyQuery = [
    form.industry ? quoteIfNeeded(form.industry) : "",
    form.companyType ? quoteIfNeeded(form.companyType) : "",
    mode !== "broad" && keywords[0] ? quoteIfNeeded(keywords[0]) : "",
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  googlePeopleQuery = [
    "site:linkedin.com/in",
    makeOrGroup(suggestedRoleBlock),
    form.industry ? quoteIfNeeded(form.industry) : "",
    keywords.slice(0, 2).length ? makeOrGroup(keywords.slice(0, 2)) : "",
    form.location ? quoteIfNeeded(form.location) : "",
    excludes.slice(0, 3).map((word) => `-${quoteIfNeeded(word)}`).join(" "),
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  googleCompanyQuery = [
    "site:linkedin.com/company",
    form.industry ? quoteIfNeeded(form.industry) : "",
    form.companyType ? quoteIfNeeded(form.companyType) : "",
    keywords.slice(0, 2).length ? makeOrGroup(keywords.slice(0, 2)) : "",
    form.location ? quoteIfNeeded(form.location) : "",
    excludes.slice(0, 3).map((word) => `-${quoteIfNeeded(word)}`).join(" "),
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  googleOpenWebQuery = [
    form.industry ? quoteIfNeeded(form.industry) : "",
    form.companyType ? quoteIfNeeded(form.companyType) : "",
    form.location ? quoteIfNeeded(form.location) : "",
    keywords.slice(0, 2).length ? makeOrGroup(keywords.slice(0, 2)) : "",
    excludes.slice(0, 3).map((word) => `-${quoteIfNeeded(word)}`).join(" "),
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  googleIntentQuery = [
    form.industry ? quoteIfNeeded(form.industry) : "",
    form.location ? quoteIfNeeded(form.location) : "",
    makeOrGroup(intentSignals.slice(0, mode === "broad" ? 3 : 5)),
    keywords[0] ? quoteIfNeeded(keywords[0]) : "",
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  return {
    titles,
    rawLinkedinPeopleQuery,
    simplifiedLinkedinPeopleQuery,
    linkedinPeopleQuery,
    linkedinCompanyQuery,
    googlePeopleQuery,
    googleCompanyQuery,
    googleOpenWebQuery,
    googleIntentQuery,
    autoSimplified,
  };
}

function buildOutreachOpener(form, titles) {
  const primaryTitle = titles[0] || normalizeList(form.roles)[0] || "team lead";
  const industry = form.industry || "your industry";
  const location = form.location ? ` in ${form.location}` : "";
  const keywordLine = normalizeList(form.keywords).slice(0, 2).join(" and ");

  return `Hi {{firstName}}, I came across your profile while researching ${industry}${location} and noticed you’re likely involved in ${primaryTitle}. ${
    keywordLine
      ? `I’m speaking with teams focused on ${keywordLine},`
      : "I’m speaking with teams looking to improve pipeline quality,"
  } and thought it made sense to reach out. Open to a quick conversation?`;
}

function buildWhyItWorks(form, titles, mode, autoSimplified) {
  const modeText =
    mode === "broad"
      ? "Broad mode prioritizes getting results by keeping the LinkedIn people query extremely simple."
      : mode === "balanced"
      ? "Balanced mode mixes relevance and result volume."
      : "Precise mode targets narrower matches for stronger intent.";

  const simplifyText = autoSimplified
    ? "Auto Simplify compressed the LinkedIn People query to improve the chance of results."
    : "The LinkedIn People query stayed in its normal mode format.";

  const roleReason =
    titles.length > 0
      ? `The search expands your title targeting with close decision-maker variants like ${titles
          .slice(0, 3)
          .join(", ")}.`
      : "The search stays focused on the roles you entered.";

  const webReason =
    "Open Web search helps find websites, directories, listings, and broader company mentions outside LinkedIn. Intent search helps surface companies showing signs they may need lead generation or outbound support.";

  return `${modeText} ${simplifyText} ${roleReason} ${webReason}`;
}

function buildLinkedInPeopleUrl(query) {
  return `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(
    query
  )}`;
}

function buildLinkedInCompanyUrl(query) {
  return `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(
    query
  )}`;
}

function buildGoogleUrl(query) {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

function copyToClipboard(value) {
  if (!value) return;
  navigator.clipboard.writeText(value);
}

function SearchAutomationPageContent() {
  const currentPlan = getCurrentPlan();
  const allowedModes = getAllowedAiModes(currentPlan);
  const canSaveCampaigns = canAccess(currentPlan, "canSaveCampaigns");
  const canUseGoogleIntent = canAccess(currentPlan, "canUseGoogleIntent");
  const canUseGoogleOpenWeb = canAccess(currentPlan, "canUseGoogleOpenWeb");

  const [form, setForm] = useState(defaultForm);
  const [searchMode, setSearchMode] = useState(
    allowedModes.includes("broad") ? "broad" : allowedModes[0] || "broad"
  );
  const [autoSimplifyLinkedIn, setAutoSimplifyLinkedIn] = useState(true);
  const [savedMessage, setSavedMessage] = useState("");
  const [copiedKey, setCopiedKey] = useState("");

  useEffect(() => {
    if (!allowedModes.includes(searchMode)) {
      setSearchMode(allowedModes[0] || "broad");
    }
  }, [allowedModes, searchMode]);

  useEffect(() => {
    const timer = copiedKey ? setTimeout(() => setCopiedKey(""), 1400) : null;
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [copiedKey]);

  useEffect(() => {
    if (!savedMessage) return;
    const timer = setTimeout(() => setSavedMessage(""), 2200);
    return () => clearTimeout(timer);
  }, [savedMessage]);

  const generated = useMemo(() => {
    const campaignName = form.campaignName.trim() || buildCampaignName(form);
    const {
      titles,
      rawLinkedinPeopleQuery,
      simplifiedLinkedinPeopleQuery,
      linkedinPeopleQuery,
      linkedinCompanyQuery,
      googlePeopleQuery,
      googleCompanyQuery,
      googleOpenWebQuery,
      googleIntentQuery,
      autoSimplified,
    } = buildQueries(form, searchMode, autoSimplifyLinkedIn);

    return {
      campaignName,
      suggestedTitles: titles,
      rawLinkedinPeopleQuery,
      simplifiedLinkedinPeopleQuery,
      linkedinPeopleQuery,
      linkedinCompanyQuery,
      googlePeopleQuery,
      googleCompanyQuery,
      googleOpenWebQuery,
      googleIntentQuery,
      autoSimplified,
      outreachOpener: buildOutreachOpener(form, titles),
      whyThisWorks: buildWhyItWorks(
        form,
        titles,
        searchMode,
        autoSimplified
      ),
      linkedInPeopleUrl: buildLinkedInPeopleUrl(linkedinPeopleQuery),
      linkedInCompanyUrl: buildLinkedInCompanyUrl(linkedinCompanyQuery),
      googlePeopleUrl: buildGoogleUrl(googlePeopleQuery),
      googleCompanyUrl: buildGoogleUrl(googleCompanyQuery),
      googleOpenWebUrl: buildGoogleUrl(googleOpenWebQuery),
      googleIntentUrl: buildGoogleUrl(googleIntentQuery),
    };
  }, [form, searchMode, autoSimplifyLinkedIn]);

  const stats = useMemo(() => {
    return {
      filtersUsed: [
        form.industry,
        form.location,
        form.companyType,
        form.companySize,
        form.roles,
        form.keywords,
        form.excludeKeywords,
      ].filter((item) => String(item || "").trim()).length,
      titleCount: generated.suggestedTitles.length,
      keywordCount: normalizeList(form.keywords).length,
    };
  }, [form, generated.suggestedTitles.length]);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleReset = () => {
    setForm(defaultForm);
    setSearchMode(
      allowedModes.includes("broad") ? "broad" : allowedModes[0] || "broad"
    );
    setAutoSimplifyLinkedIn(true);
  };

  const handleSaveCampaign = () => {
    if (!canSaveCampaigns) {
      window.location.href = "/dashboard/billing";
      return;
    }

    const payload = {
      id: `campaign_${Date.now()}`,
      savedAt: new Date().toISOString(),
      mode: searchMode,
      autoSimplifyLinkedIn,
      form,
      generated,
    };

    const existing = JSON.parse(
      localStorage.getItem("leadradar_search_campaigns") || "[]"
    );

    localStorage.setItem(
      "leadradar_search_campaigns",
      JSON.stringify([payload, ...existing].slice(0, 100))
    );

    setSavedMessage(`Campaign saved: ${generated.campaignName}`);
  };

  const handleCopy = (key, value) => {
    copyToClipboard(value);
    setCopiedKey(key);
  };

  return (
    <div style={pageStyles.page}>
      <style>{responsiveStyles}</style>

      <section style={pageStyles.hero}>
        <div style={pageStyles.heroTop}>
          <div>
            <div style={pageStyles.badge}>
              <Sparkles size={14} />
              AI LEAD SEARCH
            </div>

            <h1 style={pageStyles.title}>
              Prospect faster with smarter search building
            </h1>
            <p style={pageStyles.subtitle}>
              Build lightweight LinkedIn people searches, stronger Google X-ray
              searches, open web discovery queries, suggested decision-maker
              titles, and a first outreach angle without changing the rest of
              your dashboard flow.
            </p>
          </div>
        </div>

        <div style={pageStyles.statsGrid} className="lead-search-stats-grid">
          <div style={pageStyles.statCard}>
            <div style={pageStyles.statLabel}>ICP Filters</div>
            <div style={pageStyles.statValue}>{stats.filtersUsed}</div>
          </div>

          <div style={pageStyles.statCard}>
            <div style={pageStyles.statLabel}>Suggested Titles</div>
            <div style={pageStyles.statValue}>{stats.titleCount}</div>
          </div>

          <div style={pageStyles.statCard}>
            <div style={pageStyles.statLabel}>Keywords</div>
            <div style={pageStyles.statValue}>{stats.keywordCount}</div>
          </div>
        </div>
      </section>

      <div style={pageStyles.mainGrid} className="lead-search-main-grid">
        <section style={pageStyles.sectionCard}>
          <div style={pageStyles.sectionHeader}>
            <div style={pageStyles.sectionIconWrap}>
              <Search size={20} />
            </div>
            <h2 style={pageStyles.sectionTitle}>ICP Builder</h2>
          </div>

          <p style={pageStyles.sectionSubtitle}>
            Define who you want to target and the search outputs will update
            live.
          </p>

          <div style={pageStyles.modeRow}>
            {["broad", "balanced", "precise"].map((mode) => {
              const isAllowed = allowedModes.includes(mode);

              return (
                <button
                  key={mode}
                  type="button"
                  onClick={() => isAllowed && setSearchMode(mode)}
                  style={{
                    ...pageStyles.modeButton,
                    ...(searchMode === mode && isAllowed
                      ? pageStyles.modeButtonActive
                      : {}),
                    opacity: isAllowed ? 1 : 0.45,
                    cursor: isAllowed ? "pointer" : "not-allowed",
                  }}
                  title={isAllowed ? "" : "Upgrade required"}
                >
                  {mode.toUpperCase()} {!isAllowed ? "🔒" : ""}
                </button>
              );
            })}
          </div>

          <div style={pageStyles.toggleRow}>
            <button
              type="button"
              onClick={() => setAutoSimplifyLinkedIn((prev) => !prev)}
              style={{
                ...pageStyles.toggleButton,
                ...(autoSimplifyLinkedIn
                  ? pageStyles.toggleButtonActive
                  : {}),
              }}
            >
              <Wand2 size={15} />
              Auto Simplify LinkedIn People
            </button>
          </div>

          <div style={pageStyles.formGrid} className="lead-search-form-grid">
            <div style={pageStyles.fieldFull}>
              <label style={pageStyles.label}>Campaign name</label>
              <input
                style={pageStyles.input}
                placeholder="Example: SaaS founders in Cape Town"
                value={form.campaignName}
                onChange={(e) => updateField("campaignName", e.target.value)}
              />
            </div>

            <div>
              <label style={pageStyles.label}>Industry</label>
              <input
                style={pageStyles.input}
                placeholder="marketing agency, saas, recruitment"
                value={form.industry}
                onChange={(e) => updateField("industry", e.target.value)}
              />
            </div>

            <div>
              <label style={pageStyles.label}>Location</label>
              <input
                style={pageStyles.input}
                placeholder="Cape Town, South Africa"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
              />
            </div>

            <div>
              <label style={pageStyles.label}>Company type</label>
              <input
                style={pageStyles.input}
                placeholder="Startup, Agency, SME, Enterprise"
                value={form.companyType}
                onChange={(e) => updateField("companyType", e.target.value)}
              />
            </div>

            <div>
              <label style={pageStyles.label}>Company size</label>
              <input
                style={pageStyles.input}
                placeholder="1-10, 11-50, 51-200"
                value={form.companySize}
                onChange={(e) => updateField("companySize", e.target.value)}
              />
            </div>

            <div style={pageStyles.fieldFull}>
              <label style={pageStyles.label}>Roles / titles</label>
              <textarea
                style={pageStyles.textarea}
                placeholder="Founder, Owner, Head of Sales"
                value={form.roles}
                onChange={(e) => updateField("roles", e.target.value)}
              />
            </div>

            <div style={pageStyles.fieldFull}>
              <label style={pageStyles.label}>Keywords</label>
              <textarea
                style={pageStyles.textarea}
                placeholder="lead generation, b2b sales, outbound, crm"
                value={form.keywords}
                onChange={(e) => updateField("keywords", e.target.value)}
              />
            </div>

            <div style={pageStyles.fieldFull}>
              <label style={pageStyles.label}>Exclude keywords</label>
              <textarea
                style={pageStyles.textarea}
                placeholder="job, hiring, intern, recruiter"
                value={form.excludeKeywords}
                onChange={(e) => updateField("excludeKeywords", e.target.value)}
              />
              <div style={pageStyles.helper}>
                Use comma-separated values. Exclusions mainly help Google search.
              </div>
            </div>
          </div>

          <div style={pageStyles.actionRow}>
            <button
              type="button"
              style={pageStyles.primaryButton}
              onClick={handleSaveCampaign}
            >
              {canSaveCampaigns ? "Save campaign" : "Save Campaign 🔒"}
            </button>

            <button
              type="button"
              style={pageStyles.secondaryButton}
              onClick={handleReset}
            >
              Reset fields
            </button>

            <button
              type="button"
              style={pageStyles.secondaryButton}
              onClick={() =>
                window.open(
                  generated.linkedInPeopleUrl,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              Open LinkedIn people
            </button>

            {canUseGoogleOpenWeb ? (
              <button
                type="button"
                style={pageStyles.secondaryButton}
                onClick={() =>
                  window.open(
                    generated.googleOpenWebUrl,
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                Open web results
              </button>
            ) : (
              <button
                type="button"
                style={{
                  ...pageStyles.secondaryButton,
                  opacity: 0.5,
                  cursor: "not-allowed",
                }}
                onClick={() => (window.location.href = "/dashboard/billing")}
              >
                Web Results 🔒
              </button>
            )}
          </div>

          {savedMessage ? (
            <div style={pageStyles.successMessage}>{savedMessage}</div>
          ) : null}

          <div style={pageStyles.subtleNote}>
            <strong>Mode guide:</strong> Start with <strong>Broad</strong> for
            LinkedIn People. Keep Industry short like{" "}
            <strong>marketing agency</strong> or <strong>saas</strong>. Use one
            simple role first like <strong>founder</strong>. Auto Simplify will
            compress long LinkedIn People queries automatically.
          </div>
        </section>

        <section style={pageStyles.stack}>
          <div style={pageStyles.sectionCard}>
            <div style={pageStyles.sectionHeader}>
              <div style={pageStyles.sectionIconWrap}>
                <Building2 size={20} />
              </div>
              <h2 style={pageStyles.sectionTitle}>AI-generated outputs</h2>
            </div>

            <p style={pageStyles.sectionSubtitle}>
              LinkedIn People stays ultra-light. Google gets X-ray, open web,
              and buying-intent search versions.
            </p>

            <div style={pageStyles.stack}>
              <div style={pageStyles.outputCard}>
                <div style={pageStyles.outputHeader}>
                  <h3 style={pageStyles.outputTitle}>
                    LinkedIn people search query
                  </h3>
                  <button
                    type="button"
                    style={pageStyles.copyButton}
                    onClick={() =>
                      handleCopy("people", generated.linkedinPeopleQuery)
                    }
                  >
                    {copiedKey === "people" ? "Copied" : "Copy"}
                  </button>
                </div>
                <p style={pageStyles.outputBody}>
                  {generated.linkedinPeopleQuery ||
                    "Start filling in the ICP to generate a people search query."}
                </p>
                <div style={pageStyles.helper}>
                  LinkedIn People works best with very short queries. Start with
                  Broad mode first.
                </div>

                {generated.autoSimplified ? (
                  <div style={pageStyles.infoBanner}>
                    Auto Simplify compressed the LinkedIn People query for better
                    result chances.
                  </div>
                ) : null}
              </div>

              <div style={pageStyles.outputCard}>
                <div style={pageStyles.outputHeader}>
                  <h3 style={pageStyles.outputTitle}>
                    LinkedIn people raw query
                  </h3>
                  <button
                    type="button"
                    style={pageStyles.copyButton}
                    onClick={() =>
                      handleCopy("people-raw", generated.rawLinkedinPeopleQuery)
                    }
                  >
                    {copiedKey === "people-raw" ? "Copied" : "Copy"}
                  </button>
                </div>
                <p style={pageStyles.outputBody}>
                  {generated.rawLinkedinPeopleQuery || "No raw query yet."}
                </p>
              </div>

              <div style={pageStyles.outputCard}>
                <div style={pageStyles.outputHeader}>
                  <h3 style={pageStyles.outputTitle}>
                    LinkedIn people simplified query
                  </h3>
                  <button
                    type="button"
                    style={pageStyles.copyButton}
                    onClick={() =>
                      handleCopy(
                        "people-simple",
                        generated.simplifiedLinkedinPeopleQuery
                      )
                    }
                  >
                    {copiedKey === "people-simple" ? "Copied" : "Copy"}
                  </button>
                </div>
                <p style={pageStyles.outputBody}>
                  {generated.simplifiedLinkedinPeopleQuery ||
                    "No simplified query yet."}
                </p>
              </div>

              <div style={pageStyles.outputCard}>
                <div style={pageStyles.outputHeader}>
                  <h3 style={pageStyles.outputTitle}>
                    LinkedIn company search query
                  </h3>
                  <button
                    type="button"
                    style={pageStyles.copyButton}
                    onClick={() =>
                      handleCopy("company", generated.linkedinCompanyQuery)
                    }
                  >
                    {copiedKey === "company" ? "Copied" : "Copy"}
                  </button>
                </div>
                <p style={pageStyles.outputBody}>
                  {generated.linkedinCompanyQuery ||
                    "Your company search query will appear here."}
                </p>
              </div>

              <div style={pageStyles.outputCard}>
                <div style={pageStyles.outputHeader}>
                  <h3 style={pageStyles.outputTitle}>
                    Google people X-ray query
                  </h3>
                  <button
                    type="button"
                    style={pageStyles.copyButton}
                    onClick={() =>
                      handleCopy("google-people", generated.googlePeopleQuery)
                    }
                  >
                    {copiedKey === "google-people" ? "Copied" : "Copy"}
                  </button>
                </div>
                <p style={pageStyles.outputBody}>
                  {generated.googlePeopleQuery ||
                    "Your Google people query will appear here."}
                </p>
              </div>

              <div style={pageStyles.outputCard}>
                <div style={pageStyles.outputHeader}>
                  <h3 style={pageStyles.outputTitle}>
                    Google company X-ray query
                  </h3>
                  <button
                    type="button"
                    style={pageStyles.copyButton}
                    onClick={() =>
                      handleCopy("google-company", generated.googleCompanyQuery)
                    }
                  >
                    {copiedKey === "google-company" ? "Copied" : "Copy"}
                  </button>
                </div>
                <p style={pageStyles.outputBody}>
                  {generated.googleCompanyQuery ||
                    "Your Google company query will appear here."}
                </p>
              </div>

              <div style={pageStyles.outputCard}>
                <div style={pageStyles.outputHeader}>
                  <h3 style={pageStyles.outputTitle}>Google open web query</h3>
                  <button
                    type="button"
                    style={pageStyles.copyButton}
                    onClick={() =>
                      handleCopy("google-open-web", generated.googleOpenWebQuery)
                    }
                  >
                    {copiedKey === "google-open-web" ? "Copied" : "Copy"}
                  </button>
                </div>
                <p style={pageStyles.outputBody}>
                  {generated.googleOpenWebQuery ||
                    "Your Google open web query will appear here."}
                </p>
                <div style={pageStyles.helper}>
                  Use this for normal Google results like websites, directories,
                  service listings, and broader company pages.
                </div>
              </div>

              <div style={pageStyles.outputCard}>
                <div style={pageStyles.outputHeader}>
                  <h3 style={pageStyles.outputTitle}>Google intent query</h3>
                  <button
                    type="button"
                    style={pageStyles.copyButton}
                    onClick={() =>
                      handleCopy("google-intent", generated.googleIntentQuery)
                    }
                  >
                    {copiedKey === "google-intent" ? "Copied" : "Copy"}
                  </button>
                </div>
                <p style={pageStyles.outputBody}>
                  {generated.googleIntentQuery ||
                    "Your Google intent query will appear here."}
                </p>
                <div style={pageStyles.helper}>
                  Use this to find companies showing buying signals like growth,
                  lead generation, sales pipeline, or business development
                  activity.
                </div>
              </div>
            </div>
          </div>

          <div style={pageStyles.sectionCard}>
            <div style={pageStyles.sectionHeader}>
              <div style={pageStyles.sectionIconWrap}>
                <Users size={20} />
              </div>
              <h2 style={pageStyles.sectionTitle}>Decision-maker suggestions</h2>
            </div>

            <p style={pageStyles.sectionSubtitle}>
              LeadRadar expands your targeting with likely buyer title
              variations.
            </p>

            <div style={pageStyles.tagsWrap}>
              {generated.suggestedTitles.length ? (
                generated.suggestedTitles.map((title) => (
                  <span key={title} style={pageStyles.tag}>
                    {title}
                  </span>
                ))
              ) : (
                <span style={pageStyles.tag}>
                  Add roles or ICP data to generate title suggestions
                </span>
              )}
            </div>
          </div>

          <div style={pageStyles.sectionCard}>
            <div style={pageStyles.sectionHeader}>
              <div style={pageStyles.sectionIconWrap}>
                <MessageSquareText size={20} />
              </div>
              <h2 style={pageStyles.sectionTitle}>Outreach opener</h2>
            </div>

            <p style={pageStyles.sectionSubtitle}>
              Use this as a fast personalized first-touch message.
            </p>

            <div style={pageStyles.outputCard}>
              <div style={pageStyles.outputHeader}>
                <h3 style={pageStyles.outputTitle}>Suggested opener</h3>
                <button
                  type="button"
                  style={pageStyles.copyButton}
                  onClick={() => handleCopy("opener", generated.outreachOpener)}
                >
                  {copiedKey === "opener" ? "Copied" : "Copy"}
                </button>
              </div>
              <p style={pageStyles.outputBody}>{generated.outreachOpener}</p>
            </div>
          </div>

          <div style={pageStyles.sectionCard}>
            <div style={pageStyles.sectionHeader}>
              <div style={pageStyles.sectionIconWrap}>
                <Globe size={20} />
              </div>
              <h2 style={pageStyles.sectionTitle}>Open and intent searches</h2>
            </div>

            <p style={pageStyles.sectionSubtitle}>
              Launch broader web discovery and buying-signal searches outside
              LinkedIn.
            </p>

            <div style={pageStyles.actionRow}>
              {canUseGoogleOpenWeb ? (
                <button
                  type="button"
                  style={pageStyles.primaryButton}
                  onClick={() =>
                    window.open(
                      generated.googleOpenWebUrl,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                >
                  Open web results
                </button>
              ) : (
                <button
                  type="button"
                  style={{
                    ...pageStyles.primaryButton,
                    opacity: 0.5,
                    cursor: "not-allowed",
                  }}
                  onClick={() => (window.location.href = "/dashboard/billing")}
                >
                  Web Results 🔒
                </button>
              )}

              {canUseGoogleIntent ? (
                <button
                  type="button"
                  style={pageStyles.secondaryButton}
                  onClick={() =>
                    window.open(
                      generated.googleIntentUrl,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                >
                  Open intent results
                </button>
              ) : (
                <button
                  type="button"
                  style={{
                    ...pageStyles.secondaryButton,
                    opacity: 0.5,
                    cursor: "not-allowed",
                  }}
                  onClick={() => (window.location.href = "/dashboard/billing")}
                >
                  Intent Search 🔒
                </button>
              )}

              <button
                type="button"
                style={pageStyles.secondaryButton}
                onClick={() =>
                  window.open(
                    generated.googlePeopleUrl,
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                Open Google people
              </button>

              <button
                type="button"
                style={pageStyles.secondaryButton}
                onClick={() =>
                  window.open(
                    generated.googleCompanyUrl,
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                Open Google companies
              </button>
            </div>
          </div>

          <div style={pageStyles.sectionCard}>
            <div style={pageStyles.sectionHeader}>
              <div style={pageStyles.sectionIconWrap}>
                <Sparkles size={20} />
              </div>
              <h2 style={pageStyles.sectionTitle}>Why this search works</h2>
            </div>

            <p style={pageStyles.sectionSubtitle}>
              Quick explanation for why the generated search should perform
              better.
            </p>

            <div style={pageStyles.outputCard}>
              <p style={pageStyles.outputBody}>{generated.whyThisWorks}</p>
            </div>

            <div style={pageStyles.actionRow}>
              <button
                type="button"
                style={pageStyles.primaryButton}
                onClick={() =>
                  window.open(
                    generated.linkedInPeopleUrl,
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                Open LinkedIn people
              </button>

              <button
                type="button"
                style={pageStyles.secondaryButton}
                onClick={() =>
                  window.open(
                    generated.linkedInCompanyUrl,
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
              >
                Open LinkedIn companies
              </button>

              {canUseGoogleOpenWeb ? (
                <button
                  type="button"
                  style={pageStyles.secondaryButton}
                  onClick={() =>
                    window.open(
                      generated.googleOpenWebUrl,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                >
                  Open web results
                </button>
              ) : (
                <button
                  type="button"
                  style={{
                    ...pageStyles.secondaryButton,
                    opacity: 0.5,
                    cursor: "not-allowed",
                  }}
                  onClick={() => (window.location.href = "/dashboard/billing")}
                >
                  Web Results 🔒
                </button>
              )}

              {canUseGoogleIntent ? (
                <button
                  type="button"
                  style={pageStyles.secondaryButton}
                  onClick={() =>
                    window.open(
                      generated.googleIntentUrl,
                      "_blank",
                      "noopener,noreferrer"
                    )
                  }
                >
                  Open intent results
                </button>
              ) : (
                <button
                  type="button"
                  style={{
                    ...pageStyles.secondaryButton,
                    opacity: 0.5,
                    cursor: "not-allowed",
                  }}
                  onClick={() => (window.location.href = "/dashboard/billing")}
                >
                  Intent Search 🔒
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function SearchAutomationPage() {
  return (
    <ExpiredTrialGate
      title="AI Search locked"
      description="Your trial has ended. Upgrade to continue using AI lead search and advanced search tools."
    >
      <SearchAutomationPageContent />
    </ExpiredTrialGate>
  );
}