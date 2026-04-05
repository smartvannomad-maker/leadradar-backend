import { useEffect, useMemo, useState } from "react";

function normalizePhone(phone = "") {
  return String(phone).replace(/[^\d]/g, "");
}

function openSafe(url) {
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
}

function fillVars(text = "", lead = {}) {
  return String(text)
    .replace(/{{name}}/g, lead.contactName || "")
    .replace(/{{company}}/g, lead.businessName || "");
}

const DEFAULT_WHATSAPP_TEMPLATES = [
  {
    id: 1,
    name: "Intro",
    text: "Hi {{name}}, I came across {{company}} and would love to connect.",
  },
  {
    id: 2,
    name: "Follow Up",
    text: "Hi {{name}}, just following up on my previous message regarding {{company}}.",
  },
  {
    id: 3,
    name: "Offer",
    text: "Hi {{name}}, I help businesses like {{company}} generate more leads. Keen to chat?",
  },
];

const DEFAULT_EMAIL_TEMPLATES = [
  {
    id: 1,
    name: "Intro",
    subject: "Hello from {{company}}",
    body: "Hi {{name}},\n\nI came across {{company}} and wanted to reach out to introduce myself. Let's connect!",
  },
  {
    id: 2,
    name: "Follow Up",
    subject: "Following up on our last conversation",
    body: "Hi {{name}},\n\nJust following up on our previous discussion about {{company}}. Let me know if you're still interested!",
  },
  {
    id: 3,
    name: "Offer",
    subject: "Help your business grow with {{company}}",
    body: "Hi {{name}},\n\nI noticed {{company}} could benefit from our service. I'd love to discuss how we can help you generate more leads.",
  },
];

const styles = {
  panel: {
    position: "sticky",
    top: "24px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.88)",
    backdropFilter: "blur(18px)",
    border: "1px solid rgba(148,163,184,0.18)",
    boxShadow: "0 18px 50px rgba(15,23,42,0.08)",
    minHeight: "680px",
    overflow: "hidden",
  },
  empty: {
    padding: "28px",
    color: "#64748b",
    fontSize: "14px",
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
    opacity: 0.92,
    fontSize: "14px",
  },
  body: {
    padding: "22px",
    display: "grid",
    gap: "18px",
  },
  section: {
    display: "grid",
    gap: "12px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#64748b",
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
  fieldGrid: {
    display: "grid",
    gap: "12px",
  },
  row2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
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
    minHeight: "96px",
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
  secondaryBtn: {
    border: "1px solid rgba(148,163,184,0.2)",
    background: "#fff",
    color: "#0f172a",
    borderRadius: "14px",
    padding: "12px 14px",
    fontWeight: 700,
    cursor: "pointer",
  },
  notesList: {
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
  previewBox: {
    background: "#f8fafc",
    border: "1px solid rgba(148,163,184,0.18)",
    borderRadius: "14px",
    padding: "12px",
    fontSize: "13px",
    color: "#475569",
    lineHeight: 1.5,
    whiteSpace: "pre-wrap",
  },
  actionsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
};

export default function LeadSidePanel({
  lead,
  stageOrder,
  onUpdateLead,
  onMoveLead,
  onAddNote,
}) {
  const [form, setForm] = useState(null);
  const [noteText, setNoteText] = useState("");

  const [whatsappTemplates, setWhatsappTemplates] = useState(
    DEFAULT_WHATSAPP_TEMPLATES
  );
  const [emailTemplates, setEmailTemplates] = useState(
    DEFAULT_EMAIL_TEMPLATES
  );

  const [selectedWhatsappTemplateId, setSelectedWhatsappTemplateId] = useState(1);
  const [selectedEmailTemplateId, setSelectedEmailTemplateId] = useState(1);

  const [whatsappEditor, setWhatsappEditor] = useState("");
  const [emailSubjectEditor, setEmailSubjectEditor] = useState("");
  const [emailBodyEditor, setEmailBodyEditor] = useState("");

  const [savingWhatsapp, setSavingWhatsapp] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);

  useEffect(() => {
    setForm(lead ? { ...lead } : null);
    setNoteText("");
  }, [lead]);

  useEffect(() => {
    let ignore = false;

    async function loadTemplates() {
      try {
        const res = await fetch("/api/templates");
        if (!res.ok) throw new Error("Failed to load templates");
        const data = await res.json();

        if (ignore) return;

        const wa =
          Array.isArray(data.whatsapp) && data.whatsapp.length
            ? data.whatsapp
            : DEFAULT_WHATSAPP_TEMPLATES;

        const em =
          Array.isArray(data.email) && data.email.length
            ? data.email
            : DEFAULT_EMAIL_TEMPLATES;

        setWhatsappTemplates(wa);
        setEmailTemplates(em);
      } catch (error) {
        console.error("Template load failed:", error);
        setWhatsappTemplates(DEFAULT_WHATSAPP_TEMPLATES);
        setEmailTemplates(DEFAULT_EMAIL_TEMPLATES);
      }
    }

    loadTemplates();
    return () => {
      ignore = true;
    };
  }, []);

  const selectedWhatsappTemplate =
    whatsappTemplates.find(
      (t) => Number(t.id) === Number(selectedWhatsappTemplateId)
    ) || whatsappTemplates[0];

  const selectedEmailTemplate =
    emailTemplates.find((t) => Number(t.id) === Number(selectedEmailTemplateId)) ||
    emailTemplates[0];

  useEffect(() => {
    if (selectedWhatsappTemplate) {
      setWhatsappEditor(selectedWhatsappTemplate.text || "");
    }
  }, [selectedWhatsappTemplate]);

  useEffect(() => {
    if (selectedEmailTemplate) {
      setEmailSubjectEditor(selectedEmailTemplate.subject || "");
      setEmailBodyEditor(selectedEmailTemplate.body || "");
    }
  }, [selectedEmailTemplate]);

  // Hooks must stay above early return
  const whatsappPreview = useMemo(() => {
    return fillVars(whatsappEditor, form || {});
  }, [whatsappEditor, form]);

  const emailPreview = useMemo(() => {
    return {
      subject: fillVars(emailSubjectEditor, form || {}),
      body: fillVars(emailBodyEditor, form || {}),
    };
  }, [emailSubjectEditor, emailBodyEditor, form]);

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

  const handleWhatsApp = () => {
    if (!phone) return;
    const encoded = encodeURIComponent(whatsappPreview);
    window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
  };

  const handleEmail = () => {
    if (!form.email) return;
    const encodedSubject = encodeURIComponent(emailPreview.subject);
    const encodedBody = encodeURIComponent(emailPreview.body);
    window.location.href = `mailto:${form.email}?subject=${encodedSubject}&body=${encodedBody}`;
  };

  const saveWhatsappTemplate = async () => {
    if (!selectedWhatsappTemplate) return;
    try {
      setSavingWhatsapp(true);

      const payload = {
        channel: "whatsapp",
        id: selectedWhatsappTemplate.id,
        name: selectedWhatsappTemplate.name,
        text: whatsappEditor,
      };

      const res = await fetch(
        `/api/templates/whatsapp/${selectedWhatsappTemplate.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("Could not save WhatsApp template");

      const updated = await res.json();

      setWhatsappTemplates((prev) =>
        prev.map((item) =>
          Number(item.id) === Number(updated.id) ? updated : item
        )
      );
    } catch (error) {
      console.error(error);
      alert(error.message || "Could not save WhatsApp template.");
    } finally {
      setSavingWhatsapp(false);
    }
  };

  const saveEmailTemplate = async () => {
    if (!selectedEmailTemplate) return;
    try {
      setSavingEmail(true);

      const payload = {
        channel: "email",
        id: selectedEmailTemplate.id,
        name: selectedEmailTemplate.name,
        subject: emailSubjectEditor,
        body: emailBodyEditor,
      };

      const res = await fetch(`/api/templates/email/${selectedEmailTemplate.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Could not save Email template");

      const updated = await res.json();

      setEmailTemplates((prev) =>
        prev.map((item) =>
          Number(item.id) === Number(updated.id) ? updated : item
        )
      );
    } catch (error) {
      console.error(error);
      alert(error.message || "Could not save Email template.");
    } finally {
      setSavingEmail(false);
    }
  };

  return (
    <div style={styles.panel}>
      <div style={styles.hero}>
        <h2 style={styles.heroTitle}>{form.contactName || "Unnamed Contact"}</h2>
        <p style={styles.heroSubtitle}>
          {form.businessName || "No business name"} · {form.stage}
        </p>
      </div>

      <div style={styles.body}>
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
              onClick={handleEmail}
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

            <button
              style={styles.actionBtn}
              onClick={handleWhatsApp}
              disabled={!canWhatsApp}
            >
              💬 WhatsApp
            </button>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>WhatsApp Template</h3>

          <select
            style={styles.input}
            value={selectedWhatsappTemplateId}
            onChange={(e) => setSelectedWhatsappTemplateId(Number(e.target.value))}
          >
            {whatsappTemplates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>

          <textarea
            style={styles.textarea}
            value={whatsappEditor}
            onChange={(e) => setWhatsappEditor(e.target.value)}
            placeholder="Edit WhatsApp template"
          />

          <div style={styles.previewBox}>{whatsappPreview}</div>

          <div style={styles.actionsRow}>
            <button
              style={styles.primaryBtn}
              onClick={handleWhatsApp}
              disabled={!canWhatsApp}
            >
              Open WhatsApp
            </button>

            <button
              style={styles.secondaryBtn}
              onClick={saveWhatsappTemplate}
              disabled={savingWhatsapp}
            >
              {savingWhatsapp ? "Saving..." : "Save Template"}
            </button>
          </div>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Email Template</h3>

          <select
            style={styles.input}
            value={selectedEmailTemplateId}
            onChange={(e) => setSelectedEmailTemplateId(Number(e.target.value))}
          >
            {emailTemplates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>

          <label style={styles.label}>
            Subject
            <input
              style={styles.input}
              value={emailSubjectEditor}
              onChange={(e) => setEmailSubjectEditor(e.target.value)}
            />
          </label>

          <label style={styles.label}>
            Body
            <textarea
              style={styles.textarea}
              value={emailBodyEditor}
              onChange={(e) => setEmailBodyEditor(e.target.value)}
            />
          </label>

          <div style={styles.previewBox}>
            <strong>Subject:</strong> {emailPreview.subject}
            {"\n\n"}
            <strong>Body:</strong>
            {"\n"}
            {emailPreview.body}
          </div>

          <div style={styles.actionsRow}>
            <button
              style={styles.primaryBtn}
              onClick={handleEmail}
              disabled={!canEmail}
            >
              Open Email
            </button>

            <button
              style={styles.secondaryBtn}
              onClick={saveEmailTemplate}
              disabled={savingEmail}
            >
              {savingEmail ? "Saving..." : "Save Template"}
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

          <textarea
            style={styles.textarea}
            placeholder="Add follow-up notes, call results, outreach history..."
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

          <div style={styles.notesList}>
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