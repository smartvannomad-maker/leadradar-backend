import { styles } from "../../styles/dashboardStyles";

export default function LinkedInTemplateModal({
  lead,
  selectedTemplate,
  draftValue,
  onChangeTemplate,
  onDraftChange,
  onCopy,
  copied,
  onClose,
}) {
  if (!lead) return null;

  return (
    <div
      style={{
        ...styles.modalOverlay,
        padding: 20,
        backdropFilter: "blur(10px)",
        background: "rgba(15, 23, 42, 0.42)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          ...styles.modalCard,
          width: "100%",
          maxWidth: 760,
          borderRadius: 30,
          border: "1px solid rgba(255,255,255,0.22)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.97) 0%, rgba(248,250,252,0.95) 100%)",
          boxShadow:
            "0 32px 80px rgba(15, 23, 42, 0.22), inset 0 1px 0 rgba(255,255,255,0.75)",
          padding: 28,
          position: "relative",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            position: "absolute",
            top: -90,
            right: -60,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "rgba(37, 99, 235, 0.10)",
            filter: "blur(8px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: -40,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "rgba(14, 165, 233, 0.08)",
            filter: "blur(10px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 16,
              flexWrap: "wrap",
              marginBottom: 22,
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  borderRadius: 999,
                  background: "rgba(37, 99, 235, 0.08)",
                  color: "#1d4ed8",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                Outreach templates
              </div>

              <h3
                style={{
                  ...styles.modalTitle,
                  margin: 0,
                  fontSize: "1.55rem",
                  lineHeight: 1.1,
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  color: "#0f172a",
                }}
              >
                LinkedIn Headhunting Templates
              </h3>

              <p
                style={{
                  ...styles.modalSubTitle,
                  marginTop: 12,
                  fontSize: 15,
                  lineHeight: 1.75,
                  color: "#475569",
                }}
              >
                {lead.contactName || "No contact"} • {lead.linkedinRole || "No role"} •{" "}
                {lead.linkedinCompany || lead.businessName || "No company"}
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              style={{
                ...styles.closeModalButton,
                padding: "12px 16px",
                borderRadius: 16,
                border: "1px solid rgba(148, 163, 184, 0.22)",
                background: "rgba(255,255,255,0.8)",
                color: "#334155",
                fontWeight: 700,
                boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
              }}
            >
              Close
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gap: 18,
            }}
          >
            <div
              style={{
                borderRadius: 22,
                border: "1px solid rgba(148, 163, 184, 0.14)",
                background: "rgba(255,255,255,0.78)",
                boxShadow: "0 12px 28px rgba(15, 23, 42, 0.05)",
                padding: 18,
              }}
            >
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#64748b",
                  marginBottom: 10,
                }}
              >
                Template
              </label>

              <select
                style={{
                  ...styles.input,
                  borderRadius: 16,
                  border: "1px solid rgba(148, 163, 184, 0.18)",
                  background: "#fff",
                  boxShadow: "inset 0 1px 2px rgba(15, 23, 42, 0.04)",
                }}
                value={selectedTemplate}
                onChange={(e) => onChangeTemplate(e.target.value)}
              >
                <option value="linkedinConnect">Connect Message</option>
                <option value="linkedinOpportunity">Opportunity Message</option>
                <option value="linkedinFollowUp">Follow-up Message</option>
                <option value="linkedinCandidatePitch">Candidate Pitch</option>
              </select>
            </div>

            <div
              style={{
                borderRadius: 24,
                border: "1px solid rgba(148, 163, 184, 0.14)",
                background: "rgba(255,255,255,0.84)",
                boxShadow: "0 16px 34px rgba(15, 23, 42, 0.06)",
                padding: 18,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "#64748b",
                  marginBottom: 12,
                }}
              >
                Message preview
              </div>

              <textarea
                style={{
                  ...styles.modalTextarea,
                  minHeight: 260,
                  borderRadius: 20,
                  border: "1px solid rgba(148, 163, 184, 0.18)",
                  background:
                    "linear-gradient(180deg, #ffffff 0%, rgba(248,250,252,0.95) 100%)",
                  boxShadow: "inset 0 1px 2px rgba(15, 23, 42, 0.05)",
                  resize: "vertical",
                  color: "#0f172a",
                }}
                placeholder="LinkedIn message preview"
                value={draftValue}
                onChange={(e) => onDraftChange(e.target.value)}
              />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 14,
                flexWrap: "wrap",
              }}
            >
              <div>
                {copied ? (
                  <p
                    style={{
                      ...styles.copiedText,
                      margin: 0,
                      color: "#047857",
                      fontWeight: 700,
                    }}
                  >
                    LinkedIn message copied
                  </p>
                ) : (
                  <p
                    style={{
                      margin: 0,
                      fontSize: 14,
                      color: "#64748b",
                    }}
                  >
                    Edit the draft before copying to match the exact context.
                  </p>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                }}
              >
                {lead.linkedinProfileUrl ? (
                  <a
                    href={lead.linkedinProfileUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      ...styles.linkedinButton,
                      borderRadius: 16,
                      padding: "12px 16px",
                      boxShadow: "0 14px 30px rgba(15, 23, 42, 0.08)",
                    }}
                  >
                    Open LinkedIn
                  </a>
                ) : null}

                <button
                  type="button"
                  onClick={onCopy}
                  style={{
                    ...styles.primaryButton,
                    borderRadius: 16,
                    padding: "12px 18px",
                    boxShadow: "0 16px 34px rgba(37, 99, 235, 0.20)",
                  }}
                >
                  Copy LinkedIn Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}