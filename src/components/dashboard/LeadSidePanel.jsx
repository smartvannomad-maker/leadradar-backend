import { useEffect, useState } from "react";

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
};

function normalizePhone(phone = "") {
  return phone.replace(/[^\d]/g, "");
}

function openSafe(url) {
  window.open(url, "_blank", "noopener,noreferrer");
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

  const phone = normalizePhone(form.phone);
  const canCall = !!phone;
  const canWhatsApp = !!phone;
  const canEmail = !!form.email;
  const canLinkedIn = !!form.linkedin;

  return (
    <div style={styles.panel}>
      <div style={styles.hero}>
        <h2 style={styles.heroTitle}>{form.contactName || "Unnamed Contact"}</h2>
        <p style={styles.heroSubtitle}>
          {form.businessName || "No business name"} · {form.stage}
        </p>
      </div>

      <div style={styles.inner}>
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
                canEmail && (window.location.href = `mailto:${form.email}`)
              }
              disabled={!canEmail}
            >
              📧 Email
            </button>

            <button
              style={styles.actionBtn}
              onClick={() => canLinkedIn && openSafe(form.linkedin)}
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
              Email
              <input
                style={styles.input}
                value={form.email || ""}
                onChange={(e) => patchField("email", e.target.value)}
              />
            </label>

            <label style={styles.label}>
              Contact Number
              <input
                style={styles.input}
                value={form.phone || ""}
                onChange={(e) => patchField("phone", e.target.value)}
                placeholder="27712345678"
              />
            </label>

            <label style={styles.label}>
              LinkedIn URL
              <input
                style={styles.input}
                value={form.linkedin || ""}
                onChange={(e) => patchField("linkedin", e.target.value)}
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

            <label style={styles.label}>
              Source
              <input
                style={styles.input}
                value={form.source || ""}
                onChange={(e) => patchField("source", e.target.value)}
              />
            </label>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Notes</h3>

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
            {(form.notes || []).length === 0 ? (
              <div style={styles.noteItem}>
                <p style={styles.noteText}>No notes added yet.</p>
              </div>
            ) : (
              form.notes.map((note) => (
                <div key={note.id} style={styles.noteItem}>
                  <p style={styles.noteDate}>{note.createdAt}</p>
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