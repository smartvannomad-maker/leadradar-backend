import { styles } from "../../styles/dashboardStyles";
import {
  categoryOptions,
  quoteStatuses,
  stages,
  statusOptions,
} from "../../features/leads/leads.constants";

export default function AddLeadForm({ form, setForm, onSubmit }) {
  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const premium = {
    card: {
      position: "relative",
      overflow: "hidden",
      borderRadius: 28,
      padding: "26px",
      background:
        "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.99) 100%)",
      border: "1px solid rgba(148,163,184,0.16)",
      boxShadow:
        "0 20px 44px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.7)",
    },

    glow: {
      position: "absolute",
      top: "-60px",
      right: "-60px",
      width: "180px",
      height: "180px",
      borderRadius: "50%",
      background:
        "radial-gradient(circle, rgba(59,130,246,0.14) 0%, rgba(99,102,241,0.10) 40%, transparent 70%)",
      pointerEvents: "none",
    },

    sectionTitle: {
      fontSize: "1.4rem",
      fontWeight: 900,
      letterSpacing: "-0.04em",
      marginBottom: 6,
      color: "#0f172a",
    },

    sectionSub: {
      fontSize: 14,
      color: "#64748b",
      marginBottom: 18,
      lineHeight: 1.7,
    },

    label: {
      ...styles.label,
      fontWeight: 800,
      letterSpacing: "0.08em",
    },

    input: {
      ...styles.input,
      borderRadius: 16,
      border: "1px solid rgba(148,163,184,0.18)",
      background: "rgba(255,255,255,0.9)",
      boxShadow: "inset 0 1px 2px rgba(15,23,42,0.04)",
      fontWeight: 600,
    },

    select: {
      ...styles.select,
      borderRadius: 16,
      background: "rgba(255,255,255,0.9)",
      fontWeight: 600,
    },

    textarea: {
      ...styles.textarea,
      borderRadius: 18,
      background: "rgba(255,255,255,0.9)",
    },

    helper: {
      fontSize: 12,
      color: "#94a3b8",
      marginTop: 4,
    },

    divider: {
      height: 1,
      background:
        "linear-gradient(90deg, transparent 0%, rgba(148,163,184,0.18) 20%, rgba(148,163,184,0.18) 80%, transparent 100%)",
      margin: "10px 0",
    },

    footer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 16,
      flexWrap: "wrap",
      marginTop: 6,
    },

    footerText: {
      color: "#64748b",
      fontSize: 14,
      lineHeight: 1.7,
    },

    button: {
      ...styles.primaryButton,
      borderRadius: 16,
      boxShadow: "0 14px 30px rgba(37,99,235,0.18)",
    },
  };

  const inputFocus = (e) => {
    e.currentTarget.style.border = "1px solid rgba(59,130,246,0.35)";
    e.currentTarget.style.boxShadow = "0 0 0 4px rgba(59,130,246,0.10)";
  };

  const inputBlur = (e) => {
    e.currentTarget.style.border = "1px solid rgba(148,163,184,0.18)";
    e.currentTarget.style.boxShadow =
      "inset 0 1px 2px rgba(15,23,42,0.04)";
  };

  return (
    <div style={premium.card}>
      <div style={premium.glow} />

      <h2 style={premium.sectionTitle}>Add New Lead</h2>
      <p style={premium.sectionSub}>
        Capture a new opportunity with clean structure, better visibility, and
        strong pipeline tracking.
      </p>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 18 }}>
        {/* Row 1 */}
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(2,1fr)" }}>
          <div>
            <label style={premium.label}>Business Name *</label>
            <input
              style={premium.input}
              value={form.businessName}
              onChange={(e) => updateField("businessName", e.target.value)}
              onFocus={inputFocus}
              onBlur={inputBlur}
            />
          </div>

          <div>
            <label style={premium.label}>Contact Name</label>
            <input
              style={premium.input}
              value={form.contactName}
              onChange={(e) => updateField("contactName", e.target.value)}
              onFocus={inputFocus}
              onBlur={inputBlur}
            />
          </div>
        </div>

        {/* Row 2 */}
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(2,1fr)" }}>
          <div>
            <label style={premium.label}>Mobile / WhatsApp</label>
            <input
              style={premium.input}
              value={form.mobile}
              onChange={(e) => updateField("mobile", e.target.value)}
              onFocus={inputFocus}
              onBlur={inputBlur}
            />
          </div>

          <div>
            <label style={premium.label}>Category</label>
            <select
              style={premium.select}
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
            >
              {categoryOptions.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3 */}
        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(4,1fr)" }}>
          <div>
            <label style={premium.label}>Status</label>
            <select
              style={premium.select}
              value={form.status}
              onChange={(e) => updateField("status", e.target.value)}
            >
              {statusOptions.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={premium.label}>Stage</label>
            <select
              style={premium.select}
              value={form.stage}
              onChange={(e) => updateField("stage", e.target.value)}
            >
              {stages.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={premium.label}>Follow-up Date</label>
            <input
              type="date"
              style={premium.input}
              value={form.followUpDate}
              onChange={(e) => updateField("followUpDate", e.target.value)}
              onFocus={inputFocus}
              onBlur={inputBlur}
            />
          </div>

          <div>
            <label style={premium.label}>Quote Amount</label>
            <input
              style={premium.input}
              value={form.quoteAmount}
              onChange={(e) => updateField("quoteAmount", e.target.value)}
              onFocus={inputFocus}
              onBlur={inputBlur}
            />
          </div>
        </div>

        {/* Quote status */}
        <div>
          <label style={premium.label}>Quote Status</label>
          <select
            style={premium.select}
            value={form.quoteStatus}
            onChange={(e) => updateField("quoteStatus", e.target.value)}
          >
            {quoteStatuses.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label style={premium.label}>Initial Notes</label>
          <textarea
            style={premium.textarea}
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
          />
          <div style={premium.helper}>
            Add context, client needs, or next steps.
          </div>
        </div>

        <div style={premium.divider} />

        {/* Footer */}
        <div style={premium.footer}>
          <div style={premium.footerText}>
            This lead will be saved inside your workspace pipeline.
          </div>

          <button type="submit" style={premium.button}>
            Add Lead
          </button>
        </div>
      </form>
    </div>
  );
}