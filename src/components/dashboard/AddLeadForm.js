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

  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: 18 }}>
      <div
        className="lr-dashboard-grid-2"
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        }}
      >
        <div>
          <label style={styles.label}>Business Name *</label>
          <input
            style={styles.input}
            placeholder="e.g. Acme Logistics"
            value={form.businessName}
            onChange={(e) => updateField("businessName", e.target.value)}
          />
        </div>

        <div>
          <label style={styles.label}>Contact Name</label>
          <input
            style={styles.input}
            placeholder="e.g. John Smith"
            value={form.contactName}
            onChange={(e) => updateField("contactName", e.target.value)}
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
          <label style={styles.label}>Mobile / WhatsApp</label>
          <input
            style={styles.input}
            placeholder="e.g. 0821234567"
            value={form.mobile}
            onChange={(e) => updateField("mobile", e.target.value)}
          />
        </div>

        <div>
          <label style={styles.label}>Category</label>
          <select
            style={styles.select}
            value={form.category}
            onChange={(e) => updateField("category", e.target.value)}
          >
            {categoryOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: 16,
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        }}
        className="lr-dashboard-grid-3"
      >
        <div>
          <label style={styles.label}>Status</label>
          <select
            style={styles.select}
            value={form.status}
            onChange={(e) => updateField("status", e.target.value)}
          >
            {statusOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={styles.label}>Stage</label>
          <select
            style={styles.select}
            value={form.stage}
            onChange={(e) => updateField("stage", e.target.value)}
          >
            {stages.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={styles.label}>Follow-up Date</label>
          <input
            type="date"
            style={styles.input}
            value={form.followUpDate}
            onChange={(e) => updateField("followUpDate", e.target.value)}
          />
        </div>

        <div>
          <label style={styles.label}>Quote Amount</label>
          <input
            style={styles.input}
            placeholder="e.g. 25000"
            value={form.quoteAmount}
            onChange={(e) => updateField("quoteAmount", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label style={styles.label}>Quote Status</label>
        <select
          style={styles.select}
          value={form.quoteStatus}
          onChange={(e) => updateField("quoteStatus", e.target.value)}
        >
          {quoteStatuses.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>

      <div>
        <label style={styles.label}>Initial Notes</label>
        <textarea
          style={styles.textarea}
          placeholder="Add context, next steps, source notes, or client needs..."
          value={form.notes}
          onChange={(e) => updateField("notes", e.target.value)}
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          alignItems: "center",
          flexWrap: "wrap",
          marginTop: 4,
        }}
      >
        <div style={{ color: "#64748b", fontSize: 14, lineHeight: 1.7 }}>
          This lead will be saved inside your current workspace pipeline.
        </div>

        <button type="submit" style={styles.primaryButton}>
          Add Lead
        </button>
      </div>
    </form>
  );
}