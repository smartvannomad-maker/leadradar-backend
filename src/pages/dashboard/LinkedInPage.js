import LinkedInGeneratorCard from "../../components/dashboard/LinkedInGeneratorCard";
import MessageTemplatesCard from "../../components/dashboard/MessageTemplatesCard";
import { useDashboard } from "../../context/DashboardContext";
import { templates } from "../../features/leads/leads.constants";
import { styles } from "../../styles/dashboardStyles";

export default function LinkedInPage() {
  const {
    form,
    setForm,
    linkedinSearchQuery,
    openLinkedInSearch,
    saveLinkedInLeadToForm,
    selectedTemplate,
    setSelectedTemplate,
    handleCopyTemplate,
    copiedMessage,
  } = useDashboard();

  const isNarrowScreen =
    typeof window !== "undefined" && window.innerWidth < 1180;

  return (
    <div
      style={{
        ...styles.topGrid,
        gridTemplateColumns: isNarrowScreen ? "1fr" : "1fr 1fr",
      }}
    >
      <LinkedInGeneratorCard
        form={form}
        setForm={setForm}
        linkedinSearchQuery={linkedinSearchQuery}
        onOpenSearch={openLinkedInSearch}
        onSaveIntoLeadForm={saveLinkedInLeadToForm}
      />

      <MessageTemplatesCard
        templates={templates}
        selectedTemplate={selectedTemplate}
        setSelectedTemplate={setSelectedTemplate}
        onCopyTemplate={handleCopyTemplate}
        copiedMessage={copiedMessage}
      />
    </div>
  );
}