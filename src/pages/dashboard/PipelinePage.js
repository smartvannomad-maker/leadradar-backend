import { useMemo, useState } from "react";
import LeadPipelineBoard from "../../components/pipeline/LeadPipelineBoard";
import LeadSidePanel from "../../components/pipeline/LeadSidePanel";

const stageOrder = [
  "New Lead",
  "Contacted",
  "Qualified",
  "Proposal",
  "Closed",
];

const initialLeads = [
  {
    id: 1,
    businessName: "Acme Growth",
    contactName: "Sarah Jacobs",
    email: "sarah@acmegrowth.com",
    phone: "27712345678",
    linkedin: "https://www.linkedin.com/in/sarah-jacobs",
    stage: "New Lead",
    status: "Hot",
    source: "LinkedIn",
    notes: [
      {
        id: 1,
        text: "Saved from LinkedIn search.",
        createdAt: "2026-04-04 10:00",
      },
    ],
  },
  {
    id: 2,
    businessName: "BluePeak Media",
    contactName: "David Smith",
    email: "david@bluepeakmedia.com",
    phone: "27821234567",
    linkedin: "https://www.linkedin.com/in/david-smith",
    stage: "Contacted",
    status: "Warm",
    source: "CSV Import",
    notes: [],
  },
  {
    id: 3,
    businessName: "Nova Systems",
    contactName: "Lisa Brown",
    email: "lisa@novasystems.com",
    phone: "27719876543",
    linkedin: "https://www.linkedin.com/company/nova-systems",
    stage: "Proposal",
    status: "Hot",
    source: "Manual",
    notes: [],
  },
];

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f8fbff 0%, #eef4ff 50%, #f8fafc 100%)",
    padding: "24px",
  },
  shell: {
    display: "grid",
    gridTemplateColumns: "1fr 360px",
    gap: "20px",
    alignItems: "start",
  },
  leftSide: {
    minWidth: 0,
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  headingWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  eyebrow: {
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#4f46e5",
  },
  title: {
    margin: 0,
    fontSize: "32px",
    lineHeight: 1.1,
    fontWeight: 800,
    color: "#0f172a",
  },
  subtitle: {
    margin: 0,
    color: "#475569",
    fontSize: "14px",
  },
  actions: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  input: {
    minWidth: "240px",
    padding: "12px 14px",
    borderRadius: "14px",
    border: "1px solid rgba(148,163,184,0.28)",
    background: "rgba(255,255,255,0.85)",
    outline: "none",
    fontSize: "14px",
    color: "#0f172a",
    boxShadow: "0 8px 24px rgba(15,23,42,0.04)",
  },
  addBtn: {
    border: "none",
    background: "linear-gradient(135deg, #2563eb, #4f46e5)",
    color: "#fff",
    borderRadius: "14px",
    padding: "12px 16px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 12px 30px rgba(37,99,235,0.25)",
  },
};

export default function PipelinePage() {
  const [leads, setLeads] = useState(initialLeads);
  const [selectedLeadId, setSelectedLeadId] = useState(
    initialLeads[0]?.id ?? null
  );
  const [search, setSearch] = useState("");

  const selectedLead = useMemo(
    () => leads.find((lead) => lead.id === selectedLeadId) || null,
    [leads, selectedLeadId]
  );

  const filteredLeads = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return leads;

    return leads.filter((lead) => {
      return (
        lead.businessName.toLowerCase().includes(q) ||
        lead.contactName.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        (lead.phone || "").toLowerCase().includes(q) ||
        (lead.linkedin || "").toLowerCase().includes(q)
      );
    });
  }, [leads, search]);

  const handleSelectLead = (leadId) => {
    setSelectedLeadId(leadId);
  };

  const handleMoveLead = (leadId, nextStage) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId ? { ...lead, stage: nextStage } : lead
      )
    );
  };

  const handleUpdateLead = (leadId, patch) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId ? { ...lead, ...patch } : lead
      )
    );
  };

  const handleAddNote = (leadId, text) => {
    if (!text.trim()) return;

    const newNote = {
      id: Date.now(),
      text: text.trim(),
      createdAt: new Date().toLocaleString(),
    };

    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === leadId
          ? { ...lead, notes: [newNote, ...(lead.notes || [])] }
          : lead
      )
    );
  };

  const handleAddLead = () => {
    const newLead = {
      id: Date.now(),
      businessName: "New Business",
      contactName: "New Contact",
      email: "",
      phone: "",
      linkedin: "",
      stage: "New Lead",
      status: "Warm",
      source: "Manual",
      notes: [],
    };

    setLeads((prev) => [newLead, ...prev]);
    setSelectedLeadId(newLead.id);
  };

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div style={styles.headingWrap}>
          <div style={styles.eyebrow}>LeadRadar Pipeline</div>
          <h1 style={styles.title}>Pipeline</h1>
          <p style={styles.subtitle}>
            Manage leads visually and take action from one smart side panel.
          </p>
        </div>

        <div style={styles.actions}>
          <input
            style={styles.input}
            placeholder="Search by company, contact, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button style={styles.addBtn} onClick={handleAddLead}>
            + Add Lead
          </button>
        </div>
      </div>

      <div style={styles.shell}>
        <div style={styles.leftSide}>
          <LeadPipelineBoard
            leads={filteredLeads}
            stageOrder={stageOrder}
            selectedLeadId={selectedLeadId}
            onSelectLead={handleSelectLead}
            onMoveLead={handleMoveLead}
          />
        </div>

        <LeadSidePanel
          lead={selectedLead}
          stageOrder={stageOrder}
          onUpdateLead={handleUpdateLead}
          onMoveLead={handleMoveLead}
          onAddNote={handleAddNote}
        />
      </div>
    </div>
  );
}