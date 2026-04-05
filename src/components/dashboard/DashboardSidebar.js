import { NavLink } from "react-router-dom";
import {
  BriefcaseBusiness,
  LayoutDashboard,
  ListChecks,
  Users,
  Link2,
  FolderPlus,
  Network,
} from "lucide-react";
import { styles } from "../../styles/dashboardStyles";

const sections = [
  { id: "overview", label: "Overview", to: "/dashboard/overview", icon: LayoutDashboard },
  { id: "create", label: "Add Lead", to: "/dashboard/create", icon: FolderPlus },
  { id: "followups", label: "Follow-ups", to: "/dashboard/followups", icon: ListChecks },
  { id: "pipeline", label: "Pipeline", to: "/dashboard/pipeline", icon: Network },
  { id: "leads", label: "Leads", to: "/dashboard/leads", icon: BriefcaseBusiness },
  { id: "linkedin", label: "LinkedIn", to: "/dashboard/linkedin", icon: Link2 },
  { id: "team", label: "Team", to: "/dashboard/team", icon: Users },
];

export default function DashboardSidebar() {
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

      <div
        style={{
          marginTop: 26,
          padding: 18,
          borderRadius: 22,
          background: "linear-gradient(180deg, #f8fbff 0%, #f8fafc 100%)",
          border: "1px solid #e2e8f0",
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 800,
            color: "#0f172a",
            marginBottom: 8,
          }}
        >
          Workspace mode
        </div>
        <div
          style={{
            fontSize: 13,
            lineHeight: 1.8,
            color: "#64748b",
          }}
        >
          Shared team workspace for compliant lead sourcing, follow-ups, pipeline
          visibility, and CSV-based growth workflows.
        </div>
      </div>
    </div>
  );
}