import db from "../db/knex.js";
import { buildJobLeadPrompt } from "./jobLeadAi.service.js";

// If you already have an OpenAI utility, swap it in here.
// Example:
// import openai from "../utils/openai.js";

export async function generateJobLeadAiCopy({ workspaceId, leadId }) {
  const lead = await db("job_leads")
    .where({ id: leadId, workspace_id: workspaceId })
    .first();

  if (!lead) {
    const error = new Error("Lead not found.");
    error.status = 404;
    throw error;
  }

  const jobPost = await db("job_posts")
    .where({ id: lead.job_post_id, workspace_id: workspaceId })
    .first();

  if (!jobPost) {
    const error = new Error("Source job post not found.");
    error.status = 404;
    throw error;
  }

  const prompt = buildJobLeadPrompt({ jobPost, lead });

  // Replace this mock block with your real OpenAI call if already wired.
  // const response = await openai.responses.create({
  //   model: "gpt-5",
  //   input: prompt,
  // });
  // const text = response.output_text;

  const text = JSON.stringify({
    painPoint: `${jobPost.company_name} is actively hiring for ${jobPost.title}, which suggests hiring urgency, delivery pressure, or a gap in sourcing bandwidth.`,
    pitchAngle: `Position LeadRadar as a way to speed up sourcing and surface stronger-fit candidates, while giving the hiring team faster market visibility.`,
    summary: `${jobPost.company_name} is showing active hiring intent.\nThis makes them a strong outbound opportunity for recruiter or dev staffing services.`,
    outreachMessage: `Hi ${lead.decision_maker_name || "there"}, I noticed you're hiring for ${jobPost.title}. We help teams shorten sourcing time by identifying stronger-fit candidates faster. Would you be open to a quick chat?`,
  });

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    const error = new Error("AI response could not be parsed.");
    error.status = 500;
    throw error;
  }

  const [updated] = await db("job_leads")
    .where({ id: leadId, workspace_id: workspaceId })
    .update({
      pain_point: parsed.painPoint || null,
      pitch_angle: parsed.pitchAngle || null,
      ai_summary: parsed.summary || null,
      outreach_message: parsed.outreachMessage || null,
      updated_at: db.fn.now(),
    })
    .returning("*");

  return updated;
}