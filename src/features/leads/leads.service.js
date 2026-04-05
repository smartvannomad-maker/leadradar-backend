import { apiFetch } from "../../api/client";

function safeTrim(value) {
  return typeof value === "string" ? value.trim() : "";
}

export async function fetchLeads() {
  return apiFetch("/leads", {
    method: "GET",
  });
}

export async function createLead(form) {
  const initialNote = safeTrim(form.notes);

  return apiFetch("/leads", {
    method: "POST",
    body: JSON.stringify({
      businessName: safeTrim(form.businessName),
      contactName: safeTrim(form.contactName),
      mobile: safeTrim(form.mobile),
      category: form.category || "",
      status: form.status || "",
      stage: form.stage || "",
      followUpDate: form.followUpDate || "",
      notes: initialNote,
      notesHistory: initialNote
        ? [
            {
              text: initialNote,
              createdAt: new Date().toISOString(),
            },
          ]
        : [],
      quoteAmount: safeTrim(form.quoteAmount),
      quoteStatus: form.quoteStatus || "",
      linkedinRole: safeTrim(form.linkedinRole),
      linkedinLocation: safeTrim(form.linkedinLocation),
      linkedinKeywords: safeTrim(form.linkedinKeywords),
      linkedinCompany: safeTrim(form.linkedinCompany),
      linkedinProfileUrl: safeTrim(form.linkedinProfileUrl),
      linkedinHeadline: safeTrim(form.linkedinHeadline),
    }),
  });
}

export async function importLeads(rows) {
  return apiFetch("/leads/import", {
    method: "POST",
    body: JSON.stringify({ rows }),
  });
}

export async function removeLead(leadId) {
  return apiFetch(`/leads/${leadId}`, {
    method: "DELETE",
  });
}

export async function updateLeadField(leadId, field, value) {
  return apiFetch(`/leads/${leadId}`, {
    method: "PATCH",
    body: JSON.stringify({
      [field]: value,
    }),
  });
}

export async function addLeadHistoryNote(leadId, note) {
  return apiFetch(`/leads/${leadId}/notes`, {
    method: "POST",
    body: JSON.stringify({
      text: safeTrim(note),
    }),
  });
}