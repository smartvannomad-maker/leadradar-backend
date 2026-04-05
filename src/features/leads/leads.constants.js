export const stages = ["Prospect", "Contacted", "Quoted", "Negotiation", "Won"];

export const statusOptions = ["New", "Contacted", "Interested", "Closed"];

export const categoryOptions = [
  "Cafe / Restaurant",
  "Contractor",
  "Small Business",
];

export const quoteStatuses = [
  "Not Sent",
  "Draft",
  "Sent",
  "Approved",
  "Declined",
];

export const templates = {
  contractor:
    "Hi, I came across your business and noticed you could get more enquiries with a simple website and WhatsApp contact button. I build these for service businesses. Would you like me to create one for your business?",
  cafe:
    "Hi, I came across your café and noticed you could get more orders and bookings with a simple website and WhatsApp button. I can create one tailored for your café if you're interested.",
  smallBusiness:
    "Hi, I came across your business and noticed your online presence could be improved. I build simple websites with WhatsApp contact buttons for small businesses. Would you like me to create one for your business?",
  followUp:
    "Hi, just following up on my previous message. I can create a simple website with WhatsApp contact for your business. Let me know if you'd like me to show you an example.",

  linkedinConnect:
    "Hi {name}, I came across your profile and wanted to connect. Your background in {role} stood out to me.",
  linkedinOpportunity:
    "Hi {name}, I’m reaching out because your experience in {role} looks relevant to an opportunity I’m working on. Would you be open to a quick chat?",
  linkedinFollowUp:
    "Hi {name}, just following up on my previous message. I think your background could be a strong fit. Happy to share more details if you're open to it.",
  linkedinCandidatePitch:
    "Hi {name}, I’m currently sourcing talent and your profile caught my attention. Your experience at {company} and background in {role} look very relevant. Would you be open to hearing about a possible opportunity?",
};

export const initialLeadForm = {
  businessName: "",
  contactName: "",
  mobile: "",
  category: "Cafe / Restaurant",
  status: "New",
  stage: "Prospect",
  followUpDate: "",
  notes: "",
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
  searchTerm: "",
  categoryFilter: "All",
  statusFilter: "All",
  stageFilter: "All",
  sortBy: "newest",
};