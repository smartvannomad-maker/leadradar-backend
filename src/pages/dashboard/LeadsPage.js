import { useContext, useMemo, useState } from "react";
import { DashboardContext } from "../../context/DashboardContext";
import LeadSidePanel from "../../components/pipeline/LeadSidePanel";
import { removeLead } from "../../features/leads/leads.service";

const stageOrder = [
  "New Lead",
  "Contacted",
  "Qualified",
  "Proposal",
  "Closed",
];

const styles = {
  page: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) 380px",
    gap: "20px",
    alignItems: "start",
  },
  listWrap: {
    minWidth: 0,
  },
  title: {
    margin: "0 0 16px 0",
    fontSize: "28px",
    fontWeight: 800,
    color: "#0f172a",
  },
  filtersRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginBottom: "14px",
  },
  filterButton: {
    border: "1px solid rgba(148,163,184,0.22)",
    background: "#ffffff",
    color: "#334155",
    borderRadius: "999px",
    padding: "8px 14px",
    fontSize: "12px",
    fontWeight: 800,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  filterButtonActive: {
    background: "#eff6ff",
    color: "#1d4ed8",
    border: "1px solid rgba(37,99,235,0.28)",
    boxShadow: "0 8px 20px rgba(37,99,235,0.08)",
  },
  toolbarRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "stretch",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "16px",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "12px",
    width: "100%",
  },
  summaryCard: {
    padding: "14px 16px",
    borderRadius: "18px",
    background: "#ffffff",
    border: "1px solid rgba(148,163,184,0.16)",
    boxShadow: "0 8px 20px rgba(15,23,42,0.04)",
  },
  summaryLabel: {
    margin: "0 0 8px 0",
    fontSize: "11px",
    color: "#64748b",
    fontWeight: 800,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  summaryValue: {
    margin: 0,
    fontSize: "22px",
    fontWeight: 900,
    color: "#0f172a",
  },
  card: {
    background: "#fff",
    border: "1px solid rgba(148,163,184,0.16)",
    borderRadius: "18px",
    padding: "14px 16px",
    boxShadow: "0 8px 20px rgba(15,23,42,0.04)",
    cursor: "pointer",
    marginBottom: "12px",
    transition: "all 0.2s ease",
  },
  selectedCard: {
    border: "1px solid rgba(37,99,235,0.38)",
    boxShadow: "0 14px 28px rgba(37,99,235,0.10)",
    background: "#f8fbff",
  },
  topRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    alignItems: "flex-start",
    marginBottom: "8px",
  },
  company: {
    margin: 0,
    fontSize: "16px",
    fontWeight: 800,
    color: "#0f172a",
  },
  contact: {
    margin: "4px 0 0 0",
    fontSize: "13px",
    color: "#475569",
  },
  aiPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 800,
    whiteSpace: "nowrap",
    marginTop: "6px",
  },
  urgencyPill: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "5px 9px",
    borderRadius: "999px",
    fontSize: "10px",
    fontWeight: 800,
    whiteSpace: "nowrap",
    marginTop: "8px",
  },
  meta: {
    display: "grid",
    gap: "4px",
    fontSize: "12px",
    color: "#64748b",
    marginTop: "8px",
  },
  pill: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 800,
    background: "#eef2ff",
    color: "#3730a3",
    whiteSpace: "nowrap",
  },
  reasonsWrap: {
    marginTop: "10px",
    padding: "10px 12px",
    borderRadius: "14px",
    background: "#f8fafc",
    border: "1px solid rgba(148,163,184,0.16)",
  },
  reasonsTitle: {
    margin: "0 0 8px 0",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "0.06em",
    color: "#64748b",
    textTransform: "uppercase",
  },
  reasonItem: {
    fontSize: "12px",
    color: "#475569",
    lineHeight: 1.5,
    marginBottom: "4px",
  },
  metricRow: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "10px",
    marginTop: "10px",
  },
  metricBox: {
    borderRadius: "14px",
    background: "#f8fafc",
    border: "1px solid rgba(148,163,184,0.16)",
    padding: "10px 12px",
  },
  metricLabel: {
    fontSize: "10px",
    fontWeight: 800,
    letterSpacing: "0.06em",
    color: "#64748b",
    textTransform: "uppercase",
    marginBottom: "6px",
  },
  metricValue: {
    fontSize: "18px",
    fontWeight: 900,
    color: "#0f172a",
  },
  actionBox: {
    marginTop: "10px",
    padding: "12px",
    borderRadius: "14px",
    background: "#eff6ff",
    border: "1px solid rgba(37,99,235,0.14)",
  },
  actionLabel: {
    margin: "0 0 6px 0",
    fontSize: "11px",
    fontWeight: 800,
    letterSpacing: "0.06em",
    color: "#1d4ed8",
    textTransform: "uppercase",
  },
  actionText: {
    margin: 0,
    fontSize: "12px",
    color: "#1e3a8a",
    lineHeight: 1.5,
    fontWeight: 600,
  },
  footerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: "12px",
    marginTop: "12px",
  },
  footerLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  deleteBtn: {
    marginTop: "10px",
    border: "none",
    background: "#ef4444",
    color: "#fff",
    borderRadius: "10px",
    padding: "8px 12px",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
  },
  empty: {
    background: "#fff",
    border: "1px dashed rgba(148,163,184,0.32)",
    borderRadius: "18px",
    padding: "24px",
    color: "#64748b",
  },
};

function getAiPriorityMeta(priority) {
  if (priority === "hot") {
    return {
      label: "HOT 🔴",
      color: "#dc2626",
      background: "rgba(220,38,38,0.10)",
      border: "1px solid rgba(220,38,38,0.18)",
    };
  }

  if (priority === "warm") {
    return {
      label: "WARM 🟠",
      color: "#f59e0b",
      background: "rgba(245,158,11,0.12)",
      border: "1px solid rgba(245,158,11,0.20)",
    };
  }

  return {
    label: "COLD ⚪",
    color: "#64748b",
    background: "rgba(100,116,139,0.10)",
    border: "1px solid rgba(100,116,139,0.16)",
  };
}

function getUrgencyMeta(urgency) {
  if (urgency === "high") {
    return {
      label: "HIGH FOLLOW-UP",
      color: "#991b1b",
      background: "rgba(239,68,68,0.12)",
    };
  }

  if (urgency === "medium") {
    return {
      label: "MEDIUM FOLLOW-UP",
      color: "#9a3412",
      background: "rgba(249,115,22,0.12)",
    };
  }

  return {
    label: "LOW FOLLOW-UP",
    color: "#334155",
    background: "rgba(148,163,184,0.12)",
  };
}

function formatCurrency(value) {
  const amount = Number(value || 0);
  if (!amount) return "R0";
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function LeadsPage() {
  const {
    filteredLeads,
    handleFieldUpdate,
    handleAddNoteHistory,
    newNoteText,
    setNewNoteText,
  } = useContext(DashboardContext);

  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [deletingLeadId, setDeletingLeadId] = useState(null);
  const [aiFilter, setAiFilter] = useState("all");

  const leads = useMemo(() => {
    let data = Array.isArray(filteredLeads) ? filteredLeads : [];

    if (aiFilter !== "all") {
      data = data.filter((lead) => lead.ai_priority === aiFilter);
    }

    return [...data].sort((a, b) => {
      const scoreDiff = (b.ai_score || 0) - (a.ai_score || 0);
      if (scoreDiff !== 0) return scoreDiff;

      const probabilityDiff = (b.deal_probability || 0) - (a.deal_probability || 0);
      if (probabilityDiff !== 0) return probabilityDiff;

      return (b.estimated_value || 0) - (a.estimated_value || 0);
    });
  }, [filteredLeads, aiFilter]);

  const selectedLead = useMemo(() => {
    if (!selectedLeadId && leads.length > 0) {
      return leads[0];
    }

    return leads.find((lead) => String(lead.id) === String(selectedLeadId)) || null;
  }, [leads, selectedLeadId]);

  const totals = useMemo(() => {
    const totalLeads = leads.length;
    const hotCount = leads.filter((lead) => lead.ai_priority === "hot").length;
    const warmCount = leads.filter((lead) => lead.ai_priority === "warm").length;
    const pipelineValue = leads.reduce(
      (sum, lead) => sum + Number(lead.estimated_value || 0),
      0
    );
    const avgProbability = totalLeads
      ? Math.round(
          leads.reduce(
            (sum, lead) => sum + Number(lead.deal_probability || 0),
            0
          ) / totalLeads
        )
      : 0;

    return {
      totalLeads,
      hotCount,
      warmCount,
      pipelineValue,
      avgProbability,
    };
  }, [leads]);

  const handleSelectLead = (leadId) => {
    setSelectedLeadId(leadId);
  };

  const handleUpdateLead = (leadId, patch) => {
    Object.entries(patch).forEach(([field, value]) => {
      handleFieldUpdate(leadId, field, value);
    });
  };

  const handleMoveLead = (leadId, nextStage) => {
    handleFieldUpdate(leadId, "stage", nextStage);
  };

  const handleAddNote = async (leadId, text) => {
    setNewNoteText((prev) => ({
      ...prev,
      [leadId]: text,
    }));

    await handleAddNoteHistory(leadId);
  };

  const handleDelete = async (leadId) => {
    const confirmed = window.confirm("Delete this lead?");
    if (!confirmed) return;

    try {
      setDeletingLeadId(leadId);
      await removeLead(leadId);

      if (String(selectedLeadId) === String(leadId)) {
        setSelectedLeadId(null);
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
      alert(error.message || "Could not delete lead");
    } finally {
      setDeletingLeadId(null);
    }
  };

  const filterOptions = [
    { value: "all", label: "All" },
    { value: "hot", label: "Hot 🔴" },
    { value: "warm", label: "Warm 🟠" },
    { value: "cold", label: "Cold ⚪" },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.listWrap}>
        <h1 style={styles.title}>Leads</h1>

        <div style={styles.filtersRow}>
          {filterOptions.map((option) => {
            const isActive = aiFilter === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setAiFilter(option.value)}
                style={{
                  ...styles.filterButton,
                  ...(isActive ? styles.filterButtonActive : {}),
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <div style={styles.toolbarRow}>
          <div style={styles.summaryGrid}>
            <div style={styles.summaryCard}>
              <p style={styles.summaryLabel}>Total leads</p>
              <p style={styles.summaryValue}>{totals.totalLeads}</p>
            </div>

            <div style={styles.summaryCard}>
              <p style={styles.summaryLabel}>Hot / Warm</p>
              <p style={styles.summaryValue}>
                {totals.hotCount} / {totals.warmCount}
              </p>
            </div>

            <div style={styles.summaryCard}>
              <p style={styles.summaryLabel}>Avg close chance</p>
              <p style={styles.summaryValue}>{totals.avgProbability}%</p>
            </div>

            <div style={styles.summaryCard}>
              <p style={styles.summaryLabel}>Forecast pipeline</p>
              <p style={styles.summaryValue}>{formatCurrency(totals.pipelineValue)}</p>
            </div>
          </div>
        </div>

        {leads.length === 0 ? (
          <div style={styles.empty}>No leads found.</div>
        ) : (
          leads.map((lead) => {
            const isSelected = String(lead.id) === String(selectedLead?.id);
            const isDeleting = String(deletingLeadId) === String(lead.id);
            const aiMeta = getAiPriorityMeta(lead.ai_priority);
            const urgencyMeta = getUrgencyMeta(lead.follow_up_urgency);
            const aiReasons = Array.isArray(lead.ai_reasons) ? lead.ai_reasons : [];

            return (
              <div
                key={lead.id}
                onClick={() => handleSelectLead(lead.id)}
                style={{
                  ...styles.card,
                  ...(isSelected ? styles.selectedCard : {}),
                }}
              >
                <div style={styles.topRow}>
                  <div>
                    <h3 style={styles.company}>
                      {lead.businessName || "Untitled Lead"}
                    </h3>
                    <p style={styles.contact}>
                      {lead.contactName || "No contact name"}
                    </p>

                    <div
                      style={{
                        ...styles.aiPill,
                        color: aiMeta.color,
                        background: aiMeta.background,
                        border: aiMeta.border,
                      }}
                    >
                      <span>{aiMeta.label}</span>
                      <span>({lead.ai_score || 0})</span>
                    </div>
                  </div>

                  <div style={styles.pill}>{lead.stage || "New Lead"}</div>
                </div>

                <div style={styles.meta}>
                  <div>{lead.email || "No email"}</div>
                  <div>{lead.phone || lead.mobile || "No phone"}</div>
                  <div>{lead.source || "No source"}</div>
                </div>

                <div style={styles.metricRow}>
                  <div style={styles.metricBox}>
                    <div style={styles.metricLabel}>Deal probability</div>
                    <div style={styles.metricValue}>{lead.deal_probability || 0}%</div>
                  </div>

                  <div style={styles.metricBox}>
                    <div style={styles.metricLabel}>Forecast value</div>
                    <div style={styles.metricValue}>
                      {formatCurrency(lead.estimated_value)}
                    </div>
                  </div>
                </div>

                {lead.next_best_action ? (
                  <div style={styles.actionBox}>
                    <div style={styles.actionLabel}>Next best action</div>
                    <p style={styles.actionText}>{lead.next_best_action}</p>
                  </div>
                ) : null}

                {aiReasons.length > 0 && (
                  <div style={styles.reasonsWrap}>
                    <div style={styles.reasonsTitle}>
                      Why this lead scored this way
                    </div>
                    {aiReasons.map((reason, index) => (
                      <div key={`${reason}-${index}`} style={styles.reasonItem}>
                        • {reason}
                      </div>
                    ))}
                  </div>
                )}

                <div style={styles.footerRow}>
                  <div>
                    <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>
                      {lead.source || "Manual"}
                    </div>

                    <div
                      style={{
                        ...styles.urgencyPill,
                        color: urgencyMeta.color,
                        background: urgencyMeta.background,
                      }}
                    >
                      {urgencyMeta.label}
                    </div>
                  </div>

                  <button
                    style={{
                      ...styles.deleteBtn,
                      opacity: isDeleting ? 0.7 : 1,
                    }}
                    disabled={isDeleting}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(lead.id);
                    }}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <LeadSidePanel
        lead={selectedLead}
        stageOrder={stageOrder}
        onUpdateLead={handleUpdateLead}
        onMoveLead={handleMoveLead}
        onAddNote={handleAddNote}
        newNoteText={newNoteText}
      />
    </div>
  );
}