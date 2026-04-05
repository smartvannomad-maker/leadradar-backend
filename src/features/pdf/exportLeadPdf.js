import jsPDF from "jspdf";

export function exportLeadPdf(lead) {
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  let y = 50;
  const line = 22;

  const ensureSpace = (extra = 0) => {
    if (y + extra > 760) {
      pdf.addPage();
      y = 50;
    }
  };

  const addRow = (label, value) => {
    ensureSpace(30);
    pdf.setFont("helvetica", "bold");
    pdf.text(`${label}:`, 40, y);
    pdf.setFont("helvetica", "normal");
    const wrapped = pdf.splitTextToSize(String(value || "-"), 380);
    pdf.text(wrapped, 140, y);
    y += Math.max(line, wrapped.length * 16);
  };

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  pdf.text("LeadRadar Lead Summary", 40, y);
  y += 30;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(11);
  pdf.text(`Generated: ${new Date().toLocaleString()}`, 40, y);
  y += 30;

  addRow("Business", lead.businessName);
  addRow("Contact", lead.contactName);
  addRow("Mobile", lead.mobile);
  addRow("Category", lead.category);
  addRow("Status", lead.status);
  addRow("Stage", lead.stage);
  addRow("Follow-up", lead.followUpDate);
  addRow("Quote Amount", lead.quoteAmount ? `R${lead.quoteAmount}` : "-");
  addRow("Quote Status", lead.quoteStatus);
  addRow("LinkedIn Role", lead.linkedinRole);
  addRow("LinkedIn Location", lead.linkedinLocation);
  addRow("LinkedIn Company", lead.linkedinCompany);
  addRow("LinkedIn Headline", lead.linkedinHeadline);
  addRow("LinkedIn Profile", lead.linkedinProfileUrl);
  addRow("Notes", lead.notes);

  if (lead.notesHistory && lead.notesHistory.length > 0) {
    ensureSpace(40);
    y += 10;
    pdf.setFont("helvetica", "bold");
    pdf.text("Notes History", 40, y);
    y += 20;

    lead.notesHistory
      .slice()
      .reverse()
      .forEach((entry, index) => {
        const entryDate = entry.createdAt
          ? new Date(entry.createdAt).toLocaleString()
          : "No date";

        ensureSpace(40);
        pdf.setFont("helvetica", "bold");
        pdf.text(`${index + 1}. ${entryDate}`, 40, y);
        y += 16;

        pdf.setFont("helvetica", "normal");
        const wrapped = pdf.splitTextToSize(entry.text || "-", 500);
        ensureSpace(wrapped.length * 16 + 10);
        pdf.text(wrapped, 50, y);
        y += wrapped.length * 16 + 10;
      });
  }

  const safeName = (lead.businessName || "lead")
    .replace(/[^a-z0-9]/gi, "_")
    .toLowerCase();

  pdf.save(`${safeName}_lead.pdf`);
}