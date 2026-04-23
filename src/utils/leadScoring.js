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
  const stage = normalizeLower(lead.stage);
  const status = normalizeLower(lead.status);
  const quoteStatus = normalizeLower(lead.quoteStatus);

  if (lead.businessName) reasons.push("Business identified");
  if (lead.contactName) reasons.push("Contact available");
  if (lead.linkedinRole) reasons.push("LinkedIn role captured");
  if (lead.linkedinHeadline) reasons.push("Headline insight available");
  if (lead.linkedinProfileUrl) reasons.push("LinkedIn profile linked");

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

  if (stage === "cold") reasons.push("Cold opportunity stage");
  if (stage === "warm") reasons.push("Warm opportunity stage");
  if (stage === "hot") reasons.push("Hot opportunity stage");
  if (stage === "won") reasons.push("Won opportunity");
  if (stage === "lost") reasons.push("Lost opportunity");

  if (status === "cold") reasons.push("Cold status signal");
  if (status === "warm") reasons.push("Warm status signal");
  if (status === "hot") reasons.push("Hot status signal");

  if (status === "contacted") reasons.push("Initial outreach completed");
  if (status === "follow-up") reasons.push("Follow-up in progress");
  if (status === "qualified") reasons.push("Lead qualified");
  if (status === "proposal sent") reasons.push("Proposal already sent");
  if (status === "negotiation") reasons.push("Negotiation underway");
  if (status === "closed won") reasons.push("Deal closed won");
  if (status === "closed lost") reasons.push("Deal closed lost");

  if (quoteStatus === "sent") reasons.push("Quote already sent");
  if (quoteStatus === "accepted") reasons.push("Quote accepted");

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
    notes.includes("proposal") ||
    notes.includes("quote") ||
    notes.includes("meeting")
  ) {
    reasons.push("Positive engagement notes");
  }

  if (
    notes.includes("not interested") ||
    notes.includes("unresponsive") ||
    notes.includes("dead") ||
    notes.includes("no response")
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
  const stage = normalizeLower(lead.stage);
  const status = normalizeLower(lead.status);
  const quoteStatus = normalizeLower(lead.quoteStatus);

  // Profile quality now has LOWER weight
  if (lead.businessName) score += 5;
  if (lead.contactName) score += 4;
  if (lead.linkedinRole) score += 5;
  if (lead.linkedinHeadline) score += 4;
  if (lead.linkedinProfileUrl) score += 3;
  if (lead.mobile) score += 3;

  // Decision-maker / intent still matters, but less than stage
  if (
    ["ceo", "founder", "owner", "director", "head", "manager"].some((k) =>
      text.includes(k)
    )
  ) {
    score += 10;
  }

  if (
    ["sales", "growth", "marketing", "automation", "crm", "operations", "recruitment"].some(
      (k) => text.includes(k)
    )
  ) {
    score += 6;
  }

  // Stage is now the MAIN driver
  if (stage === "cold") score -= 40;
  if (stage === "warm") score += 0;
  if (stage === "hot") score += 28;
  if (stage === "won") score = 100;
  if (stage === "lost") score = 0;

  // Backward compatibility for old status model
  if (status === "cold") score -= 25;
  if (status === "warm") score += 0;
  if (status === "hot") score += 18;

  // New status model fine-tunes strongly
  if (status === "new") score += 0;
  if (status === "contacted") score += 6;
  if (status === "follow-up") score += 10;
  if (status === "qualified") score += 18;
  if (status === "proposal sent") score += 28;
  if (status === "negotiation") score += 34;
  if (status === "closed won") score = 100;
  if (status === "closed lost") score = 0;

  // Commercial intent
  if (quoteStatus === "sent") score += 12;
  if (quoteStatus === "accepted") score += 22;

  if (quoteAmount >= 10000) score += 4;
  if (quoteAmount >= 50000) score += 4;

  // Smaller contextual boosts
  if (
    location.includes("south africa") ||
    location.includes("cape town") ||
    location.includes("johannesburg")
  ) {
    score += 2;
  }

  if (
    notes.includes("interested") ||
    notes.includes("follow up") ||
    notes.includes("proposal") ||
    notes.includes("quote") ||
    notes.includes("meeting")
  ) {
    score += 8;
  }

  if (
    notes.includes("not interested") ||
    notes.includes("unresponsive") ||
    notes.includes("dead") ||
    notes.includes("no response")
  ) {
    score -= 18;
  }

  return Math.max(0, Math.min(100, score));
}

function calculateDealProbability(lead = {}, aiScore = 0) {
  let probability = Math.round(aiScore * 0.65);

  const stage = normalizeLower(lead.stage);
  const status = normalizeLower(lead.status);
  const quoteStatus = normalizeLower(lead.quoteStatus);

  // Stage drives probability heavily
  if (stage === "cold") probability -= 35;
  if (stage === "warm") probability += 0;
  if (stage === "hot") probability += 25;
  if (stage === "won") probability = 100;
  if (stage === "lost") probability = 0;

  // Old status compatibility
  if (status === "cold") probability -= 20;
  if (status === "warm") probability += 0;
  if (status === "hot") probability += 15;

  // New status model
  if (status === "contacted") probability += 5;
  if (status === "follow-up") probability += 8;
  if (status === "qualified") probability += 14;
  if (status === "proposal sent") probability += 24;
  if (status === "negotiation") probability += 30;
  if (status === "closed won") probability = 100;
  if (status === "closed lost") probability = 0;

  if (quoteStatus === "sent") probability += 10;
  if (quoteStatus === "accepted") probability += 20;

  return Math.max(0, Math.min(100, probability));
}

function calculateEstimatedValue(lead = {}, dealProbability = 0) {
  const quoteAmount = toNumber(lead.quoteAmount);

  if (!quoteAmount) return 0;

  return Math.round((quoteAmount * dealProbability) / 100);
}

function getNextBestAction(lead = {}, aiScore = 0, dealProbability = 0) {
  const stage = normalizeLower(lead.stage);
  const status = normalizeLower(lead.status);
  const quoteAmount = toNumber(lead.quoteAmount);
  const quoteStatus = normalizeLower(lead.quoteStatus);

  if (stage === "lost" || status === "closed lost") {
    return "Archive or move to long-term nurture sequence";
  }

  if (stage === "won" || status === "closed won") {
    return "Onboard client and identify upsell opportunities";
  }

  if (stage === "cold" || status === "cold" || status === "new") {
    return "Send first outreach and qualify decision-maker";
  }

  if (status === "contacted" && dealProbability < 40) {
    return "Follow up with a short value-led message";
  }

  if (status === "follow-up") {
    return "Re-engage and book a discovery conversation";
  }

  if (status === "qualified" && !quoteAmount) {
    return "Prepare scoped quote and confirm client needs";
  }

  if (
    (status === "qualified" || status === "proposal sent") &&
    quoteAmount &&
    quoteStatus !== "sent"
  ) {
    return "Send quote and book a review call";
  }

  if (status === "proposal sent" && dealProbability >= 60) {
    return "Push for close with deadline-driven follow-up";
  }

  if (status === "negotiation" && dealProbability >= 60) {
    return "Handle objections and move toward close";
  }

  if (aiScore < 30) {
    return "Re-engage later or move to nurture sequence";
  }

  return "Schedule follow-up and move deal forward";
}

function getFollowUpUrgency(lead = {}, dealProbability = 0) {
  const followUpDate = normalizeText(lead.followUpDate);
  const stage = normalizeLower(lead.stage);
  const status = normalizeLower(lead.status);

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

  if (
    stage === "hot" ||
    status === "hot" ||
    status === "proposal sent" ||
    status === "negotiation" ||
    dealProbability >= 70
  ) {
    return "high";
  }

  if (
    stage === "warm" ||
    status === "warm" ||
    status === "contacted" ||
    status === "follow-up" ||
    status === "qualified" ||
    dealProbability >= 40
  ) {
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