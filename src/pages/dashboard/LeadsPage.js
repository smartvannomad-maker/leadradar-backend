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

  const leads = useMemo(() => {
    return Array.isArray(filteredLeads) ? filteredLeads : [];
  }, [filteredLeads]);

  const selectedLead = useMemo(() => {
    if (!selectedLeadId && leads.length > 0) {
      return leads[0];
    }

    return (
      leads.find((lead) => String(lead.id) === String(selectedLeadId)) || null
    );
  }, [leads, selectedLeadId]);

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

  return (
    <div style={styles.page}>
      <div style={styles.listWrap}>
        <h1 style={styles.title}>Leads</h1>

        {leads.length === 0 ? (
          <div style={styles.empty}>No leads found.</div>
        ) : (
          leads.map((lead) => {
            const isSelected =
              String(lead.id) === String(selectedLead?.id);

            const isDeleting =
              String(deletingLeadId) === String(lead.id);

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
                  </div>

                  <div style={styles.pill}>
                    {lead.stage || "New Lead"}
                  </div>
                </div>

                <div style={styles.meta}>
                  <div>{lead.email || "No email"}</div>
                  <div>{lead.phone || "No phone"}</div>
                  <div>{lead.source || "No source"}</div>
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