import PipelineColumn from "./PipelineColumn";

const styles = {
  board: {
    display: "grid",
    gridTemplateColumns: "repeat(5, minmax(240px, 1fr))",
    gap: "16px",
    overflowX: "auto",
    paddingBottom: "8px",
  },
};

export default function LeadPipelineBoard({
  leads,
  stageOrder,
  selectedLeadId,
  onSelectLead,
  onMoveLead,
}) {
  return (
    <div style={styles.board}>
      {stageOrder.map((stage) => {
        const stageLeads = leads.filter((lead) => lead.stage === stage);

        return (
          <PipelineColumn
            key={stage}
            stage={stage}
            leads={stageLeads}
            stageOrder={stageOrder}
            selectedLeadId={selectedLeadId}
            onSelectLead={onSelectLead}
            onMoveLead={onMoveLead}
          />
        );
      })}
    </div>
  );
}