import { styles } from "../../styles/dashboardStyles";

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmTone = "danger",
  onConfirm,
  onClose,
}) {
  if (!open) return null;

  const confirmStyle =
    confirmTone === "danger"
      ? {
          padding: "13px 18px",
          borderRadius: 16,
          border: "1px solid rgba(220, 38, 38, 0.22)",
          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          color: "#fff",
          fontWeight: 800,
          cursor: "pointer",
          boxShadow: "0 16px 34px rgba(220, 38, 38, 0.22)",
          transition: "transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease",
        }
      : {
          ...styles.primaryButton,
          borderRadius: 16,
          padding: "13px 18px",
          boxShadow: "0 16px 34px rgba(37, 99, 235, 0.20)",
        };

  return (
    <div
      style={{
        ...styles.modalOverlay,
        padding: 20,
        backdropFilter: "blur(10px)",
        background: "rgba(15, 23, 42, 0.42)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          ...styles.modalCard,
          width: "100%",
          maxWidth: 560,
          borderRadius: 28,
          border: "1px solid rgba(255,255,255,0.24)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.94) 100%)",
          boxShadow:
            "0 32px 80px rgba(15, 23, 42, 0.22), inset 0 1px 0 rgba(255,255,255,0.75)",
          padding: 28,
          position: "relative",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            position: "absolute",
            top: -70,
            right: -50,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background:
              confirmTone === "danger"
                ? "rgba(239, 68, 68, 0.10)"
                : "rgba(37, 99, 235, 0.10)",
            filter: "blur(8px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "8px 12px",
              borderRadius: 999,
              background:
                confirmTone === "danger"
                  ? "rgba(239, 68, 68, 0.08)"
                  : "rgba(37, 99, 235, 0.08)",
              color: confirmTone === "danger" ? "#b91c1c" : "#1d4ed8",
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            {confirmTone === "danger" ? "Confirm action" : "Please confirm"}
          </div>

          <div style={{ marginBottom: 22 }}>
            <h3
              style={{
                ...styles.modalTitle,
                margin: 0,
                fontSize: "1.5rem",
                lineHeight: 1.15,
                fontWeight: 900,
                letterSpacing: "-0.03em",
                color: "#0f172a",
              }}
            >
              {title}
            </h3>

            <p
              style={{
                ...styles.modalSubTitle,
                marginTop: 12,
                fontSize: 15,
                lineHeight: 1.75,
                color: "#475569",
              }}
            >
              {description}
            </p>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                ...styles.closeModalButton,
                padding: "13px 18px",
                borderRadius: 16,
                border: "1px solid rgba(148, 163, 184, 0.22)",
                background: "rgba(255,255,255,0.8)",
                color: "#334155",
                fontWeight: 700,
                boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
              }}
            >
              {cancelLabel}
            </button>

            <button type="button" onClick={onConfirm} style={confirmStyle}>
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}