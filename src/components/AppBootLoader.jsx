import React from "react";

export default function AppBootLoader({ message = "Waking server..." }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #2563eb 100%)",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 28,
          padding: 32,
          background: "rgba(255,255,255,0.96)",
          boxShadow: "0 24px 80px rgba(15, 23, 42, 0.28)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 22,
            margin: "0 auto 20px",
            display: "grid",
            placeItems: "center",
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            color: "#fff",
            fontWeight: 900,
            fontSize: 28,
            letterSpacing: "-0.04em",
          }}
        >
          LR
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: 30,
            lineHeight: 1.05,
            color: "#0f172a",
            fontWeight: 900,
            letterSpacing: "-0.04em",
          }}
        >
          LeadRadar
        </h1>

        <p
          style={{
            margin: "12px 0 22px",
            color: "#475569",
            fontSize: 15,
            lineHeight: 1.7,
          }}
        >
          {message}
        </p>

        <div
          style={{
            width: "100%",
            height: 10,
            borderRadius: 999,
            overflow: "hidden",
            background: "#dbeafe",
            position: "relative",
          }}
        >
          <div
            style={{
              width: "40%",
              height: "100%",
              borderRadius: 999,
              background: "linear-gradient(90deg, #2563eb, #60a5fa)",
              animation: "lr-loader-slide 1.2s ease-in-out infinite",
            }}
          />
        </div>

        <p
          style={{
            margin: "18px 0 0",
            fontSize: 13,
            color: "#64748b",
          }}
        >
          First load can take a moment on free hosting.
        </p>
      </div>

      <style>
        {`
          @keyframes lr-loader-slide {
            0% { transform: translateX(-120%); }
            100% { transform: translateX(320%); }
          }
        `}
      </style>
    </div>
  );
}