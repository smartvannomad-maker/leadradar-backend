import { useMemo } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Clock3, Crown } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { getWorkspaceAccess, isTrialExpired } from "../utils/trialAccess";

export default function TrialBanner() {
  const { workspace } = useAuth();

  const resolvedWorkspace = useMemo(() => {
    if (workspace) {
      return getWorkspaceAccess(workspace);
    }

    return getWorkspaceAccess();
  }, [workspace]);

  const content = useMemo(() => {
    if (!resolvedWorkspace) return null;

    if (isTrialExpired(resolvedWorkspace)) {
      return {
        icon: <AlertTriangle size={16} />,
        title: "Trial expired",
        text: "Upgrade your plan to continue adding leads, importing CSVs, and using premium tools.",
        bg: "#fff7ed",
        border: "#fdba74",
        textColor: "#9a3412",
        cta: "Choose Plan",
      };
    }

    if (resolvedWorkspace.isTrialing) {
      return {
        icon: <Clock3 size={16} />,
        title: `Trial active • ${resolvedWorkspace.trialDaysLeft} day${
          resolvedWorkspace.trialDaysLeft === 1 ? "" : "s"
        } left`,
        text: "You currently have full premium access during your trial.",
        bg: "#eff6ff",
        border: "#93c5fd",
        textColor: "#1d4ed8",
        cta: "View Plans",
      };
    }

    if (resolvedWorkspace.isPaid) {
      return {
        icon: <Crown size={16} />,
        title: "Paid plan active",
        text: "Your workspace has active paid access.",
        bg: "#f0fdf4",
        border: "#86efac",
        textColor: "#166534",
        cta: "Manage Billing",
      };
    }

    return null;
  }, [resolvedWorkspace]);

  if (!content) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 14,
        flexWrap: "wrap",
        padding: 14,
        borderRadius: 18,
        background: content.bg,
        border: `1px solid ${content.border}`,
        marginBottom: 18,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div style={{ color: content.textColor, marginTop: 2 }}>{content.icon}</div>
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 900,
              color: content.textColor,
              marginBottom: 4,
            }}
          >
            {content.title}
          </div>
          <div
            style={{
              fontSize: 13,
              lineHeight: 1.7,
              color: "#475569",
            }}
          >
            {content.text}
          </div>
        </div>
      </div>

      <Link
        to="/dashboard/billing"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "11px 14px",
          borderRadius: 14,
          background: "#ffffff",
          border: "1px solid rgba(148,163,184,0.18)",
          color: "#0f172a",
          textDecoration: "none",
          fontSize: 13,
          fontWeight: 800,
          whiteSpace: "nowrap",
        }}
      >
        {content.cta}
      </Link>
    </div>
  );
}