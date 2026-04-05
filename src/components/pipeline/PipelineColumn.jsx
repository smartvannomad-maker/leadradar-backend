import LeadCard from "./LeadCard";

const styles = {
  column: {
    background: "rgba(255,255,255,0.72)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(148,163,184,0.18)",
    borderRadius: "24px",
    padding: "14px",
    minHeight: "520px",
    boxShadow: "0 16px 40px rgba(15,23,42,0.05)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  stage: {
    margin: 0,
    fontSize: "15px",
    fontWeight: 800,
    color: "#0f172a",
  },
  badge: {
    minWidth: "28px",
    height: "28px",
    borderRadius: "999px",
    display: "grid",
    placeItems: "center",
    background: "#e2e8f0",
    color: "#334155",
    fontSize: "12px",
    fontWeight: 700,
    padding: "0 8px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
};

export default function PipelineColumn({
  stage,
  leads,
  stageOrder,
  selectedLeadId,
  onSelectLead,
  onMoveLead,
}) {
  return (
    <div style={styles.column}>
      <div style={styles.header}>
        <h3 style={styles.stage}>{stage}</h3>
        <div style={styles.badge}>{leads.length}</div>
      </div>

      <div style={styles.list}>
        {leads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            stageOrder={stageOrder}
            isSelected={lead.id === selectedLeadId}
            onSelect={() => onSelectLead(lead.id)}
            onMoveLead={onMoveLead}
          />
        ))}
      </div>
    </div>
  );
}