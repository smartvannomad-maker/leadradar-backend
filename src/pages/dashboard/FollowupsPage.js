import FollowupsPanel from "../../components/dashboard/FollowupsPanel";
import { useDashboard } from "../../context/DashboardContext";

export default function FollowupsPage() {
  const { todayFollowUps } = useDashboard();

  return (
    <div
      style={{
        display: "grid",
        gap: 24,
      }}
    >
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 28,
          border: "1px solid rgba(148, 163, 184, 0.16)",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.96) 55%, rgba(239,246,255,0.92) 100%)",
          boxShadow:
            "0 24px 60px rgba(15, 23, 42, 0.10), inset 0 1px 0 rgba(255,255,255,0.75)",
          padding: "28px 28px 24px",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -90,
            right: -70,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "rgba(59, 130, 246, 0.10)",
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

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ minWidth: 0 }}>
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
              Daily execution
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                lineHeight: 1.05,
                fontWeight: 900,
                letterSpacing: "-0.04em",
                color: "#0f172a",
              }}
            >
              Today’s Follow-ups
            </h1>

            <p
              style={{
                margin: "12px 0 0",
                maxWidth: 760,
                fontSize: "1rem",
                lineHeight: 1.7,
                color: "#475569",
              }}
            >
              Stay on top of the conversations that matter most. Review the
              follow-ups due today, keep momentum moving, and make your outreach
              pipeline feel intentional and consistent.
            </p>
          </div>

          <div
            style={{
              minWidth: 220,
              padding: "16px 18px",
              borderRadius: 22,
              background: "rgba(255,255,255,0.78)",
              border: "1px solid rgba(148, 163, 184, 0.16)",
              boxShadow: "0 12px 30px rgba(15, 23, 42, 0.06)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#64748b",
                marginBottom: 8,
              }}
            >
              Due today
            </div>
            <div
              style={{
                fontSize: 32,
                lineHeight: 1,
                fontWeight: 900,
                letterSpacing: "-0.05em",
                color: "#0f172a",
                marginBottom: 8,
              }}
            >
              {todayFollowUps?.length || 0}
            </div>
            <div
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: "#64748b",
              }}
            >
              A focused follow-up list helps turn warm leads into real pipeline.
            </div>
          </div>
        </div>
      </section>

      <div
        style={{
          borderRadius: 28,
          border: "1px solid rgba(148, 163, 184, 0.14)",
          background: "rgba(255,255,255,0.92)",
          boxShadow:
            "0 20px 50px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255,255,255,0.75)",
          padding: 20,
        }}
      >
        <FollowupsPanel todayFollowUps={todayFollowUps} />
      </div>
    </div>
  );
}