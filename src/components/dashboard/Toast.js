export default function Toast({ toast, onClose }) {
  const typeStyles = {
    success: {
      accent: "#10b981",
      text: "#065f46",
      softBg: "rgba(16, 185, 129, 0.08)",
    },
    error: {
      accent: "#ef4444",
      text: "#7f1d1d",
      softBg: "rgba(239, 68, 68, 0.08)",
    },
    warning: {
      accent: "#f59e0b",
      text: "#78350f",
      softBg: "rgba(245, 158, 11, 0.08)",
    },
    info: {
      accent: "#3b82f6",
      text: "#1e3a8a",
      softBg: "rgba(59, 130, 246, 0.08)",
    },
  };

  const theme = typeStyles[toast.type] || typeStyles.info;

  return (
    <div
      style={{
        position: "relative",
        borderRadius: 20,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.94) 100%)",
        border: "1px solid rgba(148, 163, 184, 0.16)",
        boxShadow:
          "0 18px 40px rgba(15, 23, 42, 0.12), inset 0 1px 0 rgba(255,255,255,0.7)",
        padding: "14px 16px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
        overflow: "hidden",
      }}
    >
      {/* Accent Glow */}
      <div
        style={{
          position: "absolute",
          left: -40,
          top: -40,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: theme.softBg,
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
          flex: 1,
        }}
      >
        {/* Accent Dot */}
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            marginTop: 6,
            background: theme.accent,
            boxShadow: `0 0 0 4px ${theme.softBg}`,
            flexShrink: 0,
          }}
        />

        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            lineHeight: 1.5,
            color: "#0f172a",
          }}
        >
          {toast.message}
        </div>
      </div>

      {/* Close */}
      <button
        type="button"
        onClick={() => onClose(toast.id)}
        style={{
          border: "none",
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(6px)",
          cursor: "pointer",
          color: "#64748b",
          fontWeight: 900,
          fontSize: 14,
          lineHeight: 1,
          width: 28,
          height: 28,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 14px rgba(15, 23, 42, 0.08)",
          transition: "all 0.15s ease",
        }}
      >
        ×
      </button>
    </div>
  );
}