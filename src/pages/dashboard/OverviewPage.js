import { useContext, useMemo } from "react";
import { DashboardContext } from "../../context/DashboardContext";

const styles = {
  page: {
    display: "grid",
    gap: 22,
  },

  hero: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 30,
    padding: "28px",
    background:
      "linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(79,70,229,0.10) 55%, rgba(14,165,233,0.08) 100%)",
    border: "1px solid rgba(148,163,184,0.16)",
    boxShadow:
      "0 24px 60px rgba(15,23,42,0.08), inset 0 1px 0 rgba(255,255,255,0.35)",
    backdropFilter: "blur(10px)",
  },
  heroGlow: {
    position: "absolute",
    top: -80,
    right: -80,
    width: 220,
    height: 220,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(59,130,246,0.14) 0%, rgba(99,102,241,0.10) 38%, rgba(255,255,255,0) 72%)",
    pointerEvents: "none",
  },
  heroEyebrow: {
    margin: 0,
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#1d4ed8",
  },
  heroTitle: {
    margin: "10px 0 0 0",
    fontSize: "2.15rem",
    lineHeight: 1.02,
    fontWeight: 900,
    letterSpacing: "-0.05em",
    color: "#0f172a",
  },
  heroSub: {
    margin: "12px 0 0 0",
    maxWidth: 760,
    fontSize: 15,
    lineHeight: 1.8,
    color: "#64748b",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 16,
  },

  statCard: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 24,
    padding: "20px 20px 18px",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)",
    border: "1px solid rgba(148,163,184,0.16)",
    boxShadow:
      "0 18px 40px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.7)",
    minHeight: 168,
  },
  statGlowBlue: {
    position: "absolute",
    top: -35,
    right: -35,
    width: 120,
    height: 120,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(59,130,246,0.12) 0%, rgba(59,130,246,0) 72%)",
    pointerEvents: "none",
  },
  statGlowGreen: {
    position: "absolute",
    top: -35,
    right: -35,
    width: 120,
    height: 120,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(34,197,94,0.12) 0%, rgba(34,197,94,0) 72%)",
    pointerEvents: "none",
  },
  statGlowOrange: {
    position: "absolute",
    top: -35,
    right: -35,
    width: 120,
    height: 120,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(249,115,22,0.12) 0%, rgba(249,115,22,0) 72%)",
    pointerEvents: "none",
  },
  statGlowPurple: {
    position: "absolute",
    top: -35,
    right: -35,
    width: 120,
    height: 120,
    borderRadius: "50%",
    background:
      "radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(99,102,241,0) 72%)",
    pointerEvents: "none",
  },
  statHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 14,
  },
  statLabelWrap: {
    display: "grid",
    gap: 8,
  },
  statLabel: {
    margin: 0,
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#64748b",
  },
  statIcon: {
    width: 44,
    height: 44,
    minWidth: 44,
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    fontWeight: 800,
    color: "#0f172a",
    background:
      "linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(99,102,241,0.10) 100%)",
    border: "1px solid rgba(96,165,250,0.16)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.5)",
  },
  statValue: {
    margin: "2px 0 0 0",
    fontSize: "2rem",
    lineHeight: 1,
    fontWeight: 900,
    letterSpacing: "-0.05em",
    color: "#0f172a",
  },
  statHint: {
    margin: "12px 0 0 0",
    fontSize: 13,
    color: "#64748b",
    lineHeight: 1.7,
  },
  statMeta: {
    marginTop: 14,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    background: "rgba(15,23,42,0.05)",
    color: "#334155",
    border: "1px solid rgba(148,163,184,0.12)",
  },

  split: {
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: 18,
    alignItems: "start",
  },

  card: {
    borderRadius: 26,
    padding: "22px",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.99) 100%)",
    border: "1px solid rgba(148,163,184,0.16)",
    boxShadow:
      "0 18px 40px rgba(15,23,42,0.06), inset 0 1px 0 rgba(255,255,255,0.72)",
  },
  cardTitle: {
    margin: 0,
    fontSize: 19,
    fontWeight: 900,
    color: "#0f172a",
    letterSpacing: "-0.035em",
  },
  cardSub: {
    margin: "8px 0 0 0",
    fontSize: 14,
    color: "#64748b",
    lineHeight: 1.75,
  },

  list: {
    display: "grid",
    gap: 13,
    marginTop: 18,
  },
  item: {
    borderRadius: 20,
    padding: "16px 16px",
    background:
      "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(248,250,252,1) 100%)",
    border: "1px solid rgba(148,163,184,0.14)",
    boxShadow: "0 10px 26px rgba(15,23,42,0.04)",
  },
  itemTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 10,
  },
  itemTitle: {
    margin: 0,
    fontSize: 15,
    fontWeight: 800,
    color: "#0f172a",
  },
  itemSub: {
    margin: "6px 0 0 0",
    fontSize: 13,
    color: "#64748b",
    lineHeight: 1.65,
  },
  pill: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "7px 11px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 900,
    whiteSpace: "nowrap",
    letterSpacing: "0.04em",
    border: "1px solid transparent",
  },

  progressWrap: {
    marginTop: 14,
    display: "grid",
    gap: 13,
  },
  progressRow: {
    display: "grid",
    gap: 8,
  },
  progressLabelRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "center",
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: "#334155",
  },
  progressTrack: {
    height: 10,
    borderRadius: 999,
    background: "#e2e8f0",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    background: "linear-gradient(90deg, #2563eb 0%, #4f46e5 100%)",
  },

  empty: {
    marginTop: 16,
    borderRadius: 18,
    padding: "18px",
    border: "1px dashed rgba(148,163,184,0.26)",
    color: "#64748b",
    background: "#fff",
  },
};

function formatCurrency(value) {
  const amount = Number(value || 0);
  if (!amount) return "R0";
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getPriorityMeta(priority) {
  if (priority === "hot") {
    return {
      label: "HOT 🔴",
      color: "#991b1b",
      background: "rgba(239,68,68,0.12)",
      border: "1px solid rgba(239,68,68,0.16)",
    };
  }

  if (priority === "warm") {
    return {
      label: "WARM 🟠",
      color: "#9a3412",
      background: "rgba(249,115,22,0.12)",
      border: "1px solid rgba(249,115,22,0.16)",
    };
  }

  return {
    label: "COLD ⚪",
    color: "#334155",
    background: "rgba(148,163,184,0.12)",
    border: "1px solid rgba(148,163,184,0.16)",
  };
}

export default function OverviewPage() {
  const { leads, todayFollowUps } = useContext(DashboardContext);

  const analytics = useMemo(() => {
    const safeLeads = Array.isArray(leads) ? leads : [];
    const totalLeads = safeLeads.length;

    const hotLeads = safeLeads.filter((lead) => lead.ai_priority === "hot");
    const warmLeads = safeLeads.filter((lead) => lead.ai_priority === "warm");
    const coldLeads = safeLeads.filter((lead) => lead.ai_priority === "cold");

    const pipelineForecast = safeLeads.reduce(
      (sum, lead) => sum + Number(lead.estimated_value || 0),
      0
    );

    const avgCloseRate = totalLeads
      ? Math.round(
          safeLeads.reduce(
            (sum, lead) => sum + Number(lead.deal_probability || 0),
            0
          ) / totalLeads
        )
      : 0;

    const proposalLeads = safeLeads.filter((lead) => lead.stage === "Proposal");
    const qualifiedLeads = safeLeads.filter((lead) => lead.stage === "Qualified");
    const wonLeads = safeLeads.filter(
      (lead) => lead.stage === "Won" || lead.status === "Won"
    );

    const topOpportunities = [...safeLeads]
      .sort((a, b) => {
        const scoreDiff = (b.ai_score || 0) - (a.ai_score || 0);
        if (scoreDiff !== 0) return scoreDiff;

        const probabilityDiff =
          (b.deal_probability || 0) - (a.deal_probability || 0);
        if (probabilityDiff !== 0) return probabilityDiff;

        return (b.estimated_value || 0) - (a.estimated_value || 0);
      })
      .slice(0, 5);

    const stageCounts = [
      {
        label: "Prospect",
        value: safeLeads.filter((l) => l.stage === "Prospect").length,
      },
      {
        label: "Contacted",
        value: safeLeads.filter((l) => l.stage === "Contacted").length,
      },
      {
        label: "Qualified",
        value: qualifiedLeads.length,
      },
      {
        label: "Proposal",
        value: proposalLeads.length,
      },
      {
        label: "Negotiation",
        value: safeLeads.filter((l) => l.stage === "Negotiation").length,
      },
      {
        label: "Won",
        value: wonLeads.length,
      },
    ];

    return {
      totalLeads,
      hotCount: hotLeads.length,
      warmCount: warmLeads.length,
      coldCount: coldLeads.length,
      pipelineForecast,
      avgCloseRate,
      proposalCount: proposalLeads.length,
      qualifiedCount: qualifiedLeads.length,
      wonCount: wonLeads.length,
      topOpportunities,
      stageCounts,
    };
  }, [leads]);

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div style={styles.heroGlow} />
        <p style={styles.heroEyebrow}>Overview</p>
        <h1 style={styles.heroTitle}>Revenue command center</h1>
        <p style={styles.heroSub}>
          Track your strongest opportunities, monitor AI-ranked deal quality,
          and focus the team on leads most likely to close.
        </p>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statGlowBlue} />
          <div style={styles.statHeader}>
            <div style={styles.statLabelWrap}>
              <p style={styles.statLabel}>Pipeline forecast</p>
              <p style={styles.statValue}>
                {formatCurrency(analytics.pipelineForecast)}
              </p>
            </div>
            <div style={styles.statIcon}>R</div>
          </div>
          <p style={styles.statHint}>
            Forecasted value from weighted opportunities.
          </p>
          <div style={styles.statMeta}>Revenue visibility</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statGlowGreen} />
          <div style={styles.statHeader}>
            <div style={styles.statLabelWrap}>
              <p style={styles.statLabel}>Average close rate</p>
              <p style={styles.statValue}>{analytics.avgCloseRate}%</p>
            </div>
            <div style={styles.statIcon}>%</div>
          </div>
          <p style={styles.statHint}>
            Average AI-driven deal probability across all leads.
          </p>
          <div style={styles.statMeta}>Conversion signal</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statGlowOrange} />
          <div style={styles.statHeader}>
            <div style={styles.statLabelWrap}>
              <p style={styles.statLabel}>Hot leads</p>
              <p style={styles.statValue}>{analytics.hotCount}</p>
            </div>
            <div style={styles.statIcon}>🔥</div>
          </div>
          <p style={styles.statHint}>
            {analytics.warmCount} warm and {analytics.coldCount} cold leads behind them.
          </p>
          <div style={styles.statMeta}>Priority stack</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statGlowPurple} />
          <div style={styles.statHeader}>
            <div style={styles.statLabelWrap}>
              <p style={styles.statLabel}>Today follow-ups</p>
              <p style={styles.statValue}>
                {Array.isArray(todayFollowUps) ? todayFollowUps.length : 0}
              </p>
            </div>
            <div style={styles.statIcon}>↗</div>
          </div>
          <p style={styles.statHint}>Leads due for contact today.</p>
          <div style={styles.statMeta}>Action required</div>
        </div>
      </div>

      <div style={styles.split}>
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Top opportunities</h2>
          <p style={styles.cardSub}>
            Your highest-priority deals ranked by AI score, close probability,
            and forecast value.
          </p>

          {analytics.topOpportunities.length === 0 ? (
            <div style={styles.empty}>No leads available yet.</div>
          ) : (
            <div style={styles.list}>
              {analytics.topOpportunities.map((lead) => {
                const priority = getPriorityMeta(lead.ai_priority);

                return (
                  <div key={lead.id} style={styles.item}>
                    <div style={styles.itemTop}>
                      <div>
                        <p style={styles.itemTitle}>
                          {lead.businessName || "Untitled Lead"}
                        </p>
                        <p style={styles.itemSub}>
                          {lead.contactName || "No contact"} · {lead.stage || "No stage"}
                        </p>
                      </div>

                      <div
                        style={{
                          ...styles.pill,
                          color: priority.color,
                          background: priority.background,
                          border: priority.border,
                        }}
                      >
                        {priority.label}
                      </div>
                    </div>

                    <div style={styles.progressWrap}>
                      <div style={styles.progressRow}>
                        <div style={styles.progressLabelRow}>
                          <span style={styles.progressLabel}>AI score</span>
                          <span style={styles.progressLabel}>
                            {lead.ai_score || 0}/100
                          </span>
                        </div>
                        <div style={styles.progressTrack}>
                          <div
                            style={{
                              ...styles.progressFill,
                              width: `${Math.max(
                                0,
                                Math.min(100, lead.ai_score || 0)
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div style={styles.progressRow}>
                        <div style={styles.progressLabelRow}>
                          <span style={styles.progressLabel}>Deal probability</span>
                          <span style={styles.progressLabel}>
                            {lead.deal_probability || 0}%
                          </span>
                        </div>
                        <div style={styles.progressTrack}>
                          <div
                            style={{
                              ...styles.progressFill,
                              width: `${Math.max(
                                0,
                                Math.min(100, lead.deal_probability || 0)
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <p style={{ ...styles.itemSub, marginTop: 12 }}>
                      Forecast value: <strong>{formatCurrency(lead.estimated_value)}</strong>
                    </p>

                    {lead.next_best_action ? (
                      <p style={{ ...styles.itemSub, marginTop: 8 }}>
                        Next action: <strong>{lead.next_best_action}</strong>
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ display: "grid", gap: 18 }}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Pipeline stage health</h2>
            <p style={styles.cardSub}>
              Quick view of where leads are sitting in the pipeline.
            </p>

            <div style={styles.progressWrap}>
              {analytics.stageCounts.map((stage) => {
                const total = analytics.totalLeads || 1;
                const width = Math.round((stage.value / total) * 100);

                return (
                  <div key={stage.label} style={styles.progressRow}>
                    <div style={styles.progressLabelRow}>
                      <span style={styles.progressLabel}>{stage.label}</span>
                      <span style={styles.progressLabel}>{stage.value}</span>
                    </div>
                    <div style={styles.progressTrack}>
                      <div
                        style={{
                          ...styles.progressFill,
                          width: `${width}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Closing pressure</h2>
            <p style={styles.cardSub}>
              Deals closest to commercial conversion.
            </p>

            <div style={styles.list}>
              <div style={styles.item}>
                <p style={styles.itemTitle}>Qualified leads</p>
                <p style={styles.itemSub}>
                  {analytics.qualifiedCount} ready for proposal shaping.
                </p>
              </div>

              <div style={styles.item}>
                <p style={styles.itemTitle}>Proposal stage</p>
                <p style={styles.itemSub}>
                  {analytics.proposalCount} currently in closing range.
                </p>
              </div>

              <div style={styles.item}>
                <p style={styles.itemTitle}>Won deals</p>
                <p style={styles.itemSub}>
                  {analytics.wonCount} successfully converted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}