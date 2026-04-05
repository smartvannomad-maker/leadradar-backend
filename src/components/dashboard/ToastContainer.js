import Toast from "./Toast";

export default function ToastContainer({ toasts, onClose }) {
  if (!toasts.length) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 3000,
        display: "grid",
        gap: 14,
        width: "min(420px, calc(100vw - 24px))",
        pointerEvents: "none",
      }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            pointerEvents: "auto",
            borderRadius: 22,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.93) 100%)",
            border: "1px solid rgba(148, 163, 184, 0.16)",
            boxShadow:
              "0 20px 45px rgba(15, 23, 42, 0.14), inset 0 1px 0 rgba(255,255,255,0.75)",
            backdropFilter: "blur(12px)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: 4,
              background:
                toast.type === "success"
                  ? "linear-gradient(90deg, #10b981 0%, #34d399 100%)"
                  : toast.type === "error"
                  ? "linear-gradient(90deg, #ef4444 0%, #f87171 100%)"
                  : toast.type === "warning"
                  ? "linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)"
                  : "linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)",
            }}
          />

          <div
            style={{
              padding: 2,
            }}
          >
            <Toast toast={toast} onClose={onClose} />
          </div>
        </div>
      ))}
    </div>
  );
}