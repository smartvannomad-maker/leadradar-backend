import { styles } from "../../styles/dashboardStyles";

function getWorkspaceLabel(user) {
  if (user?.workspaceName) return user.workspaceName;
  if (user?.workspace?.name) return user.workspace.name;
  return "Personal Workspace";
}

function getUserInitials(user) {
  const source =
    user?.name || user?.fullName || user?.email?.split("@")[0] || "LR";

  const parts = String(source).trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase()).join("") || "LR";
}

export default function DashboardHeader({ user, onLogout }) {
  const workspaceLabel = getWorkspaceLabel(user);
  const initials = getUserInitials(user);

  return (
    <>
      <style>{styles.responsiveCss}</style>

      <div
        className="lr-dashboard-header"
        style={{
          ...styles.header,
          position: "relative",
          overflow: "hidden",
          borderRadius: 30,
          border: "1px solid rgba(148, 163, 184, 0.14)",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.95) 55%, rgba(239,246,255,0.92) 100%)",
          boxShadow:
            "0 24px 60px rgba(15, 23, 42, 0.10), inset 0 1px 0 rgba(255,255,255,0.75)",
          padding: "26px 26px 24px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -90,
            right: -50,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "rgba(37, 99, 235, 0.10)",
            filter: "blur(10px)",
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

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 18,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 16,
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
                color: "#0f172a",
                fontSize: 16,
                fontWeight: 900,
                letterSpacing: "0.05em",
                flexShrink: 0,
              }}
            >
              {initials}
            </div>

            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 12,
                  padding: "8px 12px",
                  borderRadius: 999,
                  background: "rgba(37, 99, 235, 0.08)",
                  color: "#1d4ed8",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                LeadRadar
              </div>

              <h1
                style={{
                  ...styles.mainTitle,
                  margin: 0,
                  fontSize: "clamp(1.7rem, 3vw, 2.35rem)",
                  lineHeight: 1.05,
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  color: "#0f172a",
                }}
              >
                Lead sourcing CRM dashboard
              </h1>

              {user && (
                <p
                  style={{
                    ...styles.subText,
                    marginTop: 12,
                    fontSize: 15,
                    lineHeight: 1.75,
                    color: "#64748b",
                  }}
                >
                  Signed in as{" "}
                  <strong style={{ color: "#334155" }}>{user.email}</strong>
                </p>
              )}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                padding: "12px 16px",
                borderRadius: 18,
                background: "rgba(255,255,255,0.8)",
                border: "1px solid rgba(148, 163, 184, 0.16)",
                color: "#475569",
                fontSize: 14,
                fontWeight: 800,
                boxShadow: "0 10px 24px rgba(15,23,42,0.05)",
                backdropFilter: "blur(10px)",
                whiteSpace: "nowrap",
              }}
            >
              {workspaceLabel}
            </div>

            <button
              onClick={onLogout}
              style={{
                ...styles.logoutButton,
                borderRadius: 18,
                padding: "12px 18px",
                boxShadow: "0 14px 30px rgba(15, 23, 42, 0.10)",
                fontWeight: 800,
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}