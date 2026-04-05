export function toTitleCase(value = "") {
  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatActivityValue(field, value) {
  if (value === null || value === undefined || value === "") return "empty";

  if (
    field === "stage" ||
    field === "status" ||
    field === "quoteStatus"
  ) {
    return toTitleCase(value);
  }

  if (field === "followUpDate") {
    return String(value);
  }

  if (field === "quoteAmount") {
    return String(value);
  }

  return String(value);
}

export function createActivityEvent({ type, title, text, meta = {} }) {
  return {
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    type,
    title,
    text,
    meta,
    createdAt: new Date().toISOString(),
  };
}

export function createFieldUpdateActivity(field, oldValue, newValue) {
  const oldDisplay = formatActivityValue(field, oldValue);
  const newDisplay = formatActivityValue(field, newValue);

  const fieldTitles = {
    stage: "Stage updated",
    status: "Status updated",
    quoteStatus: "Quote status updated",
    followUpDate: "Follow-up updated",
    quoteAmount: "Quote amount updated",
    businessName: "Business name updated",
    contactName: "Contact updated",
    mobile: "Mobile updated",
    category: "Category updated",
    linkedinRole: "LinkedIn role updated",
    linkedinCompany: "LinkedIn company updated",
    linkedinLocation: "LinkedIn location updated",
    linkedinHeadline: "LinkedIn headline updated",
    linkedinKeywords: "LinkedIn keywords updated",
    linkedinProfileUrl: "LinkedIn profile updated",
    notes: "Notes updated",
  };

  return createActivityEvent({
    type: field,
    title: fieldTitles[field] || "Field updated",
    text: `${oldDisplay} → ${newDisplay}`,
    meta: {
      field,
      oldValue,
      newValue,
    },
  });
}

export function createNoteActivity(noteText) {
  return createActivityEvent({
    type: "note_added",
    title: "Note added",
    text: noteText || "A new note was added.",
  });
}

export const TRACKED_ACTIVITY_FIELDS = new Set([
  "stage",
  "status",
  "quoteStatus",
  "followUpDate",
  "quoteAmount",
  "notes",
]);