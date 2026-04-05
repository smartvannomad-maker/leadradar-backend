import React from "react";

const STAGE_OPTIONS = [
  "new",
  "contacted",
  "qualified",
  "proposal",
  "negotiation",
  "won",
  "lost",
];

const STATUS_OPTIONS = [
  "new",
  "active",
  "contacted",
  "qualified",
  "proposal_sent",
  "negotiation",
  "won",
  "lost",
];

const QUOTE_STATUS_OPTIONS = [
  "not_sent",
  "sent",
  "viewed",
  "accepted",
  "declined",
];

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "activity", label: "Activity" },
  { key: "outreach", label: "Outreach" },
  { key: "notes", label: "Notes" },
];

function toTitleCase(value = "") {
  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatMoney(value) {
  if (value === null || value === undefined || value === "") return "No quote value";

  const numeric = Number(String(value).replace(/[^\d.-]/g, ""));
  if (Number.isNaN(numeric)) return String(value);

  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(numeric);
}

function formatDate(value) {
  if (!value) return "Not set";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateTime(value) {
  if (!value) return "No date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getInitials(name = "") {
  const cleaned = String(name).trim();
  if (!cleaned) return "LD";

  return cleaned
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getStageTone(stage) {
  const tones = {
    new: {
      bg: "rgba(59, 130, 246, 0.10)",
      text: "#1d4ed8",
    },
    contacted: {
      bg: "rgba(14, 165, 233, 0.10)",
      text: "#0369a1",
    },
    qualified: {
      bg: "rgba(139, 92, 246, 0.10)",
      text: "#6d28d9",
    },
    proposal: {
      bg: "rgba(245, 158, 11, 0.10)",
      text: "#b45309",
    },
    negotiation: {
      bg: "rgba(249, 115, 22, 0.10)",
      text: "#c2410c",
    },
    won: {
      bg: "rgba(16, 185, 129, 0.10)",
      text: "#047857",
    },
    lost: {
      bg: "rgba(239, 68, 68, 0.10)",
      text: "#b91c1c",
    },
  };

  return tones[String(stage || "new").toLowerCase()] || tones.new;
}

const labelStyle = {
  display: "block",
  marginBottom: 8,
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#94a3b8",
};

const inputStyle = {
  width: "100%",
  borderRadius: 16,
  border: "1px solid rgba(148, 163, 184, 0.18)",
  background: "linear-gradient(180deg, #ffffff 0%, rgba(248,250,252,0.96) 100%)",
  boxShadow: "inset 0 1px 2px rgba(15, 23, 42, 0.04)",
  padding: "13px 14px",
  fontSize: 14,
  fontWeight: 600,
  color: "#0f172a",
  outline: "none",
};

const textareaStyle = {
  ...inputStyle,
  minHeight: 120,
  resize: "vertical",
  lineHeight: 1.6,
};

function Field({ label, children }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function StatCard({ label, value, tone = "blue" }) {
  const tones = {
    blue: {
      bg: "rgba(37, 99, 235, 0.08)",
      color: "#1d4ed8",
    },
    green: {
      bg: "rgba(16, 185, 129, 0.10)",
      color: "#047857",
    },
    slate: {
      bg: "rgba(148, 163, 184, 0.10)",
      color: "#475569",
    },
  };

  const theme = tones[tone] || tones.blue;

  return (
    <div
      style={{
        borderRadius: 20,
        padding: 16,
        border: "1px solid rgba(148, 163, 184, 0.14)",
        background: "rgba(255,255,255,0.78)",
        boxShadow: "0 12px 30px rgba(15, 23, 42, 0.05)",
      }}
    >
      <div style={labelStyle}>{label}</div>
      <div
        style={{
          fontSize: 16,
          fontWeight: 900,
          color: "#0f172a",
          lineHeight: 1.4,
          marginBottom: 8,
        }}
      >
        {value}
      </div>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "6px 10px",
          borderRadius: 999,
          background: theme.bg,
          color: theme.color,
          fontSize: 12,
          fontWeight: 800,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function EmptyPanel({ title, text }) {
  return (
    <div
      style={{
        borderRadius: 24,
        border: "1px dashed rgba(148, 163, 184, 0.22)",
        background: "rgba(255,255,255,0.72)",
        padding: 24,
        textAlign: "center",
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: "1.05rem",
          fontWeight: 900,
          color: "#0f172a",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          margin: "10px auto 0",
          maxWidth: 480,
          fontSize: 14,
          lineHeight: 1.7,
          color: "#64748b",
        }}
      >
        {text}
      </p>
    </div>
  );
}

function getEventTone(type) {
  if (type === "stage") {
    return {
      bg: "rgba(37, 99, 235, 0.10)",
      color: "#1d4ed8",
    };
  }

  if (type === "status") {
    return {
      bg: "rgba(14, 165, 233, 0.10)",
      color: "#0369a1",
    };
  }

  if (type === "quoteStatus") {
    return {
      bg: "rgba(16, 185, 129, 0.10)",
      color: "#047857",
    };
  }

  if (type === "followUpDate") {
    return {
      bg: "rgba(245, 158, 11, 0.10)",
      color: "#b45309",
    };
  }

  if (type === "quoteAmount") {
    return {
      bg: "rgba(249, 115, 22, 0.10)",
      color: "#c2410c",
    };
  }

  if (type === "note_added" || type === "notes") {
    return {
      bg: "rgba(139, 92, 246, 0.10)",
      color: "#6d28d9",
    };
  }

  return {
    bg: "rgba(148, 163, 184, 0.10)",
    color: "#475569",
  };
}

export default function DealDetailDrawer({
  open,
  lead,
  onClose,
  onFieldUpdate,
}) {
  const [activeTab, setActiveTab] = React.useState("overview");

  React.useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  React.useEffect(() => {
    if (open) {
      setActiveTab("overview");
    }
  }, [open, lead?.id]);

  if (!open || !lead) return null;

  const displayName =
    lead.businessName || lead.contactName || lead.linkedinCompany || "Untitled Lead";

  const stageTone = getStageTone(lead.stage);

  const contactSubtitle = [
    lead.contactName || null,
    lead.linkedinRole || null,
    lead.linkedinCompany || null,
  ]
    .filter(Boolean)
    .join(" • ");

  const activityItems = Array.isArray(lead.activityHistory)
    ? [...lead.activityHistory].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];

  const renderOverviewTab = () => (
    <div style={{ display: "grid", gap: 18 }}>
      <section
        style={{
          borderRadius: 26,
          border: "1px solid rgba(148, 163, 184, 0.14)",
          background: "rgba(255,255,255,0.86)",
          boxShadow:
            "0 18px 42px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255,255,255,0.78)",
          padding: 20,
          display: "grid",
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 12px",
              borderRadius: 999,
              background: "rgba(37, 99, 235, 0.08)",
              color: "#1d4ed8",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Core details
          </div>

          <h3
            style={{
              margin: 0,
              fontSize: "1.2rem",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: "#0f172a",
            }}
          >
            Lead information
          </h3>
        </div>

        <div
          className="lr-drawer-grid-2"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 14,
          }}
        >
          <Field label="Business Name">
            <input
              style={inputStyle}
              value={lead.businessName || ""}
              onChange={(e) =>
                onFieldUpdate?.(lead.id, "businessName", e.target.value)
              }
            />
          </Field>

          <Field label="Contact Name">
            <input
              style={inputStyle}
              value={lead.contactName || ""}
              onChange={(e) =>
                onFieldUpdate?.(lead.id, "contactName", e.target.value)
              }
            />
          </Field>

          <Field label="Mobile / WhatsApp">
            <input
              style={inputStyle}
              value={lead.mobile || ""}
              onChange={(e) =>
                onFieldUpdate?.(lead.id, "mobile", e.target.value)
              }
            />
          </Field>

          <Field label="Category">
            <input
              style={inputStyle}
              value={lead.category || ""}
              onChange={(e) =>
                onFieldUpdate?.(lead.id, "category", e.target.value)
              }
            />
          </Field>
        </div>
      </section>

      <section
        style={{
          borderRadius: 26,
          border: "1px solid rgba(148, 163, 184, 0.14)",
          background: "rgba(255,255,255,0.86)",
          boxShadow:
            "0 18px 42px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255,255,255,0.78)",
          padding: 20,
          display: "grid",
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 12px",
              borderRadius: 999,
              background: "rgba(14, 165, 233, 0.08)",
              color: "#0369a1",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Pipeline
          </div>

          <h3
            style={{
              margin: 0,
              fontSize: "1.2rem",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: "#0f172a",
            }}
          >
            Deal movement
          </h3>
        </div>

        <div
          className="lr-drawer-grid-2"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 14,
          }}
        >
          <Field label="Stage">
            <select
              style={inputStyle}
              value={lead.stage || "new"}
              onChange={(e) =>
                onFieldUpdate?.(lead.id, "stage", e.target.value)
              }
            >
              {STAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {toTitleCase(option)}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Status">
            <select
              style={inputStyle}
              value={lead.status || "active"}
              onChange={(e) =>
                onFieldUpdate?.(lead.id, "status", e.target.value)
              }
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {toTitleCase(option)}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Quote Amount">
            <input
              style={inputStyle}
              value={lead.quoteAmount || ""}
              onChange={(e) =>
                onFieldUpdate?.(lead.id, "quoteAmount", e.target.value)
              }
            />
          </Field>

          <Field label="Quote Status">
            <select
              style={inputStyle}
              value={lead.quoteStatus || "not_sent"}
              onChange={(e) =>
                onFieldUpdate?.(lead.id, "quoteStatus", e.target.value)
              }
            >
              {QUOTE_STATUS_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {toTitleCase(option)}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Follow-up Date">
            <input
              type="date"
              style={inputStyle}
              value={lead.followUpDate || ""}
              onChange={(e) =>
                onFieldUpdate?.(lead.id, "followUpDate", e.target.value)
              }
            />
          </Field>

          <Field label="LinkedIn Role">
            <input
              style={inputStyle}
              value={lead.linkedinRole || ""}
              onChange={(e) =>
                onFieldUpdate?.(lead.id, "linkedinRole", e.target.value)
              }
            />
          </Field>
        </div>
      </section>
    </div>
  );

  const renderActivityTab = () => (
    <div style={{ display: "grid", gap: 18 }}>
      <section
        style={{
          borderRadius: 26,
          border: "1px solid rgba(148, 163, 184, 0.14)",
          background: "rgba(255,255,255,0.86)",
          boxShadow:
            "0 18px 42px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255,255,255,0.78)",
          padding: 20,
          display: "grid",
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 12px",
              borderRadius: 999,
              background: "rgba(245, 158, 11, 0.10)",
              color: "#b45309",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Activity
          </div>

          <h3
            style={{
              margin: 0,
              fontSize: "1.2rem",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: "#0f172a",
            }}
          >
            Deal timeline
          </h3>

          <p
            style={{
              margin: "8px 0 0",
              fontSize: 14,
              lineHeight: 1.7,
              color: "#64748b",
            }}
          >
            A running history of important changes and actions for this deal.
          </p>
        </div>

        {activityItems.length > 0 ? (
          <div style={{ display: "grid", gap: 12 }}>
            {activityItems.map((item) => {
              const tone = getEventTone(item.type);

              return (
                <div
                  key={item.id || `${item.type}_${item.createdAt}`}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "flex-start",
                    padding: 14,
                    borderRadius: 18,
                    background: "rgba(255,255,255,0.9)",
                    border: "1px solid rgba(148, 163, 184, 0.12)",
                    boxShadow: "0 8px 20px rgba(15, 23, 42, 0.04)",
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: tone.color,
                      boxShadow: `0 0 0 6px ${tone.bg}`,
                      marginTop: 6,
                      flexShrink: 0,
                    }}
                  />

                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                        flexWrap: "wrap",
                        marginBottom: 6,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 800,
                          color: "#0f172a",
                        }}
                      >
                        {item.title || "Activity event"}
                      </div>

                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#64748b",
                        }}
                      >
                        {formatDateTime(item.createdAt)}
                      </div>
                    </div>

                    <div
                      style={{
                        fontSize: 14,
                        lineHeight: 1.7,
                        color: "#475569",
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {item.text || "No details"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyPanel
            title="No activity events yet"
            text="Once you update stages, statuses, quote details, follow-up dates or notes, they’ll appear here as a live CRM timeline."
          />
        )}
      </section>
    </div>
  );

  const renderOutreachTab = () => (
    <div style={{ display: "grid", gap: 18 }}>
      <section
        style={{
          borderRadius: 26,
          border: "1px solid rgba(148, 163, 184, 0.14)",
          background: "rgba(255,255,255,0.86)",
          boxShadow:
            "0 18px 42px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255,255,255,0.78)",
          padding: 20,
          display: "grid",
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 12px",
              borderRadius: 999,
              background: "rgba(139, 92, 246, 0.08)",
              color: "#6d28d9",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Outreach
          </div>

          <h3
            style={{
              margin: 0,
              fontSize: "1.2rem",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: "#0f172a",
            }}
          >
            Prospect profile
          </h3>

          <p
            style={{
              margin: "8px 0 0",
              fontSize: 14,
              lineHeight: 1.7,
              color: "#64748b",
            }}
          >
            Use this tab for LinkedIn context, prospect research and quick contact actions.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          {lead.mobile ? (
            <a
              href={`https://wa.me/${String(lead.mobile).replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
              style={actionPrimaryStyle}
            >
              WhatsApp
            </a>
          ) : null}

          {lead.linkedinProfileUrl ? (
            <a
              href={lead.linkedinProfileUrl}
              target="_blank"
              rel="noreferrer"
              style={actionSecondaryStyle}
            >
              Open LinkedIn
            </a>
          ) : null}
        </div>

        <div
          className="lr-drawer-grid-2"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: 14,
          }}
        >
          <Field label="LinkedIn Company">
            <input
              style={inputStyle}
              value={lead.linkedinCompany || ""}
              onChange={(e) =>
                onFieldUpdate?.(lead.id, "linkedinCompany", e.target.value)
              }
            />
          </Field>

          <Field label="LinkedIn Location">
            <input
              style={inputStyle}
              value={lead.linkedinLocation || ""}
              onChange={(e) =>
                onFieldUpdate?.(lead.id, "linkedinLocation", e.target.value)
              }
            />
          </Field>

          <Field label="LinkedIn Headline">
            <input
              style={inputStyle}
              value={lead.linkedinHeadline || ""}
              onChange={(e) =>
                onFieldUpdate?.(lead.id, "linkedinHeadline", e.target.value)
              }
            />
          </Field>

          <Field label="LinkedIn Keywords">
            <input
              style={inputStyle}
              value={lead.linkedinKeywords || ""}
              onChange={(e) =>
                onFieldUpdate?.(lead.id, "linkedinKeywords", e.target.value)
              }
            />
          </Field>
        </div>

        <Field label="LinkedIn Profile URL">
          <input
            style={inputStyle}
            value={lead.linkedinProfileUrl || ""}
            onChange={(e) =>
              onFieldUpdate?.(lead.id, "linkedinProfileUrl", e.target.value)
            }
          />
        </Field>
      </section>
    </div>
  );

  const renderNotesTab = () => (
    <div style={{ display: "grid", gap: 18 }}>
      <section
        style={{
          borderRadius: 26,
          border: "1px solid rgba(148, 163, 184, 0.14)",
          background: "rgba(255,255,255,0.86)",
          boxShadow:
            "0 18px 42px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255,255,255,0.78)",
          padding: 20,
          display: "grid",
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 12px",
              borderRadius: 999,
              background: "rgba(16, 185, 129, 0.08)",
              color: "#047857",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 12,
            }}
          >
            Notes
          </div>

          <h3
            style={{
              margin: 0,
              fontSize: "1.2rem",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: "#0f172a",
            }}
          >
            Working notes & history
          </h3>
        </div>

        <Field label="Latest Notes">
          <textarea
            style={textareaStyle}
            value={lead.notes || ""}
            onChange={(e) =>
              onFieldUpdate?.(lead.id, "notes", e.target.value)
            }
          />
        </Field>

        <div
          style={{
            borderRadius: 22,
            padding: 16,
            border: "1px solid rgba(148, 163, 184, 0.14)",
            background: "rgba(248,250,252,0.85)",
            display: "grid",
            gap: 12,
          }}
        >
          <div style={labelStyle}>Notes History</div>

          {lead.notesHistory && lead.notesHistory.length > 0 ? (
            [...lead.notesHistory]
              .slice()
              .reverse()
              .map((entry, index) => (
                <div
                  key={index}
                  style={{
                    padding: 14,
                    borderRadius: 18,
                    border: "1px solid rgba(148, 163, 184, 0.12)",
                    background: "rgba(255,255,255,0.9)",
                    boxShadow: "0 8px 20px rgba(15, 23, 42, 0.04)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: "#64748b",
                      marginBottom: 8,
                    }}
                  >
                    {formatDateTime(entry.createdAt)}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      lineHeight: 1.7,
                      color: "#334155",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {entry.text}
                  </div>
                </div>
              ))
          ) : (
            <div
              style={{
                padding: 18,
                borderRadius: 18,
                border: "1px dashed rgba(148, 163, 184, 0.22)",
                background: "rgba(255,255,255,0.72)",
                fontSize: 14,
                color: "#64748b",
              }}
            >
              No note history yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.42)",
          backdropFilter: "blur(8px)",
          zIndex: 4000,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <aside
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "min(820px, 100vw)",
            height: "100vh",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.96) 100%)",
            boxShadow: "-30px 0 80px rgba(15, 23, 42, 0.22)",
            borderLeft: "1px solid rgba(148, 163, 184, 0.14)",
            overflowY: "auto",
            position: "relative",
            animation: "lrDrawerIn 220ms ease",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -100,
              right: -80,
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: "rgba(37, 99, 235, 0.10)",
              filter: "blur(14px)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -120,
              left: -60,
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: "rgba(14, 165, 233, 0.08)",
              filter: "blur(16px)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              padding: 24,
              display: "grid",
              gap: 22,
            }}
          >
            <div
              style={{
                position: "sticky",
                top: -1,
                zIndex: 10,
                margin: "-24px -24px 0",
                padding: "24px 24px 18px",
                backdropFilter: "blur(12px)",
                background: "rgba(248,250,252,0.82)",
                borderBottom: "1px solid rgba(148, 163, 184, 0.10)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 14,
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 20,
                      background:
                        "linear-gradient(135deg, rgba(37,99,235,0.16) 0%, rgba(14,165,233,0.14) 100%)",
                      border: "1px solid rgba(148,163,184,0.14)",
                      boxShadow: "0 16px 36px rgba(37, 99, 235, 0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                      fontSize: 16,
                      color: "#0f172a",
                      flexShrink: 0,
                    }}
                  >
                    {getInitials(displayName)}
                  </div>

                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "8px 12px",
                        borderRadius: 999,
                        background: stageTone.bg,
                        color: stageTone.text,
                        fontSize: 12,
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        marginBottom: 12,
                      }}
                    >
                      {toTitleCase(lead.stage || "new")}
                    </div>

                    <h2
                      style={{
                        margin: 0,
                        fontSize: "1.8rem",
                        lineHeight: 1.05,
                        fontWeight: 900,
                        letterSpacing: "-0.04em",
                        color: "#0f172a",
                        wordBreak: "break-word",
                      }}
                    >
                      {displayName}
                    </h2>

                    <p
                      style={{
                        margin: "10px 0 0",
                        fontSize: 14,
                        lineHeight: 1.7,
                        color: "#64748b",
                        wordBreak: "break-word",
                      }}
                    >
                      {contactSubtitle || "No contact context yet"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 14,
                    border: "1px solid rgba(148, 163, 184, 0.18)",
                    background: "rgba(255,255,255,0.85)",
                    color: "#475569",
                    fontSize: 18,
                    fontWeight: 900,
                    cursor: "pointer",
                    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
                    flexShrink: 0,
                  }}
                >
                  ×
                </button>
              </div>

              <div
                style={{
                  marginTop: 16,
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                {TABS.map((tab) => {
                  const active = activeTab === tab.key;

                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setActiveTab(tab.key)}
                      style={{
                        border: active
                          ? "1px solid rgba(37, 99, 235, 0.18)"
                          : "1px solid rgba(148, 163, 184, 0.14)",
                        background: active
                          ? "rgba(37, 99, 235, 0.08)"
                          : "rgba(255,255,255,0.86)",
                        color: active ? "#1d4ed8" : "#475569",
                        borderRadius: 16,
                        padding: "11px 14px",
                        fontSize: 13,
                        fontWeight: 800,
                        cursor: "pointer",
                        boxShadow: active
                          ? "0 10px 24px rgba(37, 99, 235, 0.08)"
                          : "0 8px 18px rgba(15, 23, 42, 0.04)",
                      }}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              className="lr-drawer-stats"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 12,
              }}
            >
              <StatCard
                label="Quote Value"
                value={formatMoney(lead.quoteAmount)}
                tone="blue"
              />
              <StatCard
                label="Follow-up"
                value={formatDate(lead.followUpDate)}
                tone="green"
              />
              <StatCard
                label="Quote Status"
                value={toTitleCase(lead.quoteStatus || "not_sent")}
                tone="slate"
              />
            </div>

            {activeTab === "overview" && renderOverviewTab()}
            {activeTab === "activity" && renderActivityTab()}
            {activeTab === "outreach" && renderOutreachTab()}
            {activeTab === "notes" && renderNotesTab()}
          </div>
        </aside>
      </div>

      <style>{`
        @keyframes lrDrawerIn {
          from {
            transform: translateX(100%);
            opacity: 0.96;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @media (max-width: 980px) {
          .lr-drawer-stats {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 900px) {
          .lr-drawer-grid-2 {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}

const actionPrimaryStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "11px 14px",
  borderRadius: 16,
  background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
  color: "#fff",
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 800,
  boxShadow: "0 14px 30px rgba(34, 197, 94, 0.20)",
};

const actionSecondaryStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "11px 14px",
  borderRadius: 16,
  background: "rgba(37, 99, 235, 0.08)",
  color: "#1d4ed8",
  textDecoration: "none",
  fontSize: 13,
  fontWeight: 800,
  border: "1px solid rgba(37, 99, 235, 0.14)",
};