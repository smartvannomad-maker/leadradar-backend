export const authStyles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "1.08fr 0.92fr",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    background:
      "radial-gradient(circle at top left, rgba(59,130,246,0.14), transparent 28%), radial-gradient(circle at bottom right, rgba(99,102,241,0.12), transparent 26%), linear-gradient(180deg, #f8fbff 0%, #eef4fb 100%)",
  },

  brandPanel: {
    position: "relative",
    overflow: "hidden",
    padding: "56px 48px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    background:
      "linear-gradient(135deg, rgba(15,23,42,0.96) 0%, rgba(30,41,59,0.94) 45%, rgba(37,99,235,0.90) 100%)",
    color: "#ffffff",
  },

  brandGlowOne: {
    position: "absolute",
    top: "-140px",
    left: "-120px",
    width: "320px",
    height: "320px",
    borderRadius: "999px",
    background: "rgba(59,130,246,0.28)",
    filter: "blur(30px)",
  },

  brandGlowTwo: {
    position: "absolute",
    bottom: "-120px",
    right: "-100px",
    width: "280px",
    height: "280px",
    borderRadius: "999px",
    background: "rgba(99,102,241,0.26)",
    filter: "blur(26px)",
  },

  brandTop: {
    position: "relative",
    zIndex: 1,
  },

  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "22px",
  },

  logoBadge: {
    width: "56px",
    height: "56px",
    borderRadius: "18px",
    background: "linear-gradient(135deg, #ffffff 0%, #dbeafe 100%)",
    color: "#1d4ed8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
    fontSize: "20px",
    letterSpacing: "-0.03em",
    boxShadow: "0 18px 36px rgba(15,23,42,0.24)",
  },

  logoTextWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },

  logoText: {
    fontSize: "22px",
    fontWeight: 800,
    letterSpacing: "-0.03em",
    margin: 0,
  },

  logoSub: {
    margin: 0,
    fontSize: "13px",
    color: "rgba(255,255,255,0.72)",
    fontWeight: 500,
  },

  heroTitle: {
    margin: "26px 0 14px",
    fontSize: "48px",
    lineHeight: 1.02,
    fontWeight: 900,
    letterSpacing: "-0.05em",
    maxWidth: "520px",
  },

  heroText: {
    margin: 0,
    maxWidth: "520px",
    fontSize: "17px",
    lineHeight: 1.7,
    color: "rgba(255,255,255,0.82)",
  },

  featureGrid: {
    position: "relative",
    zIndex: 1,
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "14px",
    marginTop: "34px",
    maxWidth: "560px",
  },

  featureCard: {
    padding: "16px 16px 18px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.12)",
    backdropFilter: "blur(10px)",
  },

  featureTitle: {
    margin: "0 0 6px",
    fontSize: "14px",
    fontWeight: 800,
    color: "#ffffff",
  },

  featureText: {
    margin: 0,
    fontSize: "13px",
    lineHeight: 1.6,
    color: "rgba(255,255,255,0.74)",
  },

  brandBottom: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginTop: "36px",
  },

  bottomBadge: {
    padding: "10px 14px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.86)",
    fontSize: "13px",
    fontWeight: 700,
  },

  formPanel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 28px",
  },

  formCard: {
    width: "100%",
    maxWidth: "480px",
    background: "rgba(255,255,255,0.96)",
    border: "1px solid rgba(226,232,240,0.95)",
    borderRadius: "28px",
    padding: "34px",
    boxShadow: "0 24px 60px rgba(15,23,42,0.10)",
    backdropFilter: "blur(12px)",
  },

  formEyebrow: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: "999px",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontSize: "12px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    marginBottom: "14px",
  },

  formTitle: {
    margin: "0 0 10px",
    fontSize: "34px",
    lineHeight: 1.05,
    fontWeight: 900,
    letterSpacing: "-0.04em",
    color: "#0f172a",
  },

  formSubtext: {
    margin: "0 0 24px",
    color: "#64748b",
    fontSize: "15px",
    lineHeight: 1.6,
  },

  fieldWrap: {
    marginBottom: "14px",
  },

  label: {
    display: "block",
    marginBottom: "8px",
    color: "#334155",
    fontSize: "14px",
    fontWeight: 700,
  },

  input: {
    width: "100%",
    padding: "14px 15px",
    borderRadius: "16px",
    border: "1px solid #dbe4ee",
    fontSize: "14px",
    fontWeight: 500,
    boxSizing: "border-box",
    background: "#ffffff",
    color: "#0f172a",
    outline: "none",
    boxShadow: "inset 0 1px 2px rgba(15,23,42,0.02)",
  },

  helperRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    alignItems: "center",
    marginBottom: "18px",
    flexWrap: "wrap",
  },

  helperText: {
    margin: 0,
    color: "#64748b",
    fontSize: "13px",
  },

  errorBox: {
    marginBottom: "16px",
    padding: "12px 14px",
    borderRadius: "14px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    fontSize: "14px",
    fontWeight: 600,
  },

  successBox: {
    marginBottom: "16px",
    padding: "12px 14px",
    borderRadius: "14px",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#15803d",
    fontSize: "14px",
    fontWeight: 600,
  },

  primaryButton: {
    width: "100%",
    padding: "14px 18px",
    borderRadius: "16px",
    border: "none",
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: 800,
    fontSize: "15px",
    boxShadow: "0 16px 30px rgba(37,99,235,0.22)",
  },

  secondaryLinkRow: {
    marginTop: "18px",
    textAlign: "center",
    color: "#64748b",
    fontSize: "14px",
  },

  link: {
    color: "#2563eb",
    fontWeight: 700,
    textDecoration: "none",
  },
};