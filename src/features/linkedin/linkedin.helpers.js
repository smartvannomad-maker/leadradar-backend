export function buildLinkedInSearchQuery({
  linkedinRole,
  linkedinKeywords,
  linkedinCompany,
  linkedinLocation,
}) {
  return [
    linkedinRole?.trim(),
    linkedinKeywords?.trim(),
    linkedinCompany?.trim() ? `company ${linkedinCompany.trim()}` : "",
    linkedinLocation?.trim(),
  ]
    .filter(Boolean)
    .join(" ");
}

export function buildLinkedInTemplateText(lead, template) {
  return (template || "")
    .replace("{name}", lead.contactName || "there")
    .replace("{role}", lead.linkedinRole || "this role")
    .replace(
      "{company}",
      lead.linkedinCompany || lead.businessName || "your company"
    );
}

export function buildLinkedInNotes({
  notes,
  linkedinHeadline,
  linkedinProfileUrl,
  linkedinRole,
  linkedinKeywords,
  linkedinLocation,
}) {
  return [
    notes,
    linkedinHeadline?.trim() ? `Headline: ${linkedinHeadline.trim()}` : "",
    linkedinProfileUrl?.trim() ? `LinkedIn: ${linkedinProfileUrl.trim()}` : "",
    linkedinRole?.trim() ? `Target role: ${linkedinRole.trim()}` : "",
    linkedinKeywords?.trim() ? `Keywords: ${linkedinKeywords.trim()}` : "",
    linkedinLocation?.trim() ? `Location: ${linkedinLocation.trim()}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}