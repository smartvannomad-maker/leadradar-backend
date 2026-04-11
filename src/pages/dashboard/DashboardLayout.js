import { useEffect, useMemo, useState, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { styles } from "../../styles/dashboardStyles";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import ConfirmModal from "../../components/dashboard/ConfirmModal";
import ToastContainer from "../../components/dashboard/ToastContainer";
import TrialBanner from "../../components/TrialBanner";

import { useToast } from "../../hooks/useToast";
import { useAuth } from "../../hooks/useAuth";
import { DashboardContext } from "../../context/DashboardContext";

import {
  initialFilters,
  initialLeadForm,
  templates,
} from "../../features/leads/leads.constants";
import {
  filterAndSortLeads,
  getLeadStats,
  getTodayFollowUps,
} from "../../features/leads/leads.helpers";
import {
  TRACKED_ACTIVITY_FIELDS,
  createFieldUpdateActivity,
} from "../../features/leads/activity.helpers";
import {
  createLead,
  fetchLeads,
  removeLead,
  updateLeadField,
} from "../../features/leads/leads.service";
import {
  buildLinkedInNotes,
  buildLinkedInSearchQuery,
} from "../../features/linkedin/linkedin.helpers";

export default function DashboardLayout() {
  const { user, accessToken, logout, workspace } = useAuth();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState(initialLeadForm);
  const [filters, setFilters] = useState(initialFilters);

  const [selectedTemplate, setSelectedTemplate] = useState("contractor");
  const [copiedMessage, setCopiedMessage] = useState("");

  const navigate = useNavigate();
  const toast = useToast();

  const [deleteLeadId, setDeleteLeadId] = useState(null);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const refreshLeads = useCallback(async () => {
    setLoading(true);

    const maxAttempts = 3;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        const leadList = await fetchLeads();
        setLeads(Array.isArray(leadList) ? leadList : []);
        setLoading(false);
        return;
      } catch (error) {
        console.warn(`Load attempt ${attempt} failed:`, error);

        const message = String(error?.message || "").toLowerCase();

        const isWakeDelay =
          message.includes("failed to fetch") ||
          message.includes("networkerror") ||
          message.includes("load failed");

        if (!isWakeDelay && attempt === maxAttempts) {
          toast.error(error.message || "Could not load leads.");
        }

        // IMPORTANT:
        // Do not auto-logout here while debugging.
        // Unauthorized lead loading should not wipe the whole session immediately.
        if (attempt < maxAttempts) {
          await sleep(2500);
        }
      }
    }

    setLoading(false);
  }, [toast]);

  useEffect(() => {
    if (!user || !accessToken) {
      navigate("/");
      return;
    }

    refreshLeads();
  }, [user, accessToken, navigate, refreshLeads]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handleAddLead = async (e) => {
    e.preventDefault();

    if (!form.businessName.trim()) {
      toast.error("Business name is required.");
      return;
    }

    try {
      await createLead(form);
      setForm(initialLeadForm);
      await refreshLeads();
      navigate("/dashboard/leads");
      toast.success("Lead added successfully.");
    } catch (error) {
      console.error("Error adding lead:", error);
      toast.error(error.message || "Could not add lead.");
    }
  };

  const confirmDeleteLead = async () => {
    if (!deleteLeadId) return;

    try {
      await removeLead(deleteLeadId);
      setDeleteLeadId(null);
      await refreshLeads();
      toast.success("Lead deleted.");
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast.error(error.message || "Could not delete lead.");
    }
  };

  const handleFieldUpdate = async (leadId, field, value) => {
    const existingLead = leads.find((lead) => String(lead.id) === String(leadId));
    if (!existingLead) return;

    const oldValue = existingLead[field];
    if (oldValue === value) return;

    const nextActivityHistory = Array.isArray(existingLead.activityHistory)
      ? [...existingLead.activityHistory]
      : [];

    if (TRACKED_ACTIVITY_FIELDS.has(field)) {
      nextActivityHistory.push(createFieldUpdateActivity(field, oldValue, value));
    }

    const optimisticLead = {
      ...existingLead,
      [field]: value,
      activityHistory: nextActivityHistory,
    };

    setLeads((prev) =>
      prev.map((lead) =>
        String(lead.id) === String(leadId) ? optimisticLead : lead
      )
    );

    try {
      const updatedLead = await updateLeadField(leadId, field, value);

      const mergedLead = {
        ...updatedLead,
        activityHistory:
          Array.isArray(updatedLead?.activityHistory) &&
          updatedLead.activityHistory.length > 0
            ? updatedLead.activityHistory
            : nextActivityHistory,
      };

      setLeads((prev) =>
        prev.map((lead) =>
          String(lead.id) === String(leadId) ? mergedLead : lead
        )
      );
    } catch (error) {
      console.error("Error updating lead:", error);

      setLeads((prev) =>
        prev.map((lead) =>
          String(lead.id) === String(leadId) ? existingLead : lead
        )
      );

      toast.error(error.message || "Could not update lead.");
    }
  };

  const handleCopyTemplate = async () => {
    try {
      const templateText = templates[selectedTemplate] || "";
      await navigator.clipboard.writeText(templateText);
      setCopiedMessage("Template copied");
      setTimeout(() => setCopiedMessage(""), 1500);
    } catch (error) {
      console.error("Copy failed:", error);
      toast.error("Could not copy template.");
    }
  };

  const linkedinSearchQuery = useMemo(
    () => buildLinkedInSearchQuery(form),
    [form]
  );

  const openLinkedInSearch = () => {
    const query =
      typeof linkedinSearchQuery === "string"
        ? linkedinSearchQuery.trim()
        : "";

    if (!query) {
      toast.error("Add at least a role, keyword, company, or location.");
      return;
    }

    const linkedinUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(
      query
    )}`;

    window.open(linkedinUrl, "_blank", "noopener,noreferrer");
  };

  const saveLinkedInLeadToForm = () => {
    const hasRole =
      typeof form.linkedinRole === "string" && form.linkedinRole.trim();
    const hasProfileUrl =
      typeof form.linkedinProfileUrl === "string" &&
      form.linkedinProfileUrl.trim();

    if (!hasRole && !hasProfileUrl) {
      toast.error("Add at least a role or a LinkedIn profile URL.");
      return;
    }

    const linkedInNotes = buildLinkedInNotes(form);

    setForm((prev) => ({
      ...prev,
      businessName:
        (typeof prev.linkedinCompany === "string" &&
          prev.linkedinCompany.trim()) ||
        prev.businessName,
      category: "Small Business",
      notes: linkedInNotes,
    }));

    toast.success("LinkedIn details saved into lead form.");
  };

  const filteredLeads = useMemo(
    () => filterAndSortLeads(leads, filters),
    [leads, filters]
  );

  const stats = useMemo(() => getLeadStats(leads), [leads]);
  const todayFollowUps = useMemo(() => getTodayFollowUps(leads), [leads]);
  const pipelineLeads = useMemo(() => filteredLeads, [filteredLeads]);

  const hideSidebar =
    typeof window !== "undefined" && window.innerWidth < 1080;

  return (
    <DashboardContext.Provider
      value={{
        user,
        workspace,
        leads,
        filteredLeads,
        loading,
        form,
        setForm,
        filters,
        setFilters,
        stats,
        todayFollowUps,
        pipelineLeads,
        handleAddLead,
        handleFieldUpdate,
        confirmDeleteLead,
        refreshLeads,
        setDeleteLeadId,
        selectedTemplate,
        setSelectedTemplate,
        handleCopyTemplate,
        copiedMessage,
        linkedinSearchQuery,
        openLinkedInSearch,
        saveLinkedInLeadToForm,
      }}
    >
      <div style={styles.page}>
        <ToastContainer toasts={toast.toasts} onClose={toast.removeToast} />

        <ConfirmModal
          open={!!deleteLeadId}
          title="Delete lead?"
          description="This action will permanently remove the lead from your dashboard."
          confirmLabel="Delete Lead"
          cancelLabel="Cancel"
          confirmTone="danger"
          onConfirm={confirmDeleteLead}
          onClose={() => setDeleteLeadId(null)}
        />

        <div style={styles.container}>
          <div
            style={{
              ...styles.shell,
              gridTemplateColumns: hideSidebar
                ? "1fr"
                : styles.shell.gridTemplateColumns,
            }}
          >
            {!hideSidebar && <DashboardSidebar />}

            <main style={styles.content}>
              <DashboardHeader user={user} onLogout={handleLogout} />
              <TrialBanner />
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </DashboardContext.Provider>
  );
}