import { styles } from "../../styles/dashboardStyles";
import { normalizeWhatsappNumber } from "../../features/leads/leads.helpers";

function formatLabel(value = "") {
  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value) {
  if (!value) return "No date set";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-ZA", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getInitials(name = "") {
  const cleaned = String(name).trim();
  if (!cleaned) return "LD";

  const parts = cleaned.split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase()).join("") || "LD";
}

export default function FollowupsPanel({ todayFollowUps = [] }) {
  return (
    <div
      style={{
        display: "grid",
        gap: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
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
              marginBottom: 12,
            }}
          >
            Follow-up queue
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: "1.35rem",
              lineHeight: 1.1,
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: "#0f172a",
            }}
          >
            Today&apos;s Follow-ups
          </h2>

          <p
            style={{
              margin: "10px 0 0",
              fontSize: 14,
              lineHeight: 1.7,
              color: "#64748b",
              maxWidth: 720,
            }}
          >
            Review the leads that need attention today and take action quickly
            without losing context.
          </p>
        </div>

        <div
          style={{
            padding: "12px 16px",
            borderRadius: 18,
            background:
              todayFollowUps.length > 0
                ? "rgba(16, 185, 129, 0.10)"
                : "rgba(148, 163, 184, 0.10)",
            color: todayFollowUps.length > 0 ? "#047857" : "#475569",
            fontSize: 13,
            fontWeight: 800,
            whiteSpace: "nowrap",
          }}
        >
          {todayFollowUps.length} Due Today
        </div>
      </div>

      {todayFollowUps.length === 0 ? (
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 28,
            border: "1px solid rgba(148, 163, 184, 0.14)",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.95) 55%, rgba(239,246,255,0.92) 100%)",
            boxShadow:
              "0 20px 48px rgba(15, 23, 42, 0.07), inset 0 1px 0 rgba(255,255,255,0.75)",
            padding: "42px 24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -70,
              right: -40,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "rgba(37, 99, 235, 0.08)",
              filter: "blur(10px)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                width: 64,
                height: 64,
                margin: "0 auto 18px",
                borderRadius: 22,
                background:
                  "linear-gradient(135deg, rgba(37,99,235,0.14) 0%, rgba(14,165,233,0.12) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 900,
                color: "#1d4ed8",
                boxShadow: "0 16px 34px rgba(37, 99, 235, 0.12)",
              }}
            >
              ✓
            </div>

            <h3
              style={{
                margin: 0,
                fontSize: "1.5rem",
                lineHeight: 1.15,
                fontWeight: 900,
                letterSpacing: "-0.03em",
                color: "#0f172a",
              }}
            >
              Nothing due right now
            </h3>

            <p
              style={{
                margin: "12px auto 0",
                maxWidth: 520,
                fontSize: 15,
                lineHeight: 1.75,
                color: "#64748b",
              }}
            >
              No follow-ups are scheduled for today. Your queue is clear, so you
              can focus on pipeline movement, new outreach, or planning ahead.
            </p>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 16,
          }}
        >
          {todayFollowUps.map((lead) => {
            const displayName =
              lead.businessName ||
              lead.contactName ||
              lead.linkedinCompany ||
              "Untitled Lead";

            const subtitle = [
              lead.contactName && lead.contactName !== lead.businessName
                ? lead.contactName
                : null,
              lead.linkedinRole || null,
            ]
              .filter(Boolean)
              .join(" • ");

            return (
              <div
                key={lead.id}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 26,
                  border: "1px solid rgba(148, 163, 184, 0.14)",
                  background:
                    "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.94) 100%)",
                  boxShadow:
                    "0 18px 42px rgba(15, 23, 42, 0.07), inset 0 1px 0 rgba(255,255,255,0.75)",
                  padding: 20,
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -40,
                    right: -20,
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    background: "rgba(16, 185, 129, 0.08)",
                    filter: "blur(18px)",
                    pointerEvents: "none",
                  }}
                />

                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 18,
                    flexWrap: "wrap",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 14,
                      alignItems: "flex-start",
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 18,
                        background:
                          "linear-gradient(135deg, rgba(37,99,235,0.14) 0%, rgba(14,165,233,0.12) 100%)",
                        color: "#0f172a",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 900,
                        fontSize: 14,
                        letterSpacing: "0.04em",
                        border: "1px solid rgba(148,163,184,0.14)",
                        flexShrink: 0,
                      }}
                    >
                      {getInitials(displayName)}
                    </div>

                    <div
                      style={{
                        minWidth: 0,
                        display: "grid",
                        gap: 10,
                        flex: 1,
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            margin: 0,
                            fontSize: 17,
                            fontWeight: 900,
                            lineHeight: 1.3,
                            letterSpacing: "-0.02em",
                            color: "#0f172a",
                            wordBreak: "break-word",
                          }}
                        >
                          {displayName}
                        </h3>

                        {subtitle ? (
                          <p
                            style={{
                              margin: "6px 0 0",
                              fontSize: 13,
                              lineHeight: 1.6,
                              color: "#64748b",
                              wordBreak: "break-word",
                            }}
                          >
                            {subtitle}
                          </p>
                        ) : null}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 8,
                        }}
                      >
                        {lead.category ? (
                          <span
                            style={{
                              padding: "7px 10px",
                              borderRadius: 999,
                              background: "rgba(37, 99, 235, 0.08)",
                              color: "#1d4ed8",
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            {formatLabel(lead.category)}
                          </span>
                        ) : null}

                        {lead.status ? (
                          <span
                            style={{
                              padding: "7px 10px",
                              borderRadius: 999,
                              background: "rgba(148, 163, 184, 0.10)",
                              color: "#475569",
                              fontSize: 12,
                              fontWeight: 700,
                            }}
                          >
                            {formatLabel(lead.status)}
                          </span>
                        ) : null}

                        <span
                          style={{
                            padding: "7px 10px",
                            borderRadius: 999,
                            background: "rgba(16, 185, 129, 0.10)",
                            color: "#047857",
                            fontSize: 12,
                            fontWeight: 700,
                          }}
                        >
                          Follow-up: {formatDate(lead.followUpDate)}
                        </span>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gap: 8,
                          padding: 14,
                          borderRadius: 18,
                          background: "rgba(248,250,252,0.85)",
                          border: "1px solid rgba(148, 163, 184, 0.12)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 800,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: "#94a3b8",
                          }}
                        >
                          Contact
                        </div>

                        <div
                          style={{
                            fontSize: 14,
                            color: "#334155",
                            lineHeight: 1.7,
                            wordBreak: "break-word",
                          }}
                        >
                          {lead.mobile || "No mobile number"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      flexWrap: "wrap",
                    }}
                  >
                    {lead.mobile ? (
                      <a
                        href={`https://wa.me/${normalizeWhatsappNumber(lead.mobile)}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          ...styles.whatsappButton,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "12px 16px",
                          borderRadius: 16,
                          fontWeight: 800,
                          textDecoration: "none",
                          boxShadow: "0 14px 30px rgba(16, 185, 129, 0.18)",
                        }}
                      >
                        WhatsApp
                      </a>
                    ) : (
                      <div
                        style={{
                          padding: "12px 14px",
                          borderRadius: 16,
                          border: "1px solid rgba(148, 163, 184, 0.18)",
                          background: "rgba(248,250,252,0.85)",
                          color: "#94a3b8",
                          fontSize: 13,
                          fontWeight: 700,
                        }}
                      >
                        No WhatsApp number
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}