export const categoryOptions = [
  "Small Business",
  "Cafe / Restaurant",
  "Retail",
  "E-commerce",
  "Logistics",
  "Manufacturing",
  "Professional Services",
  "Construction",
  "Real Estate",
  "Education",
  "Healthcare",
  "Other",
];

export const statusOptions = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Negotiation",
  "Won",
  "Lost",
];

export const stages = [
  "Prospect",
  "Contacted",
  "Qualified",
  "Proposal",
  "Negotiation",
  "Won",
];

export const quoteStatuses = [
  "Not Sent",
  "Draft",
  "Sent",
  "Accepted",
  "Rejected",
];

export const templates = {
  contractor: `Hi {name},

I hope you're well. I wanted to introduce myself and share how we can help streamline lead tracking, follow-ups, and sales workflow.

Would you be open to a quick chat this week?`,

  followUp: `Hi {name},

Just following up on my previous message.

I’d love to explore whether this could be a good fit for your business. Let me know if you'd like a quick overview.`,

  linkedinConnect: `Hi {name}, I came across your profile and wanted to connect regarding {role} opportunities at {company}.`,

  linkedinOpportunity: `Hi {name}, I’m reaching out regarding a potential {role} opportunity connected to {company}. I’d love to share more if you're open to a quick conversation.`,

  linkedinFollowUp: `Hi {name}, just following up on my previous message regarding the {role} opportunity with {company}. Let me know if you'd be open to chat.`,

  linkedinCandidatePitch: `Hi {name}, your background stood out to me and I think you could be a strong fit for a {role} opportunity with {company}. Open to connecting?`,
};

export const initialLeadForm = {
  businessName: "",
  contactName: "",
  mobile: "",
  category: "Small Business",
  status: "New",
  stage: "Prospect",
  followUpDate: "",
  notes: "",
  notesHistory: [],
  quoteAmount: "",
  quoteStatus: "Not Sent",
  linkedinRole: "",
  linkedinLocation: "",
  linkedinKeywords: "",
  linkedinCompany: "",
  linkedinProfileUrl: "",
  linkedinHeadline: "",
};

export const initialFilters = {
  search: "",
  status: "All",
  stage: "All",
  category: "All",
  sortBy: "newest",
};