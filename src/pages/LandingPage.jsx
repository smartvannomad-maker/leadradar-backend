import React from "react";

export default function LandingPage() {
  const pageStyles = {
    page: {
      minHeight: "100vh",
      background:
        "radial-gradient(circle at top left, rgba(56, 189, 248, 0.08), transparent 28%), radial-gradient(circle at top right, rgba(99, 102, 241, 0.10), transparent 24%), linear-gradient(180deg, #07111f 0%, #081221 22%, #0b1729 55%, #0d1a2d 100%)",
      color: "#f8fafc",
      fontFamily:
        "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    container: {
      width: "100%",
      maxWidth: "1240px",
      margin: "0 auto",
      padding: "0 24px",
      boxSizing: "border-box",
    },
    nav: {
      position: "sticky",
      top: 0,
      zIndex: 20,
      backdropFilter: "blur(18px)",
      background: "rgba(7, 17, 31, 0.68)",
      borderBottom: "1px solid rgba(148, 163, 184, 0.12)",
    },
    navInner: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "16px",
      minHeight: "78px",
    },
    brandWrap: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    brandIcon: {
      width: "42px",
      height: "42px",
      borderRadius: "14px",
      background:
        "linear-gradient(135deg, rgba(56,189,248,1) 0%, rgba(99,102,241,1) 100%)",
      display: "grid",
      placeItems: "center",
      fontWeight: 800,
      fontSize: "18px",
      color: "#ffffff",
      boxShadow: "0 18px 40px rgba(56, 189, 248, 0.28)",
    },
    brandTitle: {
      fontSize: "18px",
      fontWeight: 800,
      lineHeight: 1.1,
      letterSpacing: "-0.03em",
      margin: 0,
    },
    brandSub: {
      fontSize: "12px",
      color: "rgba(226, 232, 240, 0.72)",
      marginTop: "2px",
    },
    navLinks: {
      display: "flex",
      alignItems: "center",
      gap: "22px",
      flexWrap: "wrap",
    },
    navLink: {
      color: "rgba(226, 232, 240, 0.86)",
      textDecoration: "none",
      fontSize: "14px",
      fontWeight: 600,
    },
    navActions: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      flexWrap: "wrap",
      justifyContent: "flex-end",
    },
    buttonGhost: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "12px 18px",
      borderRadius: "14px",
      border: "1px solid rgba(148, 163, 184, 0.18)",
      background: "rgba(255,255,255,0.02)",
      color: "#f8fafc",
      textDecoration: "none",
      fontWeight: 700,
      fontSize: "14px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      whiteSpace: "nowrap",
    },
    buttonPrimary: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "12px 18px",
      borderRadius: "14px",
      border: "1px solid rgba(56, 189, 248, 0.28)",
      background:
        "linear-gradient(135deg, rgba(56,189,248,1) 0%, rgba(99,102,241,1) 100%)",
      color: "#ffffff",
      textDecoration: "none",
      fontWeight: 800,
      fontSize: "14px",
      boxShadow: "0 18px 40px rgba(56, 189, 248, 0.18)",
      whiteSpace: "nowrap",
    },
    hero: {
      padding: "86px 0 52px",
    },
    heroGrid: {
      display: "grid",
      gridTemplateColumns: "1.12fr 0.88fr",
      gap: "32px",
      alignItems: "center",
    },
    chip: {
      display: "inline-flex",
      alignItems: "center",
      gap: "10px",
      padding: "10px 14px",
      borderRadius: "999px",
      border: "1px solid rgba(56, 189, 248, 0.18)",
      background: "rgba(56, 189, 248, 0.08)",
      color: "#bae6fd",
      fontSize: "13px",
      fontWeight: 700,
      marginBottom: "20px",
    },
    heroTitle: {
      fontSize: "clamp(38px, 6vw, 66px)",
      lineHeight: 0.98,
      letterSpacing: "-0.055em",
      margin: "0 0 18px",
      fontWeight: 900,
      maxWidth: "760px",
    },
    gradientText: {
      background:
        "linear-gradient(135deg, #ffffff 0%, #c4b5fd 45%, #67e8f9 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    heroText: {
      fontSize: "18px",
      lineHeight: 1.75,
      color: "rgba(226, 232, 240, 0.78)",
      maxWidth: "720px",
      margin: "0 0 28px",
    },
    heroActions: {
      display: "flex",
      alignItems: "center",
      gap: "14px",
      flexWrap: "wrap",
      marginBottom: "30px",
    },
    statRow: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: "14px",
    },
    statCard: {
      borderRadius: "22px",
      padding: "18px 18px 16px",
      background: "rgba(15, 23, 42, 0.62)",
      border: "1px solid rgba(148, 163, 184, 0.12)",
      boxShadow: "0 22px 54px rgba(2, 6, 23, 0.28)",
    },
    statValue: {
      fontSize: "24px",
      fontWeight: 900,
      letterSpacing: "-0.04em",
      marginBottom: "8px",
    },
    statLabel: {
      fontSize: "13px",
      lineHeight: 1.6,
      color: "rgba(226, 232, 240, 0.72)",
    },
    heroPanel: {
      borderRadius: "30px",
      padding: "24px",
      background:
        "linear-gradient(180deg, rgba(15, 23, 42, 0.80) 0%, rgba(10, 15, 29, 0.92) 100%)",
      border: "1px solid rgba(148, 163, 184, 0.12)",
      boxShadow: "0 30px 80px rgba(2, 6, 23, 0.42)",
    },
    panelHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: "12px",
      marginBottom: "18px",
    },
    panelTitle: {
      fontSize: "16px",
      fontWeight: 800,
      letterSpacing: "-0.02em",
    },
    pill: {
      padding: "8px 12px",
      borderRadius: "999px",
      background: "rgba(34, 197, 94, 0.10)",
      border: "1px solid rgba(34, 197, 94, 0.18)",
      color: "#bbf7d0",
      fontSize: "12px",
      fontWeight: 700,
      whiteSpace: "nowrap",
    },
    panelGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "14px",
    },
    miniCard: {
      borderRadius: "20px",
      padding: "18px",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(148, 163, 184, 0.10)",
      minHeight: "122px",
    },
    miniLabel: {
      fontSize: "12px",
      color: "rgba(226, 232, 240, 0.70)",
      marginBottom: "8px",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      fontWeight: 700,
    },
    miniValue: {
      fontSize: "28px",
      fontWeight: 900,
      letterSpacing: "-0.04em",
      marginBottom: "8px",
    },
    miniText: {
      fontSize: "13px",
      lineHeight: 1.65,
      color: "rgba(226, 232, 240, 0.76)",
    },
    section: {
      padding: "38px 0 28px",
    },
    sectionHeader: {
      textAlign: "center",
      maxWidth: "860px",
      margin: "0 auto 26px",
    },
    sectionEyebrow: {
      display: "inline-block",
      padding: "8px 12px",
      borderRadius: "999px",
      border: "1px solid rgba(99, 102, 241, 0.20)",
      background: "rgba(99, 102, 241, 0.10)",
      color: "#c4b5fd",
      fontSize: "12px",
      fontWeight: 800,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      marginBottom: "14px",
    },
    sectionTitle: {
      fontSize: "clamp(28px, 4.2vw, 46px)",
      fontWeight: 900,
      letterSpacing: "-0.045em",
      lineHeight: 1.06,
      margin: "0 0 14px",
    },
    sectionText: {
      fontSize: "17px",
      lineHeight: 1.78,
      color: "rgba(226, 232, 240, 0.76)",
      margin: 0,
    },
    featureGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
      gap: "18px",
      marginTop: "24px",
    },
    featureCard: {
      borderRadius: "26px",
      padding: "24px",
      background:
        "linear-gradient(180deg, rgba(15, 23, 42, 0.72) 0%, rgba(8, 15, 28, 0.96) 100%)",
      border: "1px solid rgba(148, 163, 184, 0.12)",
      boxShadow: "0 20px 56px rgba(2, 6, 23, 0.26)",
    },
    featureIcon: {
      width: "46px",
      height: "46px",
      borderRadius: "14px",
      display: "grid",
      placeItems: "center",
      background:
        "linear-gradient(135deg, rgba(56,189,248,0.18) 0%, rgba(99,102,241,0.18) 100%)",
      border: "1px solid rgba(99, 102, 241, 0.18)",
      marginBottom: "18px",
      color: "#e0f2fe",
      fontWeight: 900,
      fontSize: "18px",
    },
    featureTitle: {
      fontSize: "18px",
      fontWeight: 800,
      marginBottom: "10px",
      letterSpacing: "-0.025em",
    },
    featureText: {
      fontSize: "14px",
      lineHeight: 1.8,
      color: "rgba(226, 232, 240, 0.74)",
      margin: 0,
    },
    aiShell: {
      marginTop: "24px",
      borderRadius: "30px",
      padding: "24px",
      background:
        "linear-gradient(180deg, rgba(10, 15, 29, 0.86) 0%, rgba(8, 13, 26, 0.98) 100%)",
      border: "1px solid rgba(148, 163, 184, 0.12)",
      boxShadow: "0 28px 80px rgba(2, 6, 23, 0.34)",
    },
    aiVisualGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "18px",
      alignItems: "stretch",
    },
    aiScoreCard: {
      borderRadius: "24px",
      padding: "22px",
      background:
        "linear-gradient(180deg, rgba(15, 23, 42, 0.78) 0%, rgba(10, 17, 31, 0.98) 100%)",
      border: "1px solid rgba(148, 163, 184, 0.12)",
    },
    aiSmallLabel: {
      fontSize: "12px",
      color: "rgba(226, 232, 240, 0.64)",
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      fontWeight: 700,
      marginBottom: "8px",
    },
    aiBigScore: {
      fontSize: "42px",
      fontWeight: 900,
      lineHeight: 1,
      letterSpacing: "-0.05em",
      marginBottom: "18px",
    },
    aiMetricGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "14px",
      marginTop: "10px",
    },
    aiMetricCard: {
      borderRadius: "18px",
      padding: "16px",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(148, 163, 184, 0.10)",
    },
    aiMetricValue: {
      fontSize: "20px",
      fontWeight: 800,
      marginTop: "4px",
    },
    aiPriorityCard: {
      borderRadius: "24px",
      padding: "22px",
      background:
        "linear-gradient(180deg, rgba(15, 23, 42, 0.78) 0%, rgba(10, 17, 31, 0.98) 100%)",
      border: "1px solid rgba(148, 163, 184, 0.12)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    aiHotPill: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "10px 14px",
      borderRadius: "999px",
      background: "rgba(239,68,68,0.14)",
      border: "1px solid rgba(239,68,68,0.22)",
      color: "#fecaca",
      fontWeight: 800,
      fontSize: "12px",
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      alignSelf: "flex-start",
    },
    aiBodyText: {
      fontSize: "14px",
      lineHeight: 1.8,
      color: "rgba(226, 232, 240, 0.76)",
      marginTop: "16px",
    },
    aiActionWrap: {
      marginTop: "18px",
      padding: "16px",
      borderRadius: "18px",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(148, 163, 184, 0.10)",
    },
    ctaSection: {
      padding: "56px 0 86px",
    },
    ctaCard: {
      borderRadius: "34px",
      padding: "32px",
      background:
        "linear-gradient(135deg, rgba(56,189,248,0.12) 0%, rgba(99,102,241,0.12) 100%)",
      border: "1px solid rgba(99, 102, 241, 0.14)",
      boxShadow: "0 26px 80px rgba(2, 6, 23, 0.30)",
      textAlign: "center",
    },
    ctaTitle: {
      fontSize: "clamp(28px, 4vw, 44px)",
      fontWeight: 900,
      letterSpacing: "-0.045em",
      margin: "0 0 12px",
    },
    ctaText: {
      fontSize: "16px",
      lineHeight: 1.8,
      color: "rgba(226, 232, 240, 0.78)",
      maxWidth: "780px",
      margin: "0 auto 24px",
    },
    footer: {
      padding: "0 0 38px",
      color: "rgba(226, 232, 240, 0.58)",
      fontSize: "13px",
      textAlign: "center",
    },
  };

  const aiFeatures = [
    {
      icon: "01",
      title: "Lead profile strength",
      text: "Business name, contact detail quality, notes, and pipeline data all give the engine stronger confidence when ranking a lead.",
    },
    {
      icon: "02",
      title: "Pipeline stage weighting",
      text: "Leads deeper in the pipeline usually signal stronger intent, so Qualified, Proposal, and Negotiation can score higher than early Prospect.",
    },
    {
      icon: "03",
      title: "Commercial value + probability",
      text: "Estimated value and deal probability help surface opportunities that are not only likely to close, but worth the team’s attention.",
    },
  ];

  return (
    <div style={pageStyles.page}>
      <nav style={pageStyles.nav}>
        <div style={pageStyles.container}>
          <div style={pageStyles.navInner}>
            <div style={pageStyles.brandWrap}>
              <div style={pageStyles.brandIcon}>LR</div>
              <div>
                <p style={pageStyles.brandTitle}>LeadRadar</p>
                <div style={pageStyles.brandSub}>
                  Premium lead sourcing CRM
                </div>
              </div>
            </div>

            <div style={pageStyles.navLinks}>
              <a href="#features" style={pageStyles.navLink}>
                Features
              </a>
              <a href="#ai-engine" style={pageStyles.navLink}>
                AI Engine
              </a>
            </div>

            <div style={pageStyles.navActions}>
              <a href="/login" style={pageStyles.buttonGhost}>
                Sign In
              </a>
              <a href="/signup" style={pageStyles.buttonPrimary}>
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      <section style={pageStyles.hero}>
        <div style={pageStyles.container}>
          <div
            style={{
              ...pageStyles.heroGrid,
              gridTemplateColumns:
                typeof window !== "undefined" && window.innerWidth < 980
                  ? "1fr"
                  : pageStyles.heroGrid.gridTemplateColumns,
            }}
          >
            <div>
              <div style={pageStyles.chip}>
                LinkedIn-compliant sourcing workflow
              </div>

              <h1 style={pageStyles.heroTitle}>
                Build a cleaner, smarter{" "}
                <span style={pageStyles.gradientText}>lead pipeline</span> with
                LeadRadar.
              </h1>

              <p style={pageStyles.heroText}>
                LeadRadar helps businesses manage lead flow with a premium CRM
                experience built for visibility, control, and practical
                follow-up. From organized capture to pipeline clarity, it gives
                your team a more polished way to work.
              </p>

              <div style={pageStyles.heroActions}>
                <a href="/signup" style={pageStyles.buttonPrimary}>
                  Get Started
                </a>
                <a href="#ai-engine" style={pageStyles.buttonGhost}>
                  Explore AI Engine
                </a>
              </div>

              <div
                style={{
                  ...pageStyles.statRow,
                  gridTemplateColumns:
                    typeof window !== "undefined" && window.innerWidth < 760
                      ? "1fr"
                      : pageStyles.statRow.gridTemplateColumns,
                }}
              >
                <div style={pageStyles.statCard}>
                  <div style={pageStyles.statValue}>Premium CRM UX</div>
                  <div style={pageStyles.statLabel}>
                    Clean structure designed to make your sales process feel
                    more professional and more usable.
                  </div>
                </div>

                <div style={pageStyles.statCard}>
                  <div style={pageStyles.statValue}>Team-Ready</div>
                  <div style={pageStyles.statLabel}>
                    Support for workspaces, collaboration, notes, and cleaner
                    shared lead management.
                  </div>
                </div>

                <div style={pageStyles.statCard}>
                  <div style={pageStyles.statValue}>Client-Ready</div>
                  <div style={pageStyles.statLabel}>
                    Built to present well, scale better, and help close with
                    more confidence.
                  </div>
                </div>
              </div>
            </div>

            <div style={pageStyles.heroPanel}>
              <div style={pageStyles.panelHeader}>
                <div style={pageStyles.panelTitle}>LeadRadar Performance View</div>
                <div style={pageStyles.pill}>Live workflow ready</div>
              </div>

              <div style={pageStyles.panelGrid}>
                <div style={pageStyles.miniCard}>
                  <div style={pageStyles.miniLabel}>Lead Flow</div>
                  <div style={pageStyles.miniValue}>Organized</div>
                  <div style={pageStyles.miniText}>
                    Bring scattered lead handling into a single clean process.
                  </div>
                </div>

                <div style={pageStyles.miniCard}>
                  <div style={pageStyles.miniLabel}>Team Focus</div>
                  <div style={pageStyles.miniValue}>Sharper</div>
                  <div style={pageStyles.miniText}>
                    Better visibility makes follow-ups easier and more
                    intentional.
                  </div>
                </div>

                <div style={pageStyles.miniCard}>
                  <div style={pageStyles.miniLabel}>Quote Visibility</div>
                  <div style={pageStyles.miniValue}>Clear</div>
                  <div style={pageStyles.miniText}>
                    Track commercial movement with stronger pipeline awareness.
                  </div>
                </div>

                <div style={pageStyles.miniCard}>
                  <div style={pageStyles.miniLabel}>Growth Readiness</div>
                  <div style={pageStyles.miniValue}>Scalable</div>
                  <div style={pageStyles.miniText}>
                    Designed to support a more premium operational setup.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" style={pageStyles.section}>
        <div style={pageStyles.container}>
          <div style={pageStyles.sectionHeader}>
            <div style={pageStyles.sectionEyebrow}>Platform Features</div>
            <h2 style={pageStyles.sectionTitle}>
              A premium lead workflow built for modern teams
            </h2>
            <p style={pageStyles.sectionText}>
              LeadRadar combines structured lead tracking, practical team
              visibility, and polished workflow control into one strong
              operational platform.
            </p>
          </div>

          <div
            style={{
              ...pageStyles.featureGrid,
              gridTemplateColumns:
                typeof window !== "undefined" && window.innerWidth < 980
                  ? "1fr"
                  : window.innerWidth < 1180
                  ? "repeat(2, minmax(0, 1fr))"
                  : pageStyles.featureGrid.gridTemplateColumns,
            }}
          >
            <div style={pageStyles.featureCard}>
              <div style={pageStyles.featureIcon}>01</div>
              <div style={pageStyles.featureTitle}>Structured Pipeline</div>
              <p style={pageStyles.featureText}>
                Manage leads through clean stages, statuses, categories, notes,
                and timeline visibility without losing clarity.
              </p>
            </div>

            <div style={pageStyles.featureCard}>
              <div style={pageStyles.featureIcon}>02</div>
              <div style={pageStyles.featureTitle}>Team Collaboration</div>
              <p style={pageStyles.featureText}>
                Support shared workflows through workspaces, team context, and a
                more organized way to operate as your business grows.
              </p>
            </div>

            <div style={pageStyles.featureCard}>
              <div style={pageStyles.featureIcon}>03</div>
              <div style={pageStyles.featureTitle}>Import & Visibility</div>
              <p style={pageStyles.featureText}>
                Bring lead data into the platform and turn it into something far
                easier to manage, review, and act on.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="ai-engine" style={pageStyles.section}>
        <div style={pageStyles.container}>
          <div style={pageStyles.sectionHeader}>
            <div style={pageStyles.sectionEyebrow}>AI Engine</div>
            <h2 style={pageStyles.sectionTitle}>
              Real scoring that shows your team where to focus
            </h2>
            <p style={pageStyles.sectionText}>
              LeadRadar’s AI Engine evaluates each lead using pipeline position,
              deal probability, estimated value, and engagement signals to rank
              opportunities by real sales potential.
            </p>
          </div>

          <div style={pageStyles.aiShell}>
            <div
              style={{
                ...pageStyles.aiVisualGrid,
                gridTemplateColumns:
                  typeof window !== "undefined" && window.innerWidth < 980
                    ? "1fr"
                    : pageStyles.aiVisualGrid.gridTemplateColumns,
              }}
            >
              <div style={pageStyles.aiScoreCard}>
                <div style={pageStyles.aiSmallLabel}>AI Score</div>
                <div style={pageStyles.aiBigScore}>87 / 100</div>

                <div style={pageStyles.aiMetricGrid}>
                  <div style={pageStyles.aiMetricCard}>
                    <div style={pageStyles.aiSmallLabel}>Deal Probability</div>
                    <div style={pageStyles.aiMetricValue}>72%</div>
                  </div>

                  <div style={pageStyles.aiMetricCard}>
                    <div style={pageStyles.aiSmallLabel}>Forecast Value</div>
                    <div style={pageStyles.aiMetricValue}>R156.000</div>
                  </div>
                </div>
              </div>

              <div style={pageStyles.aiPriorityCard}>
                <div>
                  <div style={pageStyles.aiHotPill}>Hot Priority</div>
                  <div style={pageStyles.aiBodyText}>
                    This lead ranks high because it combines stronger commercial
                    value, higher conversion probability, and better pipeline
                    position than lower-priority leads.
                  </div>
                </div>

                <div style={pageStyles.aiActionWrap}>
                  <div style={pageStyles.aiSmallLabel}>Next Best Action</div>
                  <div style={{ fontSize: "16px", fontWeight: 800 }}>
                    Send proposal follow-up
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                ...pageStyles.featureGrid,
                marginTop: "22px",
                gridTemplateColumns:
                  typeof window !== "undefined" && window.innerWidth < 980
                    ? "1fr"
                    : pageStyles.featureGrid.gridTemplateColumns,
              }}
            >
              {aiFeatures.map((feature) => (
                <div key={feature.title} style={pageStyles.featureCard}>
                  <div style={pageStyles.featureIcon}>{feature.icon}</div>
                  <div style={pageStyles.featureTitle}>{feature.title}</div>
                  <p style={pageStyles.featureText}>{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={pageStyles.ctaSection}>
        <div style={pageStyles.container}>
          <div style={pageStyles.ctaCard}>
            <h2 style={pageStyles.ctaTitle}>
              Turn your lead process into a premium sales system
            </h2>
            <p style={pageStyles.ctaText}>
              LeadRadar is designed for businesses that want a cleaner workflow,
              stronger visibility, and a more polished way to manage
              opportunities from first capture to final close.
            </p>
            <div
              style={{
                display: "flex",
                gap: "14px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a href="/signup" style={pageStyles.buttonPrimary}>
                Get Started
              </a>
              <a href="/login" style={pageStyles.buttonGhost}>
                Sign In
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer style={pageStyles.footer}>
        <div style={pageStyles.container}>
          © {new Date().getFullYear()} LeadRadar. Premium lead workflow
          infrastructure for modern teams.
        </div>
      </footer>
    </div>
  );
}