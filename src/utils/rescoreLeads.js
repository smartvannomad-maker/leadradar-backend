import db from "../db/knex.js";
import { scoreLead } from "./leadScoring.js";

async function run() {
  try {
    const leads = await db("leads").select("*");

    console.log(`Found ${leads.length} leads to rescore`);

    for (const lead of leads) {
      const ai = scoreLead({
        businessName: lead.business_name,
        contactName: lead.contact_name,
        mobile: lead.mobile,
        category: lead.category,
        status: lead.status,
        stage: lead.stage,
        followUpDate: lead.follow_up_date,
        notes: lead.notes,
        notesHistory: Array.isArray(lead.notes_history)
          ? lead.notes_history
          : typeof lead.notes_history === "string"
            ? JSON.parse(lead.notes_history || "[]")
            : [],
        quoteAmount: lead.quote_amount,
        quoteStatus: lead.quote_status,
        linkedinRole: lead.linkedin_role,
        linkedinLocation: lead.linkedin_location,
        linkedinKeywords: lead.linkedin_keywords,
        linkedinCompany: lead.linkedin_company,
        linkedinProfileUrl: lead.linkedin_profile_url,
        linkedinHeadline: lead.linkedin_headline,
      });

      await db("leads")
        .where({ id: lead.id })
        .update({
          ai_score: ai.ai_score,
          ai_priority: ai.ai_priority,
          ai_reasons: JSON.stringify(ai.ai_reasons),
          deal_probability: ai.deal_probability,
          estimated_value: ai.estimated_value,
          next_best_action: ai.next_best_action,
          follow_up_urgency: ai.follow_up_urgency,
          updated_at: new Date(),
        });
    }

    console.log("✅ Rescoring complete");
    process.exit(0);
  } catch (error) {
    console.error("❌ Rescoring failed:", error);
    process.exit(1);
  }
}

run();