import MessageTemplatesCard from "../../components/dashboard/MessageTemplatesCard";
import { useDashboard } from "../../context/DashboardContext";
import { templates } from "../../features/leads/leads.constants";

export default function TemplatesPage() {
  const {
    selectedTemplate,
    setSelectedTemplate,
    handleCopyTemplate,
    copiedMessage,
  } = useDashboard();

  return (
    <MessageTemplatesCard
      templates={templates}
      selectedTemplate={selectedTemplate}
      setSelectedTemplate={setSelectedTemplate}
      onCopyTemplate={handleCopyTemplate}
      copiedMessage={copiedMessage}
    />
  );
}