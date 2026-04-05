import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

import { styles } from "../styles/dashboardStyles";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsRow from "../components/dashboard/StatsRow";
import AddLeadForm from "../components/dashboard/AddLeadForm";
import MessageTemplatesCard from "../components/dashboard/MessageTemplatesCard";
import LinkedInGeneratorCard from "../components/dashboard/LinkedInGeneratorCard";
import FollowupsPanel from "../components/dashboard/FollowupsPanel";
import SearchFilters from "../components/dashboard/SearchFilters";
import LeadPipelineBoard from "../components/dashboard/LeadPipelineBoard";
import LeadsList from "../components/dashboard/LeadsList";
import LinkedInTemplateModal from "../components/dashboard/LinkedInTemplateModal";

import {
  initialFilters,
  initialLeadForm,
  stages,
  templates,
} from "../features/leads/leads.constants";
import {
  buildPipelineBuckets,
  filterAndSortLeads,
  getLeadStats,
  getTodayFollowUps,
} from "../features/leads/leads.helpers";
import {
  addLeadHistoryNote,
  createLead,
  removeLead,
  subscribeToUserLeads,
  updateLeadField,
} from "../features/leads/leads.service";
import {
  buildLinkedInNotes,
  buildLinkedInSearchQuery,
  buildLinkedInTemplateText,
} from "../features/linkedin/linkedin.helpers";
import { buildQuoteText } from "../features/quotes/quote.helpers";
import { exportLeadPdf } from "../features/pdf/exportLeadPdf";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState(initialLeadForm);
  const [filters, setFilters] = useState(initialFilters);

  const [selectedTemplate, setSelectedTemplate] = useState("contractor");
  const [copiedMessage, setCopiedMessage] = useState("");
  const [newNoteText, setNewNoteText] = useState({});
  const [copiedQuoteId, setCopiedQuoteId] = useState("");

  const [copiedLinkedInMessageId, setCopiedLinkedInMessageId] = useState("");
  const [selectedLinkedInTemplate, setSelectedLinkedInTemplate] = useState({});
  const [linkedinDrafts, setLinkedinDrafts] = useState({});
  const [linkedinModalLead, setLinkedinModalLead] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    let unsubscribeLeads = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/");
        return;
      }

      setUser(currentUser);

      unsubscribeLeads = subscribeToUserLeads(
        currentUser.uid,
        (leadList) => {
          setLeads(Array.isArray(leadList) ? leadList : []);
          setLoading(false);
        },
        (error) => {
          console.error("Error loading leads:", error);
          setLoading(false);
        }
      );
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeLeads) unsubscribeLeads();
    };
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleAddLead = async (e) => {
    e.preventDefault();

    if (!form.businessName.trim()) {
      alert("Business name is required");
      return;
    }

    if (!user) return;

    try {
      await createLead(user, form);
      setForm(initialLeadForm);
    } catch (error) {
      console.error("Error adding lead:", error);
      alert(error.message || "Could not add lead");
    }
  };

  const handleDeleteLead = async (leadId) => {
    const confirmed = window.confirm("Delete this lead?");
    if (!confirmed) return;

    try {
      await removeLead(leadId);

      setLeads((prev) =>
        prev.filter((lead) => String(lead.id) !== String(leadId))
      );

      setNewNoteText((prev) => {
        const next = { ...prev };
        delete next[leadId];
        return next;
      });

      if (linkedinModalLead && String(linkedinModalLead.id) === String(leadId)) {
        setLinkedinModalLead(null);
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
      alert(error.message || "Could not delete lead");
    }
  };

  const handleFieldUpdate = async (leadId, field, value) => {
    try {
      await updateLeadField(leadId, field, value);

      setLeads((prev) =>
        prev.map((lead) =>
          String(lead.id) === String(leadId)
            ? { ...lead, [field]: value }
            : lead
        )
      );

      if (linkedinModalLead && String(linkedinModalLead.id) === String(leadId)) {
        setLinkedinModalLead((prev) => ({
          ...prev,
          [field]: value,
        }));
      }
    } catch (error) {
      console.error("Error updating lead:", error);
      alert(error.message || "Could not update lead");
    }
  };

  const handleAddNoteHistory = async (leadId) => {
    const note = (newNoteText[leadId] || "").trim();
    if (!note) return;

    try {
      await addLeadHistoryNote(leadId, note);

      setNewNoteText((prev) => ({
        ...prev,
        [leadId]: "",
      }));
    } catch (error) {
      console.error("Error adding note history:", error);
      alert(error.message || "Could not save note");
    }
  };

  const handleCopyTemplate = async () => {
    try {
      await navigator.clipboard.writeText(templates[selectedTemplate]);
      setCopiedMessage("Template copied");
      setTimeout(() => setCopiedMessage(""), 1500);
    } catch (error) {
      console.error("Copy failed:", error);
      alert("Could not copy template");
    }
  };

  const handleCopyQuote = async (lead) => {
    try {
      await navigator.clipboard.writeText(buildQuoteText(lead));
      setCopiedQuoteId(lead.id);
      setTimeout(() => setCopiedQuoteId(""), 1500);
    } catch (error) {
      console.error("Copy quote failed:", error);
      alert("Could not copy quote");
    }
  };

  const linkedinSearchQuery = useMemo(
    () => buildLinkedInSearchQuery(form),
    [form]
  );

  const openLinkedInSearch = () => {
    if (!linkedinSearchQuery) {
      alert("Add at least a role, keyword, company, or location");
      return;
    }

    const linkedinUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(
      linkedinSearchQuery
    )}`;

    window.open(linkedinUrl, "_blank", "noopener,noreferrer");
  };

  const saveLinkedInLeadToForm = () => {
    if (!form.linkedinRole.trim() && !form.linkedinProfileUrl.trim()) {
      alert("Add at least a role or a LinkedIn profile URL");
      return;
    }

    const linkedInNotes = buildLinkedInNotes(form);

    setForm((prev) => ({
      ...prev,
      businessName: prev.linkedinCompany.trim() || prev.businessName,
      category: "Small Business",
      notes: linkedInNotes,
    }));
  };

  const handleLinkedInTemplateChange = (lead, templateKey) => {
    const builtText = buildLinkedInTemplateText(lead, templates[templateKey]);

    setSelectedLinkedInTemplate((prev) => ({
      ...prev,
      [lead.id]: templateKey,
    }));

    setLinkedinDrafts((prev) => ({
      ...prev,
      [lead.id]: builtText,
    }));
  };

  const handleCopyLinkedInMessage = async (lead) => {
    const templateKey = selectedLinkedInTemplate[lead.id] || "linkedinConnect";
    const draft =
      linkedinDrafts[lead.id] ||
      buildLinkedInTemplateText(lead, templates[templateKey]);

    try {
      await navigator.clipboard.writeText(draft);
      setCopiedLinkedInMessageId(lead.id);
      setTimeout(() => setCopiedLinkedInMessageId(""), 1500);
    } catch (error) {
      console.error("Copy LinkedIn message failed:", error);
      alert("Could not copy LinkedIn message");
    }
  };

  const openLinkedInTemplateModal = (lead) => {
    const defaultTemplate =
      selectedLinkedInTemplate[lead.id] || "linkedinConnect";

    if (!linkedinDrafts[lead.id]) {
      setLinkedinDrafts((prev) => ({
        ...prev,
        [lead.id]: buildLinkedInTemplateText(lead, templates[defaultTemplate]),
      }));
    }

    setLinkedinModalLead(lead);
  };

  const filteredLeads = useMemo(
    () => filterAndSortLeads(leads, filters),
    [leads, filters]
  );

  const pipelineLeads = useMemo(
    () => buildPipelineBuckets(filteredLeads, stages),
    [filteredLeads]
  );

  const todayFollowUps = useMemo(() => getTodayFollowUps(leads), [leads]);
  const stats = useMemo(() => getLeadStats(leads), [leads]);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <DashboardHeader user={user} onLogout={handleLogout} />

        <StatsRow stats={stats} />

        <div style={styles.topGrid}>
          <AddLeadForm form={form} setForm={setForm} onSubmit={handleAddLead} />

          <MessageTemplatesCard
            templates={templates}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            onCopyTemplate={handleCopyTemplate}
            copiedMessage={copiedMessage}
          />

          <LinkedInGeneratorCard
            form={form}
            setForm={setForm}
            linkedinSearchQuery={linkedinSearchQuery}
            onOpenSearch={openLinkedInSearch}
            onSaveIntoLeadForm={saveLinkedInLeadToForm}
          />
        </div>

        <FollowupsPanel todayFollowUps={todayFollowUps} />

        <SearchFilters filters={filters} setFilters={setFilters} />

        <LeadPipelineBoard
          pipelineLeads={pipelineLeads}
          onFieldUpdate={handleFieldUpdate}
        />

        <LeadsList
          loading={loading}
          leads={filteredLeads}
          newNoteText={newNoteText}
          setNewNoteText={setNewNoteText}
          onFieldUpdate={handleFieldUpdate}
          onDeleteLead={handleDeleteLead}
          onOpenLinkedInTemplates={openLinkedInTemplateModal}
          onCopyQuote={handleCopyQuote}
          onDownloadPdf={exportLeadPdf}
          copiedQuoteId={copiedQuoteId}
          onSaveNoteEntry={handleAddNoteHistory}
        />

        <LinkedInTemplateModal
          lead={linkedinModalLead}
          selectedTemplate={
            linkedinModalLead
              ? selectedLinkedInTemplate[linkedinModalLead.id] ||
                "linkedinConnect"
              : "linkedinConnect"
          }
          draftValue={
            linkedinModalLead
              ? linkedinDrafts[linkedinModalLead.id] ||
                buildLinkedInTemplateText(
                  linkedinModalLead,
                  templates[
                    selectedLinkedInTemplate[linkedinModalLead.id] ||
                      "linkedinConnect"
                  ]
                )
              : ""
          }
          onChangeTemplate={(templateKey) =>
            handleLinkedInTemplateChange(linkedinModalLead, templateKey)
          }
          onDraftChange={(value) =>
            setLinkedinDrafts((prev) => ({
              ...prev,
              [linkedinModalLead.id]: value,
            }))
          }
          onCopy={() => handleCopyLinkedInMessage(linkedinModalLead)}
          copied={
            linkedinModalLead &&
            copiedLinkedInMessageId === linkedinModalLead.id
          }
          onClose={() => setLinkedinModalLead(null)}
        />
      </div>
    </div>
  );
}