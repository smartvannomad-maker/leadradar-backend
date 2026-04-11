import AddLeadForm from "../../components/dashboard/AddLeadForm";
import LinkedInGeneratorCard from "../../components/dashboard/LinkedInGeneratorCard";
import ExpiredTrialGate from "../../components/ExpiredTrialGate";
import { useDashboard } from "../../context/DashboardContext";
import { styles } from "../../styles/dashboardStyles";

function CreateLeadPageContent() {
  const {
    form,
    setForm,
    handleAddLead,
    linkedinSearchQuery,
    openLinkedInSearch,
    saveLinkedInLeadToForm,
  } = useDashboard();

  const isNarrowScreen =
    typeof window !== "undefined" && window.innerWidth < 1180;

  return (
    <div style={{ display: "grid", gap: 22 }}>
      <div style={styles.sectionCard}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2 style={styles.cardTitle}>Create new lead</h2>
            <p style={styles.cardText}>
              Add a lead manually or use the LinkedIn generator workflow to
              build cleaner prospect records faster.
            </p>
          </div>

          <div style={styles.badgeBlue}>Workspace input</div>
        </div>
      </div>

      <div
        className="lr-dashboard-grid-2"
        style={{
          display: "grid",
          gap: 22,
          gridTemplateColumns: isNarrowScreen ? "1fr" : "1fr 1fr",
        }}
      >
        <div style={styles.sectionCard}>
          <div style={{ marginBottom: 18 }}>
            <h3 style={{ ...styles.cardTitle, fontSize: 20 }}>Lead details</h3>
            <p style={{ ...styles.cardText, marginTop: 6 }}>
              Capture the business, contact, quote, follow-up, and sourcing
              details.
            </p>
          </div>

          <AddLeadForm form={form} setForm={setForm} onSubmit={handleAddLead} />
        </div>

        <div style={styles.sectionCard}>
          <div style={{ marginBottom: 18 }}>
            <h3 style={{ ...styles.cardTitle, fontSize: 20 }}>
              LinkedIn generator
            </h3>
            <p style={{ ...styles.cardText, marginTop: 6 }}>
              Build a LinkedIn-ready search query and push the details straight
              into the lead form.
            </p>
          </div>

          <LinkedInGeneratorCard
            form={form}
            setForm={setForm}
            linkedinSearchQuery={linkedinSearchQuery}
            onOpenSearch={openLinkedInSearch}
            onSaveIntoLeadForm={saveLinkedInLeadToForm}
          />
        </div>
      </div>
    </div>
  );
}

export default function CreateLeadPage() {
  return (
    <ExpiredTrialGate
      title="Add Lead locked"
      description="Your trial has ended. Upgrade to continue adding new leads and using the LinkedIn generator workflow."
    >
      <CreateLeadPageContent />
    </ExpiredTrialGate>
  );
}