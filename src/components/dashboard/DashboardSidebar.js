import { NavLink } from "react-router-dom";
import {
  BriefcaseBusiness,
  LayoutDashboard,
  ListChecks,
  Users,
  Link2,
  FolderPlus,
  Network,
  FileSpreadsheet,
  Search,
  CreditCard,
  Crown,
} from "lucide-react";
import { styles } from "../../styles/dashboardStyles";
import { getCurrentPlan } from "../../utils/currentPlan";
import { PLAN_FEATURES } from "../../config/planFeatures";

const sections = [
  {
    id: "overview",
    label: "Overview",
    to: "/dashboard/overview",
    icon: LayoutDashboard,
  },
  {
    id: "create",
    label: "Add Lead",
    to: "/dashboard/create",
    icon: FolderPlus,
  },
  {
    id: "import",
    label: "Import",
    to: "/dashboard/import",
    icon: FileSpreadsheet,
  },
  {
    id: "search",
    label: "Lead Search",
    to: "/dashboard/search",
    icon: Search,
  },
  {
    id: "followups",
    label: "Follow-ups",
    to: "/dashboard/followups",
    icon: ListChecks,
  },
  {
    id: "pipeline",
    label: "Pipeline",
    to: "/dashboard/pipeline",
    icon: Network,
  },
  {
    id: "leads",
    label: "Leads",
    to: "/dashboard/leads",
    icon: BriefcaseBusiness,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    to: "/dashboard/linkedin",
    icon: Link2,
  },
  {
    id: "team",
    label: "Team",
    to: "/dashboard/team",
    icon: Users,
  },
  {
    id: "billing",
    label: "Billing",
    to: "/dashboard/billing",
    icon: CreditCard,
  },
];

function getPlanAccent(plan) {
  switch (plan) {
    case "scale":
      return {
        bg: "linear-gradient(135deg, #ede9fe 0%, #eef2ff 100%)",
        border: "#c4b5fd",
        text: "#5b21b6",
        badgeBg: "#ddd6fe",
      };
    case "pro":
      return {
        bg: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)",
        border: "#93c5fd",
        text: "#1d4ed8",
        badgeBg: "#dbeafe",
      };
    case "growth":
      return {
        bg: "linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%)",
        border: "#86efac",
        text: "#166534",
        badgeBg: "#dcfce7",
      };
    default:
      return {
        bg: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
        border: "#e2e8f0",
        text: "#334155",
        badgeBg: "#f1f5f9",
      };
  }
}

export default function DashboardSidebar() {
  const currentPlan = getCurrentPlan();
  const currentPlanLabel =
    PLAN_FEATURES[currentPlan]?.label || "Starter";
  const planAccent = getPlanAccent(currentPlan);

  return (
    <div style={styles.sidebarCard}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 28,
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 18,
            background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
            fontSize: 15,
            boxShadow: "0 14px 30px rgba(59,130,246,0.24)",
          }}
        >
          LR
        </div>

        <div>
          <div
            style={{
              fontWeight: 900,
              fontSize: 18,
              color: "#020617",
              letterSpacing: "-0.03em",
            }}
          >
            LeadRadar
          </div>
          <div
            style={{
              fontSize: 12,
              color: "#64748b",
              fontWeight: 700,
            }}
          >
            CRM Workspace
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {sections.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.id}
              to={item.to}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 12,
                textAlign: "left",
                padding: "13px 14px",
                borderRadius: 18,
                border: isActive ? "1px solid #bfdbfe" : "1px solid transparent",
                background: isActive ? "#eff6ff" : "transparent",
                color: isActive ? "#1d4ed8" : "#334155",
                fontWeight: isActive ? 800 : 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
                textDecoration: "none",
              })}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      <NavLink
        to="/dashboard/billing"
        style={{
          marginTop: 26,
          padding: 18,
          borderRadius: 22,
          background: planAccent.bg,
          border: `1px solid ${planAccent.border}`,
          textDecoration: "none",
          display: "block",
          boxShadow: "0 12px 24px rgba(15,23,42,0.05)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 800,
              color: "#0f172a",
            }}
          >
            Current Plan
          </div>

          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: planAccent.badgeBg,
              color: planAccent.text,
            }}
          >
            <Crown size={16} />
          </div>
        </div>

        <div
          style={{
            fontSize: 18,
            fontWeight: 900,
            color: planAccent.text,
            letterSpacing: "-0.03em",
            marginBottom: 8,
          }}
        >
          {currentPlanLabel}
        </div>

        <div
          style={{
            fontSize: 13,
            lineHeight: 1.7,
            color: "#475569",
            marginBottom: 12,
          }}
        >
          Manage feature access, upgrade your workspace, and unlock more tools.
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "9px 12px",
            borderRadius: 999,
            background: "#ffffff",
            border: "1px solid rgba(148,163,184,0.18)",
            color: "#0f172a",
            fontSize: 12,
            fontWeight: 800,
          }}
        >
          Open Billing
        </div>
      </NavLink>
    </div>
  );
}