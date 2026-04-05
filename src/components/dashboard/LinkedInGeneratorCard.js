import { ExternalLink, Briefcase } from "lucide-react";
import { styles } from "../../styles/dashboardStyles";

export default function LinkedInGeneratorCard({
  form,
  setForm,
  linkedinSearchQuery,
  onOpenSearch,
  onSaveIntoLeadForm,
}) {
  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div>
        <h2 style={{ ...styles.cardTitle, fontSize: 22, marginBottom: 8 }}>
          LinkedIn Lead Generator
        </h2>
        <p style={{ ...styles.cardText, margin: 0 }}>
          Build compliant LinkedIn searches and save profile details manually into your workspace.
        </p>
      </div>

      <div
        className="lr-dashboard-grid-2"
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        }}
      >
        <div>
          <label style={styles.label}>Role / Title</label>
          <input
            style={styles.input}
            placeholder="e.g. Operations Manager"
            value={form.linkedinRole}
            onChange={(e) => updateField("linkedinRole", e.target.value)}
          />
        </div>

        <div>
          <label style={styles.label}>Location</label>
          <input
            style={styles.input}
            placeholder="e.g. Cape Town"
            value={form.linkedinLocation}
            onChange={(e) => updateField("linkedinLocation", e.target.value)}
          />
        </div>
      </div>

      <div
        className="lr-dashboard-grid-2"
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        }}
      >
        <div>
          <label style={styles.label}>Keywords</label>
          <input
            style={styles.input}
            placeholder="e.g. logistics, automation"
            value={form.linkedinKeywords}
            onChange={(e) => updateField("linkedinKeywords", e.target.value)}
          />
        </div>

        <div>
          <label style={styles.label}>Company</label>
          <input
            style={styles.input}
            placeholder="e.g. Acme Logistics"
            value={form.linkedinCompany}
            onChange={(e) => updateField("linkedinCompany", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label style={styles.label}>Generated Search Query</label>
        <div
          style={{
            border: "1px solid #dbeafe",
            background: "#f8fbff",
            color: "#1e293b",
            borderRadius: 18,
            padding: 16,
            minHeight: 64,
            lineHeight: 1.7,
            fontSize: 14,
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
          }}
        >
          {linkedinSearchQuery || "Your LinkedIn search string will appear here."}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <button type="button" onClick={onOpenSearch} style={styles.primaryButton}>
          <ExternalLink size={16} style={{ marginRight: 8 }} />
          Open LinkedIn Search
        </button>
      </div>

      <div>
        <label style={styles.label}>LinkedIn Profile URL</label>
        <input
          style={styles.input}
          placeholder="https://linkedin.com/in/..."
          value={form.linkedinProfileUrl}
          onChange={(e) => updateField("linkedinProfileUrl", e.target.value)}
        />
      </div>

      <div>
        <label style={styles.label}>Headline</label>
        <input
          style={styles.input}
          placeholder="e.g. Founder | Growth Operator | Sales Systems"
          value={form.linkedinHeadline}
          onChange={(e) => updateField("linkedinHeadline", e.target.value)}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7 }}>
          Save the LinkedIn details directly into your lead form to avoid duplicate entry.
        </div>

        <button
          type="button"
          onClick={onSaveIntoLeadForm}
          style={styles.secondaryButton}
        >
          <Briefcase size={16} style={{ marginRight: 8 }} />
          Save Into Lead Form
        </button>
      </div>
    </div>
  );
}