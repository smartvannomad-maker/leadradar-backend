const statusColors = {
  Hot: "#dc2626",
  Warm: "#f59e0b",
  Cold: "#2563eb",
};

const styles = {
  card: {
    borderRadius: "18px",
    padding: "14px",
    background: "#ffffff",
    border: "1px solid rgba(148,163,184,0.18)",
    boxShadow: "0 10px 26px rgba(15,23,42,0.05)",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  cardSelected: {
    border: "1px solid rgba(79,70,229,0.45)",
    boxShadow: "0 14px 30px rgba(79,70,229,0.12)",
  },
  top: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    alignItems: "flex-start",
    marginBottom: "10px",
  },
  company: {
    margin: 0,
    fontSize: "15px",
    fontWeight: 800,
    color: "#0f172a",
  },
  name: {
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
  statusPill: {
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 700,
    color: "#fff",
    whiteSpace: "nowrap",
  },
  metricsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "10px",
    marginBottom: "12px",
  },
  metricCard: {
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
  info: {
    display: "grid",
    gap: "6px",
    marginBottom: "12px",
    fontSize: "12px",
    color: "#475569",
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
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px",
    marginTop: "12px",
  },
  footerLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  footerRight: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  source: {
    fontSize: "11px",
    color: "#64748b",
    fontWeight: 600,
  },
  select: {
    borderRadius: "12px",
    border: "1px solid rgba(148,163,184,0.24)",
    padding: "8px 10px",
    fontSize: "12px",
    background: "#f8fafc",
    color: "#0f172a",
  },
  deleteBtn: {
    border: "none",
    background: "#ef4444",
    color: "#fff",
    borderRadius: "10px",
    padding: "8px 10px",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
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

export default function LeadCard({
  lead,
  stageOrder = ["New Lead", "Contacted", "Qualified", "Proposal", "Closed"],
  isSelected,
  onSelect,
  onMoveLead,
  onDelete,
}) {
  const aiMeta = getAiPriorityMeta(lead.ai_priority);
  const urgencyMeta = getUrgencyMeta(lead.follow_up_urgency);
  const aiReasons = Array.isArray(lead.ai_reasons) ? lead.ai_reasons : [];

  return (
    <div
      style={{
        ...styles.card,
        ...(isSelected ? styles.cardSelected : {}),
      }}
      onClick={onSelect}
    >
      <div style={styles.top}>
        <div>
          <h4 style={styles.company}>{lead.businessName}</h4>
          <p style={styles.name}>{lead.contactName}</p>

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

        <div
          style={{
            ...styles.statusPill,
            background: statusColors[lead.status] || "#64748b",
          }}
        >
          {lead.status}
        </div>
      </div>

      <div style={styles.metricsRow}>
        <div style={styles.metricCard}>
          <div style={styles.metricLabel}>Deal probability</div>
          <div style={styles.metricValue}>{lead.deal_probability || 0}%</div>
        </div>

        <div style={styles.metricCard}>
          <div style={styles.metricLabel}>Forecast value</div>
          <div style={styles.metricValue}>{formatCurrency(lead.estimated_value)}</div>
        </div>
      </div>

      <div style={styles.info}>
        <div>{lead.email || "No email added"}</div>
        <div>{lead.phone || lead.mobile || "No number added"}</div>
      </div>

      {lead.next_best_action ? (
        <div style={styles.actionBox}>
          <div style={styles.actionLabel}>Next best action</div>
          <p style={styles.actionText}>{lead.next_best_action}</p>
        </div>
      ) : null}

      {aiReasons.length > 0 && (
        <div style={styles.reasonsWrap}>
          <div style={styles.reasonsTitle}>Why this lead scored this way</div>
          {aiReasons.map((reason, index) => (
            <div key={`${reason}-${index}`} style={styles.reasonItem}>
              • {reason}
            </div>
          ))}
        </div>
      )}

      <div style={styles.footer}>
        <div style={styles.footerLeft}>
          <div style={styles.source}>{lead.source || "Manual"}</div>

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

        <div style={styles.footerRight}>
          <select
            style={styles.select}
            value={lead.stage || "New Lead"}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onMoveLead && onMoveLead(lead.id, e.target.value)}
          >
            {stageOrder.map((stage) => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>

          <button
            style={styles.deleteBtn}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(lead.id);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}