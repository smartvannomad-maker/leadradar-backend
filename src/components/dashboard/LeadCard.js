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
  statusPill: {
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "11px",
    fontWeight: 700,
    color: "#fff",
    whiteSpace: "nowrap",
  },
  info: {
    display: "grid",
    gap: "6px",
    marginBottom: "12px",
    fontSize: "12px",
    color: "#475569",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px",
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

export default function LeadCard({
  lead,
  stageOrder = ["New Lead", "Contacted", "Qualified", "Proposal", "Closed"],
  isSelected,
  onSelect,
  onMoveLead,
  onDelete,
}) {
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

      <div style={styles.info}>
        <div>{lead.email || "No email added"}</div>
        <div>{lead.phone || "No number added"}</div>
      </div>

      <div style={styles.footer}>
        <div style={styles.source}>{lead.source || "Manual"}</div>

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