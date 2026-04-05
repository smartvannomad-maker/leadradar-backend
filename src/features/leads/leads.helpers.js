export function normalizeWhatsappNumber(value = "") {
  const digits = String(value).replace(/\D/g, "");

  if (!digits) return "";

  if (digits.startsWith("27")) return digits;
  if (digits.startsWith("0")) return `27${digits.slice(1)}`;

  return digits;
}

export function toTitleCase(value = "") {
  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeText(value = "") {
  return String(value || "").toLowerCase().trim();
}

function parseDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getComparableName(lead) {
  return String(
    lead.businessName ||
      lead.contactName ||
      lead.linkedinCompany ||
      ""
  ).toLowerCase();
}

export function filterAndSortLeads(leads = [], filters = {}) {
  const {
    searchTerm = "",
    categoryFilter = "All",
    statusFilter = "All",
    stageFilter = "All",
    sortBy = "newest",
  } = filters;

  let result = [...leads];

  const search = normalizeText(searchTerm);

  if (search) {
    result = result.filter((lead) => {
      const haystack = [
        lead.businessName,
        lead.contactName,
        lead.mobile,
        lead.notes,
        lead.quoteAmount,
        lead.linkedinRole,
        lead.linkedinCompany,
        lead.linkedinLocation,
        lead.linkedinHeadline,
        lead.linkedinKeywords,
        lead.linkedinProfileUrl,
        lead.category,
        lead.status,
        lead.stage,
        lead.quoteStatus,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(search);
    });
  }

  if (categoryFilter && categoryFilter !== "All") {
    result = result.filter(
      (lead) => String(lead.category || "") === String(categoryFilter)
    );
  }

  if (statusFilter && statusFilter !== "All") {
    result = result.filter(
      (lead) => String(lead.status || "") === String(statusFilter)
    );
  }

  if (stageFilter && stageFilter !== "All") {
    result = result.filter(
      (lead) => String(lead.stage || "") === String(stageFilter)
    );
  }

  result.sort((a, b) => {
    if (sortBy === "oldest") {
      return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
    }

    if (sortBy === "name-asc") {
      return getComparableName(a).localeCompare(getComparableName(b));
    }

    if (sortBy === "name-desc") {
      return getComparableName(b).localeCompare(getComparableName(a));
    }

    if (sortBy === "followup-asc") {
      const aDate = parseDate(a.followUpDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
      const bDate = parseDate(b.followUpDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
      return aDate - bDate;
    }

    if (sortBy === "followup-desc") {
      const aDate = parseDate(a.followUpDate)?.getTime() ?? 0;
      const bDate = parseDate(b.followUpDate)?.getTime() ?? 0;
      return bDate - aDate;
    }

    return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
  });

  return result;
}

export function getLeadStats(leads = []) {
  const totalLeads = leads.length;

  const totalQuoteValue = leads.reduce((sum, lead) => {
    const numeric = Number(String(lead.quoteAmount || "").replace(/[^\d.-]/g, ""));
    return sum + (Number.isNaN(numeric) ? 0 : numeric);
  }, 0);

  const wonLeads = leads.filter(
    (lead) =>
      normalizeText(lead.stage) === "won" ||
      normalizeText(lead.status) === "won"
  ).length;

  const sentQuotes = leads.filter(
    (lead) => normalizeText(lead.quoteStatus) === "sent"
  ).length;

  return {
    totalLeads,
    totalQuoteValue,
    wonLeads,
    sentQuotes,
  };
}

export function getTodayFollowUps(leads = []) {
  const today = new Date();

  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayKey = `${yyyy}-${mm}-${dd}`;

  return leads.filter((lead) => {
    if (!lead.followUpDate) return false;

    const parsed = parseDate(lead.followUpDate);
    if (!parsed) {
      return String(lead.followUpDate).slice(0, 10) === todayKey;
    }

    const py = parsed.getFullYear();
    const pm = String(parsed.getMonth() + 1).padStart(2, "0");
    const pd = String(parsed.getDate()).padStart(2, "0");
    return `${py}-${pm}-${pd}` === todayKey;
  });
}

export function buildPipelineBuckets(leads = []) {
  const buckets = {
    new: [],
    contacted: [],
    qualified: [],
    proposal: [],
    negotiation: [],
    won: [],
    lost: [],
  };

  leads.forEach((lead) => {
    const stage = normalizeText(lead.stage || "new");
    if (buckets[stage]) {
      buckets[stage].push(lead);
    } else {
      if (!buckets.other) buckets.other = [];
      buckets.other.push(lead);
    }
  });

  return buckets;
}