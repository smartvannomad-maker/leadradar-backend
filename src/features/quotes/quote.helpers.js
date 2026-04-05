export function buildQuoteText(lead) {
  const amount = lead.quoteAmount || "0";

  return `Quote for ${lead.businessName || "Client"}

Business: ${lead.businessName || "-"}
Contact: ${lead.contactName || "-"}
Category: ${lead.category || "-"}
Amount: R${amount}

Included:
- One-page business website
- WhatsApp contact button
- Business info and service listing
- Basic mobile-friendly layout

Status: ${lead.quoteStatus || "Not Sent"}

Prepared by: Nick Brits
Cape Digital Solutions`;
}