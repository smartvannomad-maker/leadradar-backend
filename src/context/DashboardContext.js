import { createContext, useContext, useMemo, useState } from "react";

export const DashboardContext = createContext(null);

const defaultLeadForm = {
  businessName: "",
  contactName: "",
  email: "",
  phone: "",
  location: "",
  source: "LinkedIn",
  status: "New",
  stage: "Prospect",
  category: "",
  quoteStatus: "",
  estimatedValue: "",
  dealProbability: "",
  nextFollowUp: "",
  notes: "",
  linkedinTitle: "",
  linkedinKeyword: "",
};

function normalizeNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function computeAiScore(lead) {
  const estimatedValueScore = Math.min(
    30,
    Math.round(normalizeNumber(lead.estimatedValue) / 5000)
  );

  const probabilityScore = Math.min(
    40,
    Math.round(normalizeNumber(lead.dealProbability) * 0.4)
  );

  const stageWeights = {
    Prospect: 8,
    Contacted: 14,
    Qualified: 24,
    Proposal: 32,
    Negotiation: 38,
    Won: 45,
  };

  const statusWeights = {
    New: 8,
    Active: 14,
    Qualified: 20,
    Won: 25,
    Lost: 0,
  };

  const noteScore = lead.notes?.trim() ? 8 : 0;
  const contactScore =
    lead.contactName?.trim() && (lead.email?.trim() || lead.phone?.trim()) ? 10 : 0;

  const rawScore =
    estimatedValueScore +
    probabilityScore +
    (stageWeights[lead.stage] || 0) +
    (statusWeights[lead.status] || 0) +
    noteScore +
    contactScore;

  return Math.max(0, Math.min(100, rawScore));
}

function getAiPriority(score) {
  if (score >= 75) return "hot";
  if (score >= 45) return "warm";
  return "cold";
}

function getNextBestAction(lead, score) {
  if (lead.stage === "Proposal") return "Send proposal follow-up";
  if (lead.stage === "Negotiation") return "Close pricing conversation";
  if (score >= 75) return "Call decision-maker today";
  if (score >= 45) return "Send tailored outreach";
  return "Qualify and enrich lead";
}

export function DashboardProvider({ children }) {
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState(defaultLeadForm);

  const resetForm = () => {
    setForm(defaultLeadForm);
  };

  const handleAddLead = (event) => {
    if (event?.preventDefault) {
      event.preventDefault();
    }

    const aiScore = computeAiScore(form);
    const aiPriority = getAiPriority(aiScore);

    const newLead = {
      id: `lead_${Date.now()}`,
      businessName: form.businessName?.trim() || "",
      contactName: form.contactName?.trim() || "",
      email: form.email?.trim() || "",
      phone: form.phone?.trim() || "",
      location: form.location?.trim() || "",
      source: form.source || "LinkedIn",
      status: form.status || "New",
      stage: form.stage || "Prospect",
      category: form.category || "",
      quoteStatus: form.quoteStatus || "",
      estimated_value: normalizeNumber(form.estimatedValue),
      deal_probability: normalizeNumber(form.dealProbability),
      next_follow_up: form.nextFollowUp || "",
      notes: form.notes?.trim() || "",
      ai_score: aiScore,
      ai_priority: aiPriority,
      next_best_action: getNextBestAction(form, aiScore),
      created_at: new Date().toISOString(),
    };

    setLeads((prev) => [newLead, ...prev]);
    resetForm();
  };

  const linkedinSearchQuery = useMemo(() => {
    const parts = [form.linkedinTitle, form.linkedinKeyword, form.location]
      .map((item) => String(item || "").trim())
      .filter(Boolean);

    return parts.join(" ");
  }, [form.linkedinTitle, form.linkedinKeyword, form.location]);

  const openLinkedInSearch = () => {
    if (!linkedinSearchQuery) return;

    const url = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(
      linkedinSearchQuery
    )}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  const saveLinkedInLeadToForm = () => {
    setForm((prev) => ({
      ...prev,
      businessName: prev.businessName || prev.linkedinKeyword || "",
      contactName: prev.contactName || "",
      source: "LinkedIn",
      notes: prev.notes
        ? `${prev.notes}\nGenerated from LinkedIn workflow`
        : "Generated from LinkedIn workflow",
    }));
  };

  const todayFollowUps = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);

    return leads.filter((lead) => {
      if (!lead.next_follow_up) return false;
      return String(lead.next_follow_up).slice(0, 10) === today;
    });
  }, [leads]);

  const value = useMemo(
    () => ({
      leads,
      setLeads,
      form,
      setForm,
      handleAddLead,
      linkedinSearchQuery,
      openLinkedInSearch,
      saveLinkedInLeadToForm,
      todayFollowUps,
      resetForm,
    }),
    [leads, form, linkedinSearchQuery, todayFollowUps]
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error("useDashboard must be used inside DashboardProvider");
  }

  return context;
}