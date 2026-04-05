export const styles = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, rgba(59,130,246,0.10), transparent 24%), radial-gradient(circle at top right, rgba(99,102,241,0.10), transparent 20%), linear-gradient(180deg, #f8fbff 0%, #f8fafc 100%)",
  },

  container: {
    maxWidth: 1440,
    margin: "0 auto",
    padding: "24px",
  },

  shell: {
    display: "grid",
    gridTemplateColumns: "290px minmax(0, 1fr)",
    gap: 24,
    alignItems: "start",
  },

  content: {
    minWidth: 0,
    display: "grid",
    gap: 24,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    flexWrap: "wrap",
    padding: "24px 26px",
    borderRadius: 30,
    border: "1px solid rgba(255,255,255,0.7)",
    background: "rgba(255,255,255,0.82)",
    boxShadow: "0 18px 50px rgba(15,23,42,0.07)",
    backdropFilter: "blur(14px)",
  },

  mainTitle: {
    margin: 0,
    fontSize: 28,
    lineHeight: 1.1,
    fontWeight: 900,
    letterSpacing: "-0.04em",
    color: "#020617",
  },

  subText: {
    margin: "8px 0 0",
    fontSize: 15,
    lineHeight: 1.6,
    color: "#64748b",
  },

  logoutButton: {
    border: "none",
    borderRadius: 18,
    padding: "12px 18px",
    background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
    color: "#fff",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 12px 24px rgba(59,130,246,0.22)",
  },

  sectionCard: {
    borderRadius: 28,
    border: "1px solid rgba(255,255,255,0.72)",
    background: "rgba(255,255,255,0.86)",
    padding: 24,
    boxShadow: "0 14px 34px rgba(15,23,42,0.05)",
    backdropFilter: "blur(10px)",
  },

  cardTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: "-0.03em",
    color: "#020617",
  },

  cardText: {
    margin: "10px 0 0",
    fontSize: 15,
    lineHeight: 1.7,
    color: "#64748b",
  },

  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 18,
  },

  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 18,
  },

  statCard: {
    borderRadius: 24,
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    padding: 20,
    boxShadow: "0 10px 24px rgba(15,23,42,0.04)",
  },

  statLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },

  statValue: {
    marginTop: 10,
    fontSize: 34,
    fontWeight: 900,
    lineHeight: 1,
    letterSpacing: "-0.05em",
    color: "#020617",
  },

  statMeta: {
    marginTop: 8,
    fontSize: 14,
    color: "#64748b",
  },

  toolbarCard: {
    borderRadius: 24,
    border: "1px solid #e2e8f0",
    background: "#ffffff",
    padding: 18,
    boxShadow: "0 10px 24px rgba(15,23,42,0.04)",
  },

  label: {
    display: "block",
    marginBottom: 8,
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: "0.02em",
    color: "#334155",
  },

  input: {
    width: "100%",
    border: "1px solid #cbd5e1",
    borderRadius: 16,
    padding: "13px 15px",
    fontSize: 14,
    color: "#0f172a",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
  },

  select: {
    width: "100%",
    border: "1px solid #cbd5e1",
    borderRadius: 16,
    padding: "13px 15px",
    fontSize: 14,
    color: "#0f172a",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    minHeight: 120,
    border: "1px solid #cbd5e1",
    borderRadius: 16,
    padding: "13px 15px",
    fontSize: 14,
    color: "#0f172a",
    background: "#fff",
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
  },

  primaryButton: {
    border: "none",
    borderRadius: 18,
    padding: "13px 18px",
    background: "linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)",
    color: "#fff",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
    boxShadow: "0 12px 24px rgba(59,130,246,0.22)",
  },

  secondaryButton: {
    border: "1px solid #dbeafe",
    borderRadius: 18,
    padding: "13px 18px",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
  },

  dangerButton: {
    border: "none",
    borderRadius: 18,
    padding: "13px 18px",
    background: "#dc2626",
    color: "#fff",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
  },

  tableWrap: {
    overflowX: "auto",
    borderRadius: 22,
    border: "1px solid #e2e8f0",
    background: "#fff",
    boxShadow: "0 10px 24px rgba(15,23,42,0.04)",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: 860,
  },

  th: {
    textAlign: "left",
    padding: "14px 16px",
    borderBottom: "1px solid #e2e8f0",
    background: "#f8fafc",
    fontSize: 12,
    fontWeight: 800,
    color: "#475569",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },

  td: {
    padding: "16px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: 14,
    color: "#334155",
    verticalAlign: "top",
  },

  badgeBlue: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: 999,
    background: "#eff6ff",
    color: "#1d4ed8",
    fontSize: 12,
    fontWeight: 800,
  },

  badgeSlate: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: 999,
    background: "#f1f5f9",
    color: "#475569",
    fontSize: 12,
    fontWeight: 800,
  },

  badgeGreen: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: 999,
    background: "#ecfdf5",
    color: "#059669",
    fontSize: 12,
    fontWeight: 800,
  },

  badgeAmber: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: 999,
    background: "#fffbeb",
    color: "#d97706",
    fontSize: 12,
    fontWeight: 800,
  },

  badgeRed: {
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: 999,
    background: "#fef2f2",
    color: "#dc2626",
    fontSize: 12,
    fontWeight: 800,
  },

  emptyState: {
    borderRadius: 24,
    border: "1px dashed #cbd5e1",
    background: "rgba(255,255,255,0.65)",
    padding: "28px 24px",
    textAlign: "center",
    color: "#64748b",
    fontSize: 15,
    lineHeight: 1.7,
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(2,6,23,0.42)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    zIndex: 1000,
  },

  modalCard: {
    width: "100%",
    maxWidth: 680,
    borderRadius: 30,
    border: "1px solid rgba(255,255,255,0.7)",
    background: "rgba(255,255,255,0.94)",
    padding: 24,
    boxShadow: "0 24px 80px rgba(15,23,42,0.18)",
    backdropFilter: "blur(16px)",
  },

  sidebarCard: {
    position: "sticky",
    top: 24,
    alignSelf: "start",
    borderRadius: 32,
    border: "1px solid rgba(255,255,255,0.75)",
    background: "rgba(255,255,255,0.84)",
    padding: 22,
    boxShadow: "0 18px 50px rgba(15,23,42,0.07)",
    backdropFilter: "blur(12px)",
  },

  responsiveCss: `
    @media (max-width: 1180px) {
      .lr-dashboard-grid-3 {
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
      }
      .lr-dashboard-grid-2 {
        grid-template-columns: 1fr !important;
      }
    }

    @media (max-width: 1080px) {
      .lr-dashboard-shell {
        grid-template-columns: 1fr !important;
      }
    }

    @media (max-width: 720px) {
      .lr-dashboard-container {
        padding: 16px !important;
      }
      .lr-dashboard-grid-3 {
        grid-template-columns: 1fr !important;
      }
      .lr-dashboard-header {
        padding: 20px !important;
      }
    }
  `,
};