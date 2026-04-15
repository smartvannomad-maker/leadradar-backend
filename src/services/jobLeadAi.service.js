function parseMaybeJson(value, fallback) {
  if (Array.isArray(value) || (value && typeof value === "object")) {
    return value;
  }

  try {
    return JSON.parse(value || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

export function buildJobLeadPrompt({ jobPost, lead }) {
  const techStack = parseMaybeJson(jobPost.tech_stack, []);
  const signals = parseMaybeJson(jobPost.signals, {});

  return `
You are a B2B sales strategist for a lead-generation SaaS.

Your task:
Turn a hiring post into a recruiter or dev-agency outreach opportunity.

Company: ${jobPost.company_name}
Job title: ${jobPost.title}
Location: ${jobPost.location || "Unknown"}
Work model: ${jobPost.work_model || "Unknown"}
Employment type: ${jobPost.employment_type || "Unknown"}
Tech stack: ${techStack.join(", ") || "Unknown"}
Signals: ${JSON.stringify(signals)}
Description:
${jobPost.description || ""}

Decision maker: ${lead.decision_maker_name || "Unknown"}
Decision maker title: ${lead.decision_maker_title || "Unknown"}

Return valid JSON with:
{
  "painPoint": "",
  "pitchAngle": "",
  "summary": "",
  "outreachMessage": ""
}

Requirements:
- painPoint: one concise paragraph
- pitchAngle: one concise paragraph
- summary: 2-3 lines
- outreachMessage: short, human, non-spammy
- focus on helping them hire faster or fill roles with qualified candidates
`;
}