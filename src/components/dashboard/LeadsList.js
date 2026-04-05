import { styles } from "../../styles/dashboardStyles";
import LeadCard from "./LeadCard";

export default function LeadsList({
  loading,
  leads,
  newNoteText,
  setNewNoteText,
  onFieldUpdate,
  onDeleteLead,
  onOpenLinkedInTemplates,
  onCopyQuote,
  onDownloadPdf,
  copiedQuoteId,
  onSaveNoteEntry,
}) {
  return (
    <div
      style={{
        marginTop: 30,
        display: "grid",
        gap: 18,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
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
              marginBottom: 12,
            }}
          >
            Lead workspace
          </div>

          <h2
            style={{
              ...styles.sectionTitle,
              margin: 0,
              fontSize: "1.45rem",
              lineHeight: 1.1,
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: "#0f172a",
            }}
          >
            Your Leads
          </h2>

          <p
            style={{
              margin: "10px 0 0",
              fontSize: 14,
              lineHeight: 1.7,
              color: "#64748b",
              maxWidth: 760,
            }}
          >
            Review, update and action every lead in one polished workspace built
            for daily prospecting and pipeline movement.
          </p>
        </div>

        {!loading && leads.length > 0 ? (
          <div
            style={{
              padding: "12px 16px",
              borderRadius: 18,
              background: "rgba(255,255,255,0.85)",
              border: "1px solid rgba(148, 163, 184, 0.16)",
              color: "#334155",
              fontSize: 14,
              fontWeight: 800,
              boxShadow: "0 10px 24px rgba(15,23,42,0.05)",
              whiteSpace: "nowrap",
            }}
          >
            {leads.length} {leads.length === 1 ? "Lead" : "Leads"}
          </div>
        ) : null}
      </div>

      {loading ? (
        <div
          style={{
            display: "grid",
            gap: 16,
          }}
        >
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              style={{
                borderRadius: 28,
                border: "1px solid rgba(148, 163, 184, 0.14)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.94) 100%)",
                boxShadow:
                  "0 18px 42px rgba(15, 23, 42, 0.06), inset 0 1px 0 rgba(255,255,255,0.75)",
                padding: 22,
              }}
            >
              <div
                style={{
                  height: 16,
                  width: "34%",
                  borderRadius: 999,
                  background: "#e2e8f0",
                  marginBottom: 14,
                }}
              />
              <div
                style={{
                  height: 12,
                  width: "58%",
                  borderRadius: 999,
                  background: "#edf2f7",
                  marginBottom: 10,
                }}
              />
              <div
                style={{
                  height: 12,
                  width: "48%",
                  borderRadius: 999,
                  background: "#edf2f7",
                  marginBottom: 18,
                }}
              />
              <div
                style={{
                  height: 90,
                  borderRadius: 20,
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              />
            </div>
          ))}
        </div>
      ) : leads.length === 0 ? (
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: 30,
            border: "1px solid rgba(148, 163, 184, 0.14)",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.95) 55%, rgba(239,246,255,0.92) 100%)",
            boxShadow:
              "0 24px 60px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255,255,255,0.75)",
            padding: "46px 26px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -80,
              right: -40,
              width: 220,
              height: 220,
              borderRadius: "50%",
              background: "rgba(37, 99, 235, 0.10)",
              filter: "blur(10px)",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                width: 68,
                height: 68,
                margin: "0 auto 18px",
                borderRadius: 22,
                background:
                  "linear-gradient(135deg, rgba(37,99,235,0.14) 0%, rgba(14,165,233,0.12) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 900,
                color: "#1d4ed8",
                boxShadow: "0 16px 36px rgba(37, 99, 235, 0.14)",
              }}
            >
              +
            </div>

            <h3
              style={{
                margin: 0,
                fontSize: "1.6rem",
                lineHeight: 1.15,
                fontWeight: 900,
                letterSpacing: "-0.03em",
                color: "#0f172a",
              }}
            >
              No leads found
            </h3>

            <p
              style={{
                margin: "12px auto 0",
                maxWidth: 560,
                fontSize: 15,
                lineHeight: 1.75,
                color: "#64748b",
              }}
            >
              Your lead list is empty right now. Add a lead, import a CSV, or
              widen your filters to start building out your pipeline.
            </p>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 18,
          }}
        >
          {leads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              newNoteValue={newNoteText[lead.id] || ""}
              setNewNoteValue={(value) =>
                setNewNoteText((prev) => ({
                  ...prev,
                  [lead.id]: value,
                }))
              }
              onFieldUpdate={onFieldUpdate}
              onDelete={(leadId) => onDeleteLead(leadId)}
              onOpenLinkedInTemplates={onOpenLinkedInTemplates}
              onCopyQuote={onCopyQuote}
              onDownloadPdf={onDownloadPdf}
              copiedQuoteId={copiedQuoteId}
              onSaveNoteEntry={onSaveNoteEntry}
            />
          ))}
        </div>
      )}
    </div>
  );
}