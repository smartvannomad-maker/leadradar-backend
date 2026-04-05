import { styles } from "../../styles/dashboardStyles";

export default function MessageTemplatesCard({
  templates,
  selectedTemplate,
  setSelectedTemplate,
  onCopyTemplate,
  copiedMessage,
}) {
  return (
    <div style={styles.card}>
      <h2 style={styles.sectionTitle}>Message Templates</h2>

      <select
        style={styles.input}
        value={selectedTemplate}
        onChange={(e) => setSelectedTemplate(e.target.value)}
      >
        <option value="contractor">Contractor Outreach</option>
        <option value="cafe">Cafe Outreach</option>
        <option value="smallBusiness">Small Business Outreach</option>
        <option value="followUp">Follow-up Message</option>
      </select>

      <div style={styles.templateBox}>{templates[selectedTemplate]}</div>

      <button
        type="button"
        onClick={onCopyTemplate}
        style={styles.secondaryButton}
      >
        Copy Template
      </button>

      {copiedMessage ? <p style={styles.copiedText}>{copiedMessage}</p> : null}
    </div>
  );
}