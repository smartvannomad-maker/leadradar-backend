import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Files,
  Globe,
  LayoutDashboard,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const features = [
  {
    icon: ShieldCheck,
    title: "LinkedIn-compliant sourcing",
    text: "Manual save flows, user-triggered actions, CSV imports, and clean compliant outreach workflows.",
  },
  {
    icon: LayoutDashboard,
    title: "Modern CRM workspace",
    text: "Track leads, notes, pipeline stages, templates, follow-ups, and quotes inside one premium dashboard.",
  },
  {
    icon: Users,
    title: "Team workspaces",
    text: "Invite team members into a shared workspace and collaborate on a single lead pipeline.",
  },
  {
    icon: Files,
    title: "Bulk CSV import",
    text: "Bring in lead lists fast, avoid duplicate clutter, and get moving without tedious manual entry.",
  },
  {
    icon: BarChart3,
    title: "SaaS-style metrics",
    text: "See pipeline value, follow-up visibility, conversion signals, and activity from a clean KPI layer.",
  },
  {
    icon: Zap,
    title: "Built to automate later",
    text: "Structured for future workflow automation, team management, billing, and scalable product growth.",
  },
];

const plans = [
  {
    name: "Starter",
    price: "R0",
    period: "/month",
    description: "For solo users testing the workflow.",
    highlight: false,
    cta: "Start Free",
    features: [
      "1 workspace owner",
      "Up to 100 leads",
      "Basic dashboard metrics",
      "Manual lead entry",
      "CSV import",
    ],
  },
  {
    name: "Pro",
    price: "R799",
    period: "/month",
    description: "For growing teams that need shared pipeline visibility.",
    highlight: true,
    cta: "Start Pro",
    features: [
      "Team members",
      "Unlimited leads",
      "Advanced pipeline metrics",
      "CSV import + templates",
      "Invite-based workspace access",
    ],
  },
  {
    name: "Scale",
    price: "Custom",
    period: "",
    description: "For agencies, operators, and custom rollout projects.",
    highlight: false,
    cta: "Book Demo",
    features: [
      "Custom onboarding",
      "Custom branding",
      "Priority support",
      "Workflow customization",
      "Implementation assistance",
    ],
  },
];

const stats = [
  { label: "Compliant sourcing", value: "100%" },
  { label: "Team-ready direction", value: "Multi-user" },
  { label: "Import speed", value: "CSV-ready" },
  { label: "Product posture", value: "SaaS" },
];

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, rgba(59,130,246,0.14), transparent 28%), radial-gradient(circle at top right, rgba(99,102,241,0.14), transparent 24%), linear-gradient(180deg, #f8fbff 0%, #f8fafc 100%)",
    color: "#0f172a",
  },
  shell: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "0 24px",
  },
  headerWrap: {
    position: "sticky",
    top: 0,
    zIndex: 40,
    paddingTop: 16,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    padding: "16px 20px",
    borderRadius: 28,
    border: "1px solid rgba(255,255,255,0.6)",
    background: "rgba(255,255,255,0.78)",
    boxShadow: "0 12px 40px rgba(15,23,42,0.06)",
    backdropFilter: "blur(16px)",
    flexWrap: "wrap",
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
    color: "#fff",
    fontWeight: 900,
    fontSize: 14,
    boxShadow: "0 14px 30px rgba(59,130,246,0.24)",
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: 900,
    letterSpacing: "-0.03em",
    color: "#020617",
  },
  brandSub: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: 600,
  },
  nav: {
    display: "flex",
    gap: 28,
    alignItems: "center",
    flexWrap: "wrap",
  },
  navLink: {
    fontSize: 14,
    fontWeight: 700,
    color: "#475569",
    textDecoration: "none",
  },
  actionRow: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    flexWrap: "wrap",
  },
  ghostButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 16px",
    borderRadius: 16,
    border: "1px solid #e2e8f0",
    background: "#fff",
    color: "#334155",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 14,
  },
  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "10px 16px",
    borderRadius: 16,
    background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: 14,
    boxShadow: "0 12px 30px rgba(59,130,246,0.24)",
  },
  heroSection: {
    paddingTop: 72,
    paddingBottom: 90,
  },
  heroGrid: {
    display: "grid",
    gridTemplateColumns: "1.15fr 0.85fr",
    gap: 48,
    alignItems: "center",
  },
  pill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 16px",
    borderRadius: 999,
    border: "1px solid #dbeafe",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontSize: 14,
    fontWeight: 700,
    boxShadow: "0 4px 14px rgba(15,23,42,0.05)",
  },
  heroTitle: {
    marginTop: 24,
    fontSize: 72,
    lineHeight: 1,
    fontWeight: 900,
    letterSpacing: "-0.05em",
    color: "#020617",
    maxWidth: 760,
  },
  heroText: {
    marginTop: 24,
    fontSize: 21,
    lineHeight: 1.7,
    color: "#475569",
    maxWidth: 760,
  },
  heroActions: {
    marginTop: 32,
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
  },
  heroPrimary: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "16px 24px",
    borderRadius: 18,
    background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 800,
    fontSize: 16,
    boxShadow: "0 20px 40px rgba(59,130,246,0.26)",
  },
  heroSecondary: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "16px 24px",
    borderRadius: 18,
    border: "1px solid #e2e8f0",
    background: "#fff",
    color: "#334155",
    textDecoration: "none",
    fontWeight: 800,
    fontSize: 16,
  },
  statsGrid: {
    marginTop: 40,
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: 16,
    maxWidth: 820,
  },
  statCard: {
    borderRadius: 24,
    border: "1px solid rgba(255,255,255,0.75)",
    background: "rgba(255,255,255,0.85)",
    padding: 20,
    boxShadow: "0 14px 34px rgba(15,23,42,0.05)",
    backdropFilter: "blur(8px)",
  },
  statValue: {
    fontSize: 28,
    fontWeight: 900,
    letterSpacing: "-0.03em",
    color: "#020617",
  },
  statLabel: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: 600,
    color: "#64748b",
  },
  previewOuter: {
    position: "relative",
  },
  previewGlow: {
    position: "absolute",
    inset: -16,
    borderRadius: 40,
    background: "linear-gradient(135deg, rgba(191,219,254,0.55), rgba(199,210,254,0.45))",
    filter: "blur(30px)",
  },
  previewWrap: {
    position: "relative",
    overflow: "hidden",
    borderRadius: 32,
    border: "1px solid rgba(255,255,255,0.6)",
    background: "rgba(255,255,255,0.88)",
    padding: 20,
    boxShadow: "0 20px 70px rgba(15,23,42,0.1)",
    backdropFilter: "blur(16px)",
  },
  previewInner: {
    borderRadius: 24,
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    padding: 20,
  },
  previewTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    flexWrap: "wrap",
  },
  previewEyebrow: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#64748b",
  },
  previewTitle: {
    marginTop: 10,
    fontSize: 30,
    fontWeight: 800,
    color: "#020617",
  },
  previewPlan: {
    borderRadius: 16,
    background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
    color: "#fff",
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 800,
  },
  previewMetrics: {
    marginTop: 24,
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 14,
  },
  miniCard: {
    borderRadius: 18,
    border: "1px solid #e2e8f0",
    background: "#fff",
    padding: 16,
    boxShadow: "0 8px 20px rgba(15,23,42,0.04)",
  },
  miniLabel: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: 700,
  },
  miniValue: {
    marginTop: 10,
    fontSize: 30,
    fontWeight: 900,
    letterSpacing: "-0.04em",
    color: "#020617",
  },
  previewSplit: {
    marginTop: 22,
    display: "grid",
    gridTemplateColumns: "1fr 0.95fr",
    gap: 16,
  },
  listCard: {
    borderRadius: 18,
    border: "1px solid #e2e8f0",
    background: "#fff",
    padding: 16,
    boxShadow: "0 8px 20px rgba(15,23,42,0.04)",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 800,
    color: "#0f172a",
  },
  listRows: {
    marginTop: 16,
    display: "grid",
    gap: 12,
  },
  listRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    borderRadius: 16,
    border: "1px solid #f1f5f9",
    padding: "12px 14px",
  },
  listName: {
    fontSize: 15,
    fontWeight: 700,
    color: "#0f172a",
  },
  listMeta: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 4,
  },
  listValue: {
    fontSize: 14,
    fontWeight: 800,
    color: "#1d4ed8",
  },
  progressWrap: {
    marginTop: 18,
    display: "grid",
    gap: 16,
  },
  progressHeader: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 14,
    fontWeight: 600,
    color: "#475569",
    marginBottom: 8,
  },
  progressTrack: {
    height: 12,
    borderRadius: 999,
    background: "#e2e8f0",
    overflow: "hidden",
  },
  section: {
    padding: "70px 0",
  },
  sectionHeadingWrap: {
    maxWidth: 760,
  },
  sectionEyebrow: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 999,
    border: "1px solid #e2e8f0",
    background: "rgba(255,255,255,0.85)",
    padding: "8px 14px",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#1d4ed8",
    boxShadow: "0 4px 14px rgba(15,23,42,0.04)",
  },
  sectionTitle: {
    marginTop: 20,
    fontSize: 52,
    lineHeight: 1.08,
    fontWeight: 800,
    letterSpacing: "-0.04em",
    color: "#020617",
  },
  sectionText: {
    marginTop: 18,
    fontSize: 18,
    lineHeight: 1.8,
    color: "#475569",
  },
  featureGrid: {
    marginTop: 40,
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 20,
  },
  featureCard: {
    borderRadius: 28,
    border: "1px solid rgba(255,255,255,0.75)",
    background: "rgba(255,255,255,0.88)",
    padding: 24,
    boxShadow: "0 14px 34px rgba(15,23,42,0.05)",
    backdropFilter: "blur(8px)",
  },
  featureIcon: {
    display: "inline-flex",
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
    color: "#fff",
    boxShadow: "0 12px 24px rgba(59,130,246,0.24)",
  },
  featureTitle: {
    marginTop: 18,
    fontSize: 22,
    fontWeight: 800,
    color: "#020617",
  },
  featureText: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 1.8,
    color: "#475569",
  },
  whyGrid: {
    display: "grid",
    gridTemplateColumns: "0.95fr 1.05fr",
    gap: 42,
    alignItems: "center",
  },
  whyCards: {
    display: "grid",
    gap: 16,
  },
  whyCard: {
    display: "flex",
    gap: 16,
    alignItems: "flex-start",
    borderRadius: 28,
    border: "1px solid rgba(255,255,255,0.75)",
    background: "rgba(255,255,255,0.88)",
    padding: 20,
    boxShadow: "0 14px 34px rgba(15,23,42,0.05)",
  },
  whyText: {
    fontSize: 16,
    lineHeight: 1.8,
    color: "#334155",
  },
  pricingGrid: {
    marginTop: 40,
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 24,
  },
  pricingCard: {
    position: "relative",
    borderRadius: 32,
    padding: 28,
    boxShadow: "0 18px 50px rgba(15,23,42,0.06)",
    border: "1px solid rgba(255,255,255,0.75)",
    background: "rgba(255,255,255,0.88)",
    color: "#0f172a",
  },
  pricingCardFeatured: {
    position: "relative",
    borderRadius: 32,
    padding: 28,
    boxShadow: "0 18px 50px rgba(15,23,42,0.12)",
    border: "1px solid #bfdbfe",
    background: "linear-gradient(180deg, #2563eb 0%, #4338ca 100%)",
    color: "#fff",
  },
  pricingBadge: {
    position: "absolute",
    right: 20,
    top: 20,
    borderRadius: 999,
    padding: "6px 12px",
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    background: "rgba(255,255,255,0.18)",
    color: "#fff",
  },
  pricingName: {
    fontSize: 22,
    fontWeight: 800,
  },
  pricingDesc: {
    marginTop: 12,
    fontSize: 14,
    lineHeight: 1.8,
    color: "inherit",
    opacity: 0.9,
  },
  pricingPriceRow: {
    marginTop: 26,
    display: "flex",
    alignItems: "flex-end",
    gap: 8,
  },
  pricingPrice: {
    fontSize: 52,
    fontWeight: 900,
    lineHeight: 1,
    letterSpacing: "-0.05em",
  },
  pricingPeriod: {
    paddingBottom: 8,
    fontSize: 14,
    fontWeight: 700,
    opacity: 0.86,
  },
  pricingFeatures: {
    marginTop: 28,
    display: "grid",
    gap: 16,
  },
  pricingFeatureRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
  },
  pricingBtnDark: {
    display: "inline-flex",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 28,
    borderRadius: 18,
    padding: "14px 18px",
    background: "#020617",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 800,
    fontSize: 14,
  },
  pricingBtnLight: {
    display: "inline-flex",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 28,
    borderRadius: 18,
    padding: "14px 18px",
    background: "#fff",
    color: "#020617",
    textDecoration: "none",
    fontWeight: 800,
    fontSize: 14,
  },
  ctaSection: {
    paddingTop: 24,
    paddingBottom: 90,
  },
  ctaCard: {
    overflow: "hidden",
    borderRadius: 32,
    border: "1px solid rgba(255,255,255,0.7)",
    background: "linear-gradient(90deg, #020617 0%, #172554 52%, #312e81 100%)",
    color: "#fff",
    padding: 48,
    boxShadow: "0 20px 70px rgba(15,23,42,0.18)",
  },
  ctaGrid: {
    display: "grid",
    gridTemplateColumns: "1fr auto",
    gap: 32,
    alignItems: "center",
  },
  ctaEyebrow: {
    display: "inline-flex",
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.1)",
    padding: "8px 14px",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#dbeafe",
  },
  ctaTitle: {
    marginTop: 20,
    fontSize: 54,
    lineHeight: 1.06,
    fontWeight: 900,
    letterSpacing: "-0.05em",
  },
  ctaText: {
    marginTop: 16,
    maxWidth: 760,
    fontSize: 18,
    lineHeight: 1.8,
    color: "rgba(219,234,254,0.92)",
  },
  ctaActions: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  ctaPrimary: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 18,
    background: "#fff",
    color: "#020617",
    textDecoration: "none",
    fontWeight: 800,
    padding: "16px 20px",
  },
  ctaSecondary: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.2)",
    background: "rgba(255,255,255,0.1)",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 800,
    padding: "16px 20px",
  },
};

function SectionHeading({ eyebrow, title, text }) {
  return (
    <div style={styles.sectionHeadingWrap}>
      <div style={styles.sectionEyebrow}>{eyebrow}</div>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <p style={styles.sectionText}>{text}</p>
    </div>
  );
}

function responsiveStyles() {
  return `
    @media (max-width: 1180px) {
      .lr-hero-grid,
      .lr-why-grid,
      .lr-cta-grid,
      .lr-preview-split {
        grid-template-columns: 1fr !important;
      }

      .lr-feature-grid,
      .lr-pricing-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      }
    }

    @media (max-width: 900px) {
      .lr-nav {
        display: none !important;
      }

      .lr-hero-title {
        font-size: 52px !important;
      }

      .lr-preview-metrics,
      .lr-stats-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      }

      .lr-feature-grid,
      .lr-pricing-grid {
        grid-template-columns: 1fr !important;
      }

      .lr-section-title,
      .lr-cta-title {
        font-size: 40px !important;
      }
    }

    @media (max-width: 640px) {
      .lr-shell {
        padding: 0 16px !important;
      }

      .lr-header {
        padding: 14px 16px !important;
      }

      .lr-hero-title {
        font-size: 40px !important;
      }

      .lr-hero-text,
      .lr-section-text,
      .lr-cta-text {
        font-size: 16px !important;
      }

      .lr-preview-metrics,
      .lr-stats-grid {
        grid-template-columns: 1fr !important;
      }

      .lr-preview-title {
        font-size: 24px !important;
      }

      .lr-section-title,
      .lr-cta-title {
        font-size: 32px !important;
      }

      .lr-hero-actions,
      .lr-action-row {
        flex-direction: column;
        align-items: stretch;
      }

      .lr-cta-actions {
        width: 100%;
      }
    }
  `;
}

export default function LandingPage() {
  return (
    <div style={styles.page}>
      <style>{responsiveStyles()}</style>

      <div className="lr-shell" style={styles.shell}>
        <div style={styles.headerWrap}>
          <header className="lr-header" style={styles.header}>
            <div style={styles.brandRow}>
              <div style={styles.logoBadge}>LR</div>
              <div>
                <div style={styles.brandTitle}>LeadRadar</div>
                <div style={styles.brandSub}>LinkedIn-compliant sourcing CRM</div>
              </div>
            </div>

            <nav className="lr-nav" style={styles.nav}>
              <a href="#features" style={styles.navLink}>
                Features
              </a>
              <a href="#pricing" style={styles.navLink}>
                Pricing
              </a>
              <a href="#why" style={styles.navLink}>
                Why LeadRadar
              </a>
            </nav>

            <div className="lr-action-row" style={styles.actionRow}>
              <Link to="/login" style={styles.ghostButton}>
                Sign In
              </Link>
              <Link to="/signup" style={styles.primaryButton}>
                Start Free
                <ArrowRight size={16} />
              </Link>
            </div>
          </header>
        </div>

        <main>
          <section style={styles.heroSection}>
            <div className="lr-hero-grid" style={styles.heroGrid}>
              <motion.div variants={container} initial="hidden" animate="show">
                <motion.div variants={fadeUp} style={styles.pill}>
                  <Globe size={16} />
                  Built for compliant outbound growth
                </motion.div>

                <motion.h1
                  variants={fadeUp}
                  className="lr-hero-title"
                  style={styles.heroTitle}
                >
                  Premium lead sourcing software for modern teams.
                </motion.h1>

                <motion.p variants={fadeUp} style={styles.heroText}>
                  LeadRadar gives you a clean SaaS workspace to source, track, import,
                  manage, and convert leads without messy spreadsheets or non-compliant workflows.
                </motion.p>

                <motion.div variants={fadeUp} className="lr-hero-actions" style={styles.heroActions}>
                  <Link to="/signup" style={styles.heroPrimary}>
                    Create Workspace
                    <ArrowRight size={18} />
                  </Link>

                  <a href="#pricing" style={styles.heroSecondary}>
                    View Pricing
                    <ChevronRight size={18} />
                  </a>
                </motion.div>

                <motion.div variants={fadeUp} className="lr-stats-grid" style={styles.statsGrid}>
                  {stats.map((stat) => (
                    <div key={stat.label} style={styles.statCard}>
                      <div style={styles.statValue}>{stat.value}</div>
                      <div style={styles.statLabel}>{stat.label}</div>
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                style={styles.previewOuter}
              >
                <div style={styles.previewGlow} />
                <div style={styles.previewWrap}>
                  <div style={styles.previewInner}>
                    <div style={styles.previewTop}>
                      <div>
                        <div style={styles.previewEyebrow}>Dashboard Snapshot</div>
                        <div className="lr-preview-title" style={styles.previewTitle}>
                          Team pipeline overview
                        </div>
                      </div>

                      <div style={styles.previewPlan}>Pro Workspace</div>
                    </div>

                    <div className="lr-preview-metrics" style={styles.previewMetrics}>
                      {[
                        ["Total Leads", "284"],
                        ["Pipeline Value", "R 482k"],
                        ["Follow-ups Today", "19"],
                      ].map(([label, value]) => (
                        <div key={label} style={styles.miniCard}>
                          <div style={styles.miniLabel}>{label}</div>
                          <div style={styles.miniValue}>{value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="lr-preview-split" style={styles.previewSplit}>
                      <div style={styles.listCard}>
                        <div style={styles.cardTitle}>Recent Leads</div>
                        <div style={styles.listRows}>
                          {[
                            ["Acme Logistics", "Qualified", "R 28,000"],
                            ["Blue Peak Media", "Proposal", "R 17,500"],
                            ["Vista Advisory", "New Lead", "R 12,000"],
                          ].map(([name, stage, value]) => (
                            <div key={name} style={styles.listRow}>
                              <div>
                                <div style={styles.listName}>{name}</div>
                                <div style={styles.listMeta}>{stage}</div>
                              </div>
                              <div style={styles.listValue}>{value}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div style={styles.listCard}>
                        <div style={styles.cardTitle}>Workspace value</div>
                        <div style={styles.progressWrap}>
                          {[
                            ["Compliance-first sourcing", 92],
                            ["Team collaboration", 78],
                            ["Data readiness", 84],
                          ].map(([label, width]) => (
                            <div key={label}>
                              <div style={styles.progressHeader}>
                                <span>{label}</span>
                                <span>{width}%</span>
                              </div>
                              <div style={styles.progressTrack}>
                                <div
                                  style={{
                                    width: `${width}%`,
                                    height: "100%",
                                    borderRadius: 999,
                                    background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          <section id="features" style={styles.section}>
            <SectionHeading
              eyebrow="Core Product"
              title="Everything you need to run a cleaner lead engine."
              text="LeadRadar is designed to feel like a premium SaaS product from the start, with the flexibility to evolve into a more advanced platform later."
            />

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="lr-feature-grid"
              style={styles.featureGrid}
            >
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <motion.div key={feature.title} variants={fadeUp} style={styles.featureCard}>
                    <div style={styles.featureIcon}>
                      <Icon size={20} />
                    </div>
                    <div style={styles.featureTitle}>{feature.title}</div>
                    <div style={styles.featureText}>{feature.text}</div>
                  </motion.div>
                );
              })}
            </motion.div>
          </section>

          <section id="why" style={styles.section}>
            <div className="lr-why-grid" style={styles.whyGrid}>
              <SectionHeading
                eyebrow="Why LeadRadar"
                title="A polished CRM foundation you can actually grow into."
                text="Built for founders, operators, agencies, and growth teams who want a focused sourcing CRM without the clutter of enterprise-heavy tools."
              />

              <div style={styles.whyCards}>
                {[
                  "Create a new workspace and become the owner automatically.",
                  "Invite team members into the same workspace for shared visibility.",
                  "Import leads quickly and avoid messy spreadsheet handoffs.",
                  "Track pipeline value, follow-ups, and stage movement from one place.",
                  "Position the product for future billing, automation, and client rollouts.",
                ].map((item) => (
                  <div key={item} style={styles.whyCard}>
                    <div
                      style={{
                        marginTop: 2,
                        display: "inline-flex",
                        padding: 8,
                        borderRadius: 999,
                        background: "#ecfdf5",
                        color: "#059669",
                      }}
                    >
                      <CheckCircle2 size={18} />
                    </div>
                    <div style={styles.whyText}>{item}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="pricing" style={styles.section}>
            <SectionHeading
              eyebrow="Pricing"
              title="Simple pricing for solo builders and growing teams."
              text="Start free, move into a shared Pro workspace when you need team collaboration, and use custom rollout pricing for implementation-heavy projects."
            />

            <div className="lr-pricing-grid" style={styles.pricingGrid}>
              {plans.map((plan) => {
                const featured = plan.highlight;

                return (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, y: 22 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5 }}
                    style={featured ? styles.pricingCardFeatured : styles.pricingCard}
                  >
                    {featured ? <div style={styles.pricingBadge}>Most Popular</div> : null}

                    <div style={styles.pricingName}>{plan.name}</div>
                    <div style={styles.pricingDesc}>{plan.description}</div>

                    <div style={styles.pricingPriceRow}>
                      <div style={styles.pricingPrice}>{plan.price}</div>
                      <div style={styles.pricingPeriod}>{plan.period}</div>
                    </div>

                    <div style={styles.pricingFeatures}>
                      {plan.features.map((feature) => (
                        <div key={feature} style={styles.pricingFeatureRow}>
                          <CheckCircle2 size={18} color={featured ? "#ffffff" : "#059669"} />
                          <span style={{ fontSize: 14, lineHeight: 1.8, opacity: 0.95 }}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    <Link
                      to={plan.name === "Scale" ? "/login" : "/signup"}
                      style={featured ? styles.pricingBtnLight : styles.pricingBtnDark}
                    >
                      {plan.cta}
                      <ArrowRight size={16} />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </section>

          <section style={styles.ctaSection}>
            <div style={styles.ctaCard}>
              <div className="lr-cta-grid" style={styles.ctaGrid}>
                <div>
                  <div style={styles.ctaEyebrow}>Ready to launch</div>
                  <div className="lr-cta-title" style={styles.ctaTitle}>
                    Start with a clean workspace. Scale into a real product.
                  </div>
                  <div style={styles.ctaText}>
                    Create a workspace, invite your team, import your leads, and run a premium sourcing workflow from day one.
                  </div>
                </div>

                <div className="lr-cta-actions" style={styles.ctaActions}>
                  <Link to="/signup" style={styles.ctaPrimary}>
                    Start Free
                    <ArrowRight size={16} />
                  </Link>

                  <Link to="/login" style={styles.ctaSecondary}>
                    Sign In
                    <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}