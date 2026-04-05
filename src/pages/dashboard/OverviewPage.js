import { useContext } from "react";
import { BarChart3, CircleDollarSign, Clock3, Target, TrendingUp, Users } from "lucide-react";
import { DashboardContext } from "../../context/DashboardContext";
import { styles } from "../../styles/dashboardStyles";

function MetricCard({ icon: Icon, title, value, subtext, tone = "blue" }) {
  const toneMap = {
    blue: {
      bg: "#eff6ff",
      color: "#1d4ed8",
    },
    green: {
      bg: "#ecfdf5",
      color: "#059669",
    },
    amber: {
      bg: "#fffbeb",
      color: "#d97706",
    },
    violet: {
      bg: "#f5f3ff",
      color: "#6d28d9",
    },
  };

  const palette = toneMap[tone] || toneMap.blue;

  return (
    <div style={styles.statCard}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div>
          <div style={styles.statLabel}>{title}</div>
          <div style={styles.statValue}>{value}</div>
          {subtext ? <div style={styles.statMeta}>{subtext}</div> : null}
        </div>

        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: palette.bg,
            color: palette.color,
            flexShrink: 0,
          }}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function BreakdownCard({ title, items }) {
  const entries = Object.entries(items || {});

  return (
    <div style={styles.sectionCard}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <h3 style={{ ...styles.cardTitle, fontSize: 20 }}>{title}</h3>
        <span style={styles.badgeSlate}>{entries.length} groups</span>
      </div>

      {entries.length === 0 ? (
        <div style={styles.emptyState}>No data yet.</div>
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {entries.map(([label, count]) => (
            <div
              key={label}
              style={{
                border: "1px solid #e2e8f0",
                borderRadius: 18,
                background: "#fff",
                padding: 14,
                boxShadow: "0 8px 20px rgba(15,23,42,0.03)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                  gap: 12,
                }}
              >
                <span
                  style={{
                    color: "#334155",
                    fontWeight: 700,
                    fontSize: 14,
                  }}
                >
                  {label}
                </span>
                <span style={styles.badgeBlue}>{count}</span>
              </div>

              <div
                style={{
                  height: 10,
                  borderRadius: 999,
                  background: "#e2e8f0",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(count * 12, 100)}%`,
                    height: "100%",
                    borderRadius: 999,
                    background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OverviewPage() {
  const { stats, todayFollowUps, leads } = useContext(DashboardContext);

  return (
    <div style={{ display: "grid", gap: 22 }}>
      <div style={styles.sectionCard}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2 style={styles.cardTitle}>Workspace overview</h2>
            <p style={styles.cardText}>
              See your pipeline health, follow-up activity, and growth signals in one premium dashboard view.
            </p>
          </div>

          <div style={styles.badgeBlue}>Live metrics</div>
        </div>
      </div>

      <div
        className="lr-dashboard-grid-3"
        style={{
          display: "grid",
          gap: 18,
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        }}
      >
        <MetricCard
          icon={Users}
          title="Total Leads"
          value={stats.totalLeads}
          subtext="All leads in your current workspace"
          tone="blue"
        />

        <MetricCard
          icon={CircleDollarSign}
          title="Pipeline Value"
          value={`R ${Number(stats.pipelineValue || 0).toLocaleString()}`}
          subtext="Combined quote value across leads"
          tone="green"
        />

        <MetricCard
          icon={TrendingUp}
          title="Won Leads"
          value={stats.wonCount}
          subtext="Closed or won opportunities"
          tone="violet"
        />

        <MetricCard
          icon={Target}
          title="Conversion Rate"
          value={`${stats.conversionRate}%`}
          subtext="Won leads versus total leads"
          tone="blue"
        />

        <MetricCard
          icon={Clock3}
          title="Today's Follow-ups"
          value={todayFollowUps.length}
          subtext="Tasks that need attention today"
          tone="amber"
        />

        <MetricCard
          icon={BarChart3}
          title="Overdue Follow-ups"
          value={stats.overdueFollowUps}
          subtext="Past-due follow-up items"
          tone="amber"
        />
      </div>

      <div
        className="lr-dashboard-grid-2"
        style={{
          display: "grid",
          gap: 22,
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
        }}
      >
        <BreakdownCard title="Pipeline by Stage" items={stats.stageCounts} />
        <BreakdownCard title="Lead Status Breakdown" items={stats.statusCounts} />
      </div>

      <div style={styles.sectionCard}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: 18,
          }}
        >
          <div>
            <h3 style={{ ...styles.cardTitle, fontSize: 20 }}>Recent Leads</h3>
            <p style={{ ...styles.cardText, marginTop: 6 }}>
              Your latest lead activity inside this workspace.
            </p>
          </div>

          <div style={styles.badgeSlate}>{leads.length} total</div>
        </div>

        {leads.length === 0 ? (
          <div style={styles.emptyState}>No leads added yet.</div>
        ) : (
          <div style={{ display: "grid", gap: 14 }}>
            {leads.slice(0, 5).map((lead) => (
              <div
                key={lead.id}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 18,
                  padding: 16,
                  background: "#fff",
                  boxShadow: "0 8px 20px rgba(15,23,42,0.03)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: 16,
                        color: "#0f172a",
                      }}
                    >
                      {lead.businessName}
                    </div>

                    <div
                      style={{
                        color: "#64748b",
                        marginTop: 6,
                        fontSize: 14,
                        lineHeight: 1.7,
                      }}
                    >
                      {lead.contactName || "No contact"} · {lead.stage || "No stage"} ·{" "}
                      {lead.status || "No status"}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <span style={styles.badgeBlue}>{lead.stage || "Stage"}</span>
                    <span style={styles.badgeSlate}>{lead.status || "Status"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}