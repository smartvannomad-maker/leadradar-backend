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
    saveLinkedInLeadToForm,
    selectedTemplate,
    setSelectedTemplate,
    handleCopyTemplate,
    copiedMessage,
  } = useDashboard();

  const isNarrowScreen =
    typeof window !== "undefined" && window.innerWidth < 1180;

  const handleOpenLinkedInSearch = () => {
    const query =
      typeof linkedinSearchQuery === "string"
        ? linkedinSearchQuery.trim()
        : "";

    console.log("LinkedIn button clicked");
    console.log("linkedinSearchQuery:", query);

    if (!query) {
      alert("Add at least a role, keyword, company, or location");
      return;
    }

    const linkedinUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(
      query
    )}`;

    console.log("Opening URL:", linkedinUrl);
    window.open(linkedinUrl, "_blank", "noopener,noreferrer");
  };

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
        onOpenSearch={handleOpenLinkedInSearch}
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