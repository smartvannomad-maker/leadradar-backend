import { styles } from "../../styles/dashboardStyles";
import {
  categoryOptions,
  stages,
  statusOptions,
} from "../../features/leads/leads.constants";

function formatLabel(value = "") {
  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function SearchFilters({ filters, setFilters }) {
  const update = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const hasActiveFilters =
    filters.searchTerm ||
    filters.categoryFilter !== "All" ||
    filters.statusFilter !== "All" ||
    filters.stageFilter !== "All" ||
    filters.sortBy !== "newest";

  const clearFilters = () => {
    setFilters((prev) => ({
      ...prev,
      searchTerm: "",
      categoryFilter: "All",
      statusFilter: "All",
      stageFilter: "All",
      sortBy: "newest",
    }));
  };

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 28,
        border: "1px solid rgba(148, 163, 184, 0.14)",
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(248,250,252,0.94) 100%)",
        boxShadow:
          "0 18px 42px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255,255,255,0.78)",
        padding: 22,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "rgba(37, 99, 235, 0.08)",
          filter: "blur(10px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, display: "grid", gap: 18 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 14,
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
              Filter workspace
            </div>

            <h2
              style={{
                margin: 0,
                fontSize: "1.3rem",
                lineHeight: 1.1,
                fontWeight: 900,
                letterSpacing: "-0.03em",
                color: "#0f172a",
              }}
            >
              Search, filters & sorting
            </h2>

            <p
              style={{
                margin: "10px 0 0",
                fontSize: 14,
                lineHeight: 1.7,
                color: "#64748b",
                maxWidth: 720,
              }}
            >
              Narrow your pipeline fast, surface the right opportunities, and keep
              your board focused on what matters most right now.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <div
              style={{
                padding: "10px 14px",
                borderRadius: 16,
                background: hasActiveFilters
                  ? "rgba(16, 185, 129, 0.10)"
                  : "rgba(148, 163, 184, 0.10)",
                color: hasActiveFilters ? "#047857" : "#475569",
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              {hasActiveFilters ? "Filters Active" : "Default View"}
            </div>

            <button
              type="button"
              onClick={clearFilters}
              disabled={!hasActiveFilters}
              style={{
                border: "1px solid rgba(148, 163, 184, 0.18)",
                background: hasActiveFilters
                  ? "rgba(255,255,255,0.9)"
                  : "rgba(248,250,252,0.9)",
                color: hasActiveFilters ? "#334155" : "#94a3b8",
                borderRadius: 16,
                padding: "10px 14px",
                fontSize: 13,
                fontWeight: 800,
                cursor: hasActiveFilters ? "pointer" : "not-allowed",
                boxShadow: hasActiveFilters
                  ? "0 10px 22px rgba(15, 23, 42, 0.06)"
                  : "none",
              }}
            >
              Clear all
            </button>
          </div>
        </div>

        <div
          className="leadradar-searchfilters-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(260px, 1.8fr) repeat(3, minmax(180px, 1fr))",
            gap: 14,
          }}
        >
          <div style={{ display: "grid", gap: 8 }}>
            <label
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#94a3b8",
              }}
            >
              Search
            </label>

            <input
              style={{
                ...styles.input,
                borderRadius: 18,
                border: "1px solid rgba(148, 163, 184, 0.18)",
                background:
                  "linear-gradient(180deg, #ffffff 0%, rgba(248,250,252,0.96) 100%)",
                boxShadow: "inset 0 1px 2px rgba(15, 23, 42, 0.04)",
                padding: "14px 16px",
                minHeight: 50,
              }}
              placeholder="Search business, contact, phone, notes, quote, LinkedIn"
              value={filters.searchTerm}
              onChange={(e) => update("searchTerm", e.target.value)}
            />
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <label
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#94a3b8",
              }}
            >
              Category
            </label>

            <select
              style={{
                ...styles.input,
                borderRadius: 18,
                border: "1px solid rgba(148, 163, 184, 0.18)",
                background:
                  "linear-gradient(180deg, #ffffff 0%, rgba(248,250,252,0.96) 100%)",
                boxShadow: "inset 0 1px 2px rgba(15, 23, 42, 0.04)",
                minHeight: 50,
              }}
              value={filters.categoryFilter}
              onChange={(e) => update("categoryFilter", e.target.value)}
            >
              <option>All</option>
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {formatLabel(option)}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <label
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#94a3b8",
              }}
            >
              Status
            </label>

            <select
              style={{
                ...styles.input,
                borderRadius: 18,
                border: "1px solid rgba(148, 163, 184, 0.18)",
                background:
                  "linear-gradient(180deg, #ffffff 0%, rgba(248,250,252,0.96) 100%)",
                boxShadow: "inset 0 1px 2px rgba(15, 23, 42, 0.04)",
                minHeight: 50,
              }}
              value={filters.statusFilter}
              onChange={(e) => update("statusFilter", e.target.value)}
            >
              <option>All</option>
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {formatLabel(option)}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <label
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#94a3b8",
              }}
            >
              Stage
            </label>

            <select
              style={{
                ...styles.input,
                borderRadius: 18,
                border: "1px solid rgba(148, 163, 184, 0.18)",
                background:
                  "linear-gradient(180deg, #ffffff 0%, rgba(248,250,252,0.96) 100%)",
                boxShadow: "inset 0 1px 2px rgba(15, 23, 42, 0.04)",
                minHeight: 50,
              }}
              value={filters.stageFilter}
              onChange={(e) => update("stageFilter", e.target.value)}
            >
              <option>All</option>
              {stages.map((option) => (
                <option key={option} value={option}>
                  {formatLabel(option)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 14,
            flexWrap: "wrap",
            padding: 16,
            borderRadius: 22,
            border: "1px solid rgba(148, 163, 184, 0.12)",
            background: "rgba(248,250,252,0.85)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#94a3b8",
                marginBottom: 6,
              }}
            >
              Sorting
            </div>
            <div
              style={{
                fontSize: 14,
                color: "#64748b",
                lineHeight: 1.6,
              }}
            >
              Choose how leads should be ordered across your filtered pipeline view.
            </div>
          </div>

          <div
            style={{
              minWidth: 250,
              flex: "0 1 340px",
            }}
          >
            <select
              style={{
                ...styles.sortSelect,
                width: "100%",
                borderRadius: 18,
                border: "1px solid rgba(148, 163, 184, 0.18)",
                background:
                  "linear-gradient(180deg, #ffffff 0%, rgba(248,250,252,0.96) 100%)",
                boxShadow: "inset 0 1px 2px rgba(15, 23, 42, 0.04)",
                minHeight: 50,
                fontWeight: 700,
                color: "#0f172a",
              }}
              value={filters.sortBy}
              onChange={(e) => update("sortBy", e.target.value)}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="name-asc">Business name A-Z</option>
              <option value="name-desc">Business name Z-A</option>
              <option value="followup-asc">Follow-up date earliest</option>
              <option value="followup-desc">Follow-up date latest</option>
            </select>
          </div>
        </div>

        <style>
          {`
            @media (max-width: 1100px) {
              .leadradar-searchfilters-grid {
                grid-template-columns: 1fr 1fr !important;
              }
            }

            @media (max-width: 720px) {
              .leadradar-searchfilters-grid {
                grid-template-columns: 1fr !important;
              }
            }
          `}
        </style>
      </div>
    </div>
  );
}