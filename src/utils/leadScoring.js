function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeLower(value) {
  return normalizeText(value).toLowerCase();
}

function toNumber(value) {
  if (value === null || value === undefined || value === "") return 0;

  const parsed = Number(String(value).replace(/[^\d.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildReasons(lead = {}) {
  const reasons = [];
  const text =
    `${lead.linkedinRole || ""} ${lead.linkedinHeadline || ""} ${lead.linkedinKeywords || ""}`.toLowerCase();
  const location = normalizeLower(lead.linkedinLocation);
  const notes = normalizeLower(lead.notes);

  if (lead.businessName) reasons.push("Business identified");
  if (lead.contactName) reasons.push("Contact available");
  if (lead.linkedinRole) reasons.push("LinkedIn role captured");
  if (lead.linkedinHeadline) reasons.push("Headline insight available");
  if (lead.linkedinProfileUrl) reasons.push("LinkedIn profile linked");
  if (lead.mobile) reasons.push("Direct contact number available");

  if (
    ["ceo", "founder", "owner", "director", "head", "manager"].some((k) =>
      text.includes(k)
    )
  ) {
    reasons.push("Decision-maker profile");
  }

  if (
    ["sales", "growth", "marketing", "automation", "crm", "operations", "recruitment"].some(
      (k) => text.includes(k)
    )
  ) {
    reasons.push("Business growth intent");
  }

  if (lead.stage === "Qualified") {
    reasons.push("Qualified pipeline stage");
  }

  if (lead.stage === "Proposal") {
    reasons.push("Proposal stage opportunity");
  }

  if (lead.stage === "Closed") {
    reasons.push("Closed stage momentum");
  }

  if (lead.quoteStatus === "Sent") {
    reasons.push("Quote already sent");
  }

  if (lead.quoteStatus === "Accepted") {
    reasons.push("Quote accepted");
  }

  if (
    location.includes("south africa") ||
    location.includes("cape town") ||
    location.includes("johannesburg")
  ) {
    reasons.push("Local target market");
  }

  if (
    notes.includes("interested") ||
    notes.includes("follow up") ||
    notes.includes("proposal")
  ) {
    reasons.push("Positive engagement notes");
  }

  if (
    notes.includes("not interested") ||
    notes.includes("unresponsive") ||
    notes.includes("dead")
  ) {
    reasons.push("Negative engagement notes");
  }

  return reasons.slice(0, 6);
}

function calculateAiScore(lead = {}) {
  let score = 0;

  const text =
    `${lead.linkedinRole || ""} ${lead.linkedinHeadline || ""} ${lead.linkedinKeywords || ""}`.toLowerCase();
  const location = normalizeLower(lead.linkedinLocation);
  const notes = normalizeLower(lead.notes);
  const quoteAmount = toNumber(lead.quoteAmount);

  if (lead.businessName) score += 10;
  if (lead.contactName) score += 8;
  if (lead.linkedinRole) score += 10;
  if (lead.linkedinHeadline) score += 8;
  if (lead.linkedinProfileUrl) score += 6;
  if (lead.mobile) score += 5;

  if (
    ["ceo", "founder", "owner", "director", "head", "manager"].some((k) =>
      text.includes(k)
    )
  ) {
    score += 20;
  }

  if (
    ["sales", "growth", "marketing", "automation", "crm", "operations", "recruitment"].some(
      (k) => text.includes(k)
    )
  ) {
    score += 12;
  }

  if (lead.stage === "Qualified") score += 10;
  if (lead.stage === "Proposal") score += 18;
  if (lead.stage === "Closed") score += 25;

  if (lead.quoteStatus === "Sent") score += 15;
  if (lead.quoteStatus === "Accepted") score += 25;

  if (quoteAmount >= 10000) score += 8;
  if (quoteAmount >= 50000) score += 6;

  if (
    location.includes("south africa") ||
    location.includes("cape town") ||
    location.includes("johannesburg")
  ) {
    score += 5;
  }

  if (lead.status === "Hot") score += 15;
  if (lead.status === "Warm") score += 8;
  if (lead.status === "Cold") score -= 10;

  if (
    notes.includes("interested") ||
    notes.includes("follow up") ||
    notes.includes("proposal")
  ) {
    score += 8;
  }

  if (
    notes.includes("not interested") ||
    notes.includes("unresponsive") ||
    notes.includes("dead")
  ) {
    score -= 12;
  }

  return Math.max(0, Math.min(100, score));
}

function calculateDealProbability(lead = {}, aiScore = 0) {
  let probability = Math.round(aiScore * 0.75);

  if (lead.stage === "New Lead") probability += 5;
  if (lead.stage === "Contacted") probability += 10;
  if (lead.stage === "Qualified") probability += 18;
  if (lead.stage === "Proposal") probability += 28;
  if (lead.stage === "Closed") probability += 40;

  if (lead.quoteStatus === "Sent") probability += 10;
  if (lead.quoteStatus === "Accepted") probability += 25;

  if (lead.status === "Cold") probability -= 12;

  return Math.max(0, Math.min(100, probability));
}

function calculateEstimatedValue(lead = {}, dealProbability = 0) {
  const quoteAmount = toNumber(lead.quoteAmount);

  if (!quoteAmount) return 0;

  return Math.round((quoteAmount * dealProbability) / 100);
}

function getNextBestAction(lead = {}, aiScore = 0, dealProbability = 0) {
  if (lead.stage === "New Lead") {
    return "Send first outreach and qualify decision-maker";
  }

  if (lead.stage === "Contacted" && dealProbability < 40) {
    return "Follow up with a short value-led message";
  }

  if (lead.stage === "Qualified" && !lead.quoteAmount) {
    return "Prepare scoped quote and confirm client needs";
  }

  if (
    lead.stage === "Qualified" &&
    lead.quoteAmount &&
    lead.quoteStatus !== "Sent"
  ) {
    return "Send quote and book review call";
  }

  if (lead.stage === "Proposal" && dealProbability >= 60) {
    return "Push for close with deadline-driven follow-up";
  }

  if (lead.stage === "Proposal" && dealProbability < 60) {
    return "Handle objections and refine proposal";
  }

  if (lead.status === "Cold" || aiScore < 35) {
    return "Re-engage later or move to nurture sequence";
  }

  return "Schedule follow-up and move deal forward";
}

function getFollowUpUrgency(lead = {}, dealProbability = 0) {
  const followUpDate = normalizeText(lead.followUpDate);

  if (followUpDate) {
    const today = new Date();
    const target = new Date(followUpDate);

    if (!Number.isNaN(target.getTime())) {
      today.setHours(0, 0, 0, 0);
      target.setHours(0, 0, 0, 0);

      const diffMs = target.getTime() - today.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) return "high";
      if (diffDays <= 4) return "medium";
    }
  }

  if (lead.stage === "Proposal" || dealProbability >= 70) {
    return "high";
  }

  if (lead.stage === "Qualified" || dealProbability >= 45) {
    return "medium";
  }

  return "low";
}

export function scoreLead(lead = {}) {
  const ai_score = calculateAiScore(lead);
  const ai_reasons = buildReasons(lead);
  const ai_priority = ai_score >= 70 ? "hot" : ai_score >= 40 ? "warm" : "cold";
  const deal_probability = calculateDealProbability(lead, ai_score);
  const estimated_value = calculateEstimatedValue(lead, deal_probability);
  const next_best_action = getNextBestAction(lead, ai_score, deal_probability);
  const follow_up_urgency = getFollowUpUrgency(lead, deal_probability);

  return {
    ai_score,
    ai_priority,
    ai_reasons,
    deal_probability,
    estimated_value,
    next_best_action,
    follow_up_urgency,
  };
}