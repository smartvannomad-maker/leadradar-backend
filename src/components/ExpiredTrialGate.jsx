import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { getWorkspaceAccess, isTrialExpired } from "../utils/trialAccess";

export default function ExpiredTrialGate({
  children,
  title = "Upgrade Required",
  description,
}) {
  const workspace = getWorkspaceAccess();

  if (!isTrialExpired(workspace)) {
    return children;
  }

  return (
    <div
      style={{
        borderRadius: 28,
        padding: 24,
        background: "linear-gradient(180deg, #fffefe 0%, #fff7f7 100%)",
        border: "1px solid #fecaca",
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fee2e2",
          color: "#dc2626",
          marginBottom: 16,
        }}
      >
        <Lock size={24} />
      </div>

      <h2
        style={{
          margin: "0 0 10px",
          fontSize: 24,
          fontWeight: 900,
          color: "#0f172a",
        }}
      >
        {title}
      </h2>

      <p
        style={{
          margin: 0,
          fontSize: 14,
          lineHeight: 1.8,
          color: "#64748b",
          maxWidth: 720,
        }}
      >
        {description ||
          "Your free trial has ended. Upgrade your plan to continue using this feature."}
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 22 }}>
        <Link
          to="/dashboard/billing"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "13px 18px",
            borderRadius: 16,
            background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 800,
            fontSize: 14,
          }}
        >
          Upgrade Plan
        </Link>
      </div>
    </div>
  );
}