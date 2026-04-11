import { useEffect, useMemo, useState } from "react";

const styles = {
  panel: {
    position: "sticky",
    top: "24px",
    borderRadius: "26px",
    background: "rgba(255,255,255,0.8)",
    backdropFilter: "blur(18px)",
    border: "1px solid rgba(148,163,184,0.18)",
    boxShadow: "0 18px 50px rgba(15,23,42,0.08)",
    overflow: "hidden",
    minHeight: "700px",
  },
  empty: {
    padding: "28px",
    color: "#64748b",
  },
  inner: {
    padding: "22px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  hero: {
    padding: "22px",
    background: "linear-gradient(135deg, #2563eb, #4f46e5)",
    color: "#fff",
  },
  heroTitle: {
    margin: 0,
    fontSize: "24px",
    fontWeight: 800,
    lineHeight: 1.1,
  },
  heroSubtitle: {
    margin: "8px 0 0 0",
    opacity: 0.9,
    fontSize: "14px",
  },
  aiHeroRow: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "14px",
  },
  aiPill: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 800,
    background: "rgba(255,255,255,0.16)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.18)",
  },
  section: {
    display: "grid",
    gap: "12px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#64748b",
    fontWeight: 800,
  },
  fieldGrid: {
    display: "grid",
    gap: "12px",
  },
  label: {
    display: "grid",
    gap: "6px",
    fontSize: "12px",
    fontWeight: 700,
    color: "#334155",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "14px",
    border: "1px solid rgba(148,163,184,0.24)",
    background: "#fff",
    outline: "none",
    fontSize: "14px",
    color: "#0f172a",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    minHeight: "92px",
    resize: "vertical",
    padding: "12px 14px",
    borderRadius: "14px",
    border: "1px solid rgba(148,163,184,0.24)",
    background: "#fff",
    outline: "none",
    fontSize: "14px",
    color: "#0f172a",
    boxSizing: "border-box",
  },
  row2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
  },
  actionGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  actionBtn: {
    border: "1px solid rgba(148,163,184,0.2)",
    background: "#fff",
    color: "#0f172a",
    borderRadius: "14px",
    padding: "12px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 8px 24px rgba(15,23,42,0.04)",
  },
  primaryBtn: {
    border: "none",
    background: "linear-gradient(135deg, #2563eb, #4f46e5)",
    color: "#fff",
    borderRadius: "14px",
    padding: "12px 14px",
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 12px 30px rgba(37,99,235,0.22)",
  },
  noteInputWrap: {
    display: "grid",
    gap: "10px",
  },
  noteList: {
    display: "grid",
    gap: "10px",
  },
  noteItem: {
    background: "#fff",
    border: "1px solid rgba(148,163,184,0.16)",
    borderRadius: "16px",
    padding: "12px",
    boxShadow: "0 8px 20px rgba(15,23,42,0.03)",
  },
  noteDate: {
    margin: "0 0 6px 0",
    fontSize: "11px",
    color: "#64748b",
    fontWeight: 700,
  },
  noteText: {
    margin: 0,
    fontSize: "13px",
    color: "#0f172a",
    lineHeight: 1.5,
  },
  metricsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "12px",
  },
  metricCard: {
    background: "#fff",
    border: "1px solid rgba(148,163,184,0.16)",
    borderRadius: "16px",
    padding: "14px",
    boxShadow: "0 8px 20px rgba(15,23,42,0.03)",
  },
  metricLabel: {
    margin: "0 0 6px 0",
    fontSize: "11px",
    color: "#64748b",
    fontWeight: 800,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  metricValue: {
    margin: 0,
    fontSize: "22px",
    fontWeight: 900,
    color: "#0f172a",
  },
  actionBox: {
    background: "#eff6ff",
    border: "1px solid rgba(37,99,235,0.14)",
    borderRadius: "16px",
    padding: "14px",
  },
  actionLabel: {
    margin: "0 0 8px 0",
    fontSize: "11px",
    color: "#1d4ed8",
    fontWeight: 800,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  actionText: {
    margin: 0,
    fontSize: "13px",
    color: "#1e3a8a",
    lineHeight: 1.55,
    fontWeight: 600,
  },
  reasonsWrap: {
    display: "grid",
    gap: "8px",
  },
  reasonItem: {
    background: "#fff",
    border: "1px solid rgba(148,163,184,0.16)",
    borderRadius: "14px",
    padding: "10px 12px",
    fontSize: "13px",
    color: "#334155",
    lineHeight: 1.5,
    boxShadow: "0 8px 20px rgba(15,23,42,0.03)",
  },
};

function normalizePhone(phone = "") {
  return String(phone).replace(/[^\d]/g, "");
}

function openSafe(url) {
  window.open(url, "_blank", "noopener,noreferrer");
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

function getAiPriorityMeta(priority) {
  if (priority === "hot") {
    return {
      label: "HOT 🔴",
      color: "#991b1b",
      background: "rgba(239,68,68,0.14)",
    };
  }

  if (priority === "warm") {
    return {
      label: "WARM 🟠",
      color: "#9a3412",
      background: "rgba(249,115,22,0.16)",
    };
  }

  return {
    label: "COLD ⚪",
    color: "#334155",
    background: "rgba(148,163,184,0.16)",
  };
}

function getUrgencyMeta(urgency) {
  if (urgency === "high") {
    return {
      label: "HIGH FOLLOW-UP",
      color: "#991b1b",
      background: "rgba(239,68,68,0.14)",
    };
  }

  if (urgency === "medium") {
    return {
      label: "MEDIUM FOLLOW-UP",
      color: "#9a3412",
      background: "rgba(249,115,22,0.16)",
    };
  }

  return {
    label: "LOW FOLLOW-UP",
    color: "#334155",
    background: "rgba(148,163,184,0.16)",
  };
}

function formatNoteDate(value) {
  if (!value) return "Unknown date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export default function LeadSidePanel({
  lead,
  stageOrder,
  onUpdateLead,
  onMoveLead,
  onAddNote,
}) {
  const [form, setForm] = useState(null);
  const [noteText, setNoteText] = useState("");

  useEffect(() => {
    setForm(lead ? { ...lead } : null);
    setNoteText("");
  }, [lead]);

  const notesHistory = useMemo(() => {
    if (!form) return [];
    if (Array.isArray(form.notesHistory)) return form.notesHistory;
    if (Array.isArray(form.notes)) return form.notes;
    return [];
  }, [form]);

  if (!lead || !form) {
    return (
      <div style={styles.panel}>
        <div style={styles.empty}>
          Select a lead to view details, edit fields, and launch actions.
        </div>
      </div>
    );
  }

  const patchField = (field, value) => {
    const next = { ...form, [field]: value };
    setForm(next);
    onUpdateLead(lead.id, { [field]: value });
  };

  const phone = normalizePhone(form.phone || form.mobile || "");
  const email = form.email || form.user_email || "";
  const linkedinUrl = form.linkedin || form.linkedinProfileUrl || "";
  const canCall = !!phone;
  const canWhatsApp = !!phone;
  const canEmail = !!email;
  const canLinkedIn = !!linkedinUrl;

  const aiMeta = getAiPriorityMeta(form.ai_priority);
  const urgencyMeta = getUrgencyMeta(form.follow_up_urgency);
  const aiReasons = Array.isArray(form.ai_reasons) ? form.ai_reasons : [];

  return (
    <div style={styles.panel}>
      <div style={styles.hero}>
        <h2 style={styles.heroTitle}>{form.contactName || "Unnamed Contact"}</h2>
        <p style={styles.heroSubtitle}>
          {form.businessName || "No business name"} · {form.stage || "No stage"}
        </p>

        <div style={styles.aiHeroRow}>
          <div
            style={{
              ...styles.aiPill,
              color: aiMeta.color,
              background: aiMeta.background,
            }}
          >
            {aiMeta.label} ({form.ai_score || 0})
          </div>

          <div
            style={{
              ...styles.aiPill,
              color: urgencyMeta.color,
              background: urgencyMeta.background,
            }}
          >
            {urgencyMeta.label}
          </div>
        </div>
      </div>

      <div style={styles.inner}>
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>AI Overview</h3>

          <div style={styles.metricsGrid}>
            <div style={styles.metricCard}>
              <p style={styles.metricLabel}>Deal probability</p>
              <p style={styles.metricValue}>{form.deal_probability || 0}%</p>
            </div>

            <div style={styles.metricCard}>
              <p style={styles.metricLabel}>Forecast value</p>
              <p style={styles.metricValue}>
                {formatCurrency(form.estimated_value)}
              </p>
            </div>
          </div>

          {form.next_best_action ? (
            <div style={styles.actionBox}>
              <p style={styles.actionLabel}>Next best action</p>
              <p style={styles.actionText}>{form.next_best_action}</p>
            </div>
          ) : null}
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>AI Reasons</h3>

          {aiReasons.length === 0 ? (
            <div style={styles.noteItem}>
              <p style={styles.noteText}>No AI reasons available yet.</p>
            </div>
          ) : (
            <div style={styles.reasonsWrap}>
              {aiReasons.map((reason, index) => (
                <div key={`${reason}-${index}`} style={styles.reasonItem}>
                  • {reason}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Quick Actions</h3>
          <div style={styles.actionGrid}>
            <button
              style={styles.actionBtn}
              onClick={() => canCall && (window.location.href = `tel:${phone}`)}
              disabled={!canCall}
            >
              📞 Call
            </button>

            <button
              style={styles.actionBtn}
              onClick={() =>
                canWhatsApp && openSafe(`https://wa.me/${phone}`)
              }
              disabled={!canWhatsApp}
            >
              💬 WhatsApp
            </button>

            <button
              style={styles.actionBtn}
              onClick={() =>
                canEmail && (window.location.href = `mailto:${email}`)
              }
              disabled={!canEmail}
            >
              📧 Email
            </button>

            <button
              style={styles.actionBtn}
              onClick={() => canLinkedIn && openSafe(linkedinUrl)}
              disabled={!canLinkedIn}
            >
              🔗 LinkedIn
            </button>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Lead Details</h3>

          <div style={styles.fieldGrid}>
            <label style={styles.label}>
              Business Name
              <input
                style={styles.input}
                value={form.businessName || ""}
                onChange={(e) => patchField("businessName", e.target.value)}
              />
            </label>

            <label style={styles.label}>
              Contact Name
              <input
                style={styles.input}
                value={form.contactName || ""}
                onChange={(e) => patchField("contactName", e.target.value)}
              />
            </label>

            <label style={styles.label}>
              Mobile / Contact Number
              <input
                style={styles.input}
                value={form.mobile || form.phone || ""}
                onChange={(e) => patchField("mobile", e.target.value)}
                placeholder="27712345678"
              />
            </label>

            <label style={styles.label}>
              LinkedIn URL
              <input
                style={styles.input}
                value={form.linkedinProfileUrl || form.linkedin || ""}
                onChange={(e) =>
                  patchField("linkedinProfileUrl", e.target.value)
                }
                placeholder="https://www.linkedin.com/in/..."
              />
            </label>

            <div style={styles.row2}>
              <label style={styles.label}>
                Stage
                <select
                  style={styles.input}
                  value={form.stage || stageOrder[0]}
                  onChange={(e) => {
                    patchField("stage", e.target.value);
                    onMoveLead(lead.id, e.target.value);
                  }}
                >
                  {stageOrder.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage}
                    </option>
                  ))}
                </select>
              </label>

              <label style={styles.label}>
                Status
                <select
                  style={styles.input}
                  value={form.status || "Warm"}
                  onChange={(e) => patchField("status", e.target.value)}
                >
                  <option value="Hot">Hot</option>
                  <option value="Warm">Warm</option>
                  <option value="Cold">Cold</option>
                </select>
              </label>
            </div>

            <div style={styles.row2}>
              <label style={styles.label}>
                Quote Amount
                <input
                  style={styles.input}
                  value={form.quoteAmount || ""}
                  onChange={(e) => patchField("quoteAmount", e.target.value)}
                  placeholder="e.g. 25000"
                />
              </label>

              <label style={styles.label}>
                Quote Status
                <select
                  style={styles.input}
                  value={form.quoteStatus || "Not Sent"}
                  onChange={(e) => patchField("quoteStatus", e.target.value)}
                >
                  <option value="Not Sent">Not Sent</option>
                  <option value="Sent">Sent</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </label>
            </div>

            <label style={styles.label}>
              Follow-up Date
              <input
                type="date"
                style={styles.input}
                value={form.followUpDate || ""}
                onChange={(e) => patchField("followUpDate", e.target.value)}
              />
            </label>

            <label style={styles.label}>
              LinkedIn Role
              <input
                style={styles.input}
                value={form.linkedinRole || ""}
                onChange={(e) => patchField("linkedinRole", e.target.value)}
              />
            </label>

            <label style={styles.label}>
              LinkedIn Headline
              <input
                style={styles.input}
                value={form.linkedinHeadline || ""}
                onChange={(e) => patchField("linkedinHeadline", e.target.value)}
              />
            </label>

            <label style={styles.label}>
              LinkedIn Location
              <input
                style={styles.input}
                value={form.linkedinLocation || ""}
                onChange={(e) => patchField("linkedinLocation", e.target.value)}
              />
            </label>

            <label style={styles.label}>
              LinkedIn Company
              <input
                style={styles.input}
                value={form.linkedinCompany || ""}
                onChange={(e) => patchField("linkedinCompany", e.target.value)}
              />
            </label>

            <label style={styles.label}>
              LinkedIn Keywords
              <input
                style={styles.input}
                value={form.linkedinKeywords || ""}
                onChange={(e) => patchField("linkedinKeywords", e.target.value)}
              />
            </label>

            <label style={styles.label}>
              Category
              <input
                style={styles.input}
                value={form.category || ""}
                onChange={(e) => patchField("category", e.target.value)}
              />
            </label>

            <label style={styles.label}>
              Working Notes
              <textarea
                style={styles.textarea}
                value={form.notes || ""}
                onChange={(e) => patchField("notes", e.target.value)}
                placeholder="General lead notes..."
              />
            </label>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Notes History</h3>

          <div style={styles.noteInputWrap}>
            <textarea
              style={styles.textarea}
              placeholder="Add call notes, follow-up notes, outreach history..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            />
            <button
              style={styles.primaryBtn}
              onClick={() => {
                onAddNote(lead.id, noteText);
                setNoteText("");
              }}
            >
              + Add Note
            </button>
          </div>

          <div style={styles.noteList}>
            {notesHistory.length === 0 ? (
              <div style={styles.noteItem}>
                <p style={styles.noteText}>No notes added yet.</p>
              </div>
            ) : (
              notesHistory
                .slice()
                .reverse()
                .map((note, index) => (
                  <div key={`${note.createdAt || index}-${index}`} style={styles.noteItem}>
                    <p style={styles.noteDate}>{formatNoteDate(note.createdAt)}</p>
                    <p style={styles.noteText}>{note.text}</p>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}