import { useMemo, useState } from "react";
import Papa from "papaparse";
import { Upload, FileSpreadsheet } from "lucide-react";
import { importLeads } from "../../features/leads/leads.service";
import { styles } from "../../styles/dashboardStyles";

export default function ImportLeadsCard({ onImported, toast }) {
  const [rows, setRows] = useState([]);
  const [fileName, setFileName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [summary, setSummary] = useState(null);

  const previewRows = useMemo(() => rows.slice(0, 5), [rows]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setSummary(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setRows(Array.isArray(results.data) ? results.data : []);
      },
      error: () => {
        toast.error("Could not read CSV file.");
      },
    });
  };

  const handleImport = async () => {
    if (!rows.length) {
      toast.error("Choose a CSV file first.");
      return;
    }

    try {
      setSubmitting(true);
      const result = await importLeads(rows);
      setSummary(result);
      toast.success(`Imported ${result.importedCount} lead(s).`);
      setRows([]);
      setFileName("");

      if (onImported) {
        await onImported();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Import failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.sectionCard}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          alignItems: "flex-start",
          flexWrap: "wrap",
          marginBottom: 18,
        }}
      >
        <div>
          <h3 style={{ ...styles.cardTitle, fontSize: 22 }}>CSV Import</h3>
          <p style={{ ...styles.cardText, marginTop: 8 }}>
            Upload a CSV to bulk import leads into your current workspace.
          </p>
        </div>

        <div style={styles.badgeBlue}>
          <FileSpreadsheet size={14} style={{ marginRight: 6 }} />
          Bulk import
        </div>
      </div>

      <div
        style={{
          border: "1px dashed #cbd5e1",
          borderRadius: 20,
          background: "rgba(255,255,255,0.75)",
          padding: 18,
        }}
      >
        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 16px",
            borderRadius: 16,
            background: "#eff6ff",
            color: "#1d4ed8",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          <Upload size={16} />
          Choose CSV File
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>

        {fileName ? (
          <p
            style={{
              marginTop: 14,
              marginBottom: 0,
              color: "#334155",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            File selected: {fileName}
          </p>
        ) : null}
      </div>

      {rows.length ? (
        <div style={{ marginTop: 20 }}>
          <div
            style={{
              marginBottom: 12,
              color: "#0f172a",
              fontWeight: 800,
              fontSize: 15,
            }}
          >
            Parsed rows: {rows.length}
          </div>

          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  {Object.keys(previewRows[0] || {}).map((key) => (
                    <th key={key} style={styles.th}>
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {previewRows.map((row, index) => (
                  <tr key={index}>
                    {Object.keys(previewRows[0] || {}).map((key) => (
                      <td key={key} style={styles.td}>
                        {row[key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
              marginTop: 16,
            }}
          >
            <div style={{ color: "#64748b", fontSize: 14 }}>
              Previewing the first 5 rows before import.
            </div>

            <button
              type="button"
              onClick={handleImport}
              disabled={submitting}
              style={styles.primaryButton}
            >
              {submitting ? "Importing..." : "Import Leads"}
            </button>
          </div>
        </div>
      ) : null}

      {summary ? (
        <div
          style={{
            marginTop: 20,
            padding: 16,
            borderRadius: 18,
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
          }}
        >
          <div
            style={{
              fontWeight: 800,
              color: "#0f172a",
              marginBottom: 10,
              fontSize: 15,
            }}
          >
            Import Summary
          </div>

          <div
            style={{
              color: "#475569",
              lineHeight: 1.9,
              fontSize: 14,
            }}
          >
            Imported: {summary.importedCount}
            <br />
            Skipped: {summary.skippedCount}
            <br />
            Errors: {summary.errorCount}
          </div>
        </div>
      ) : null}
    </div>
  );
}