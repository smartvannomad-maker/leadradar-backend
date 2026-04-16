import knex from "../db/knex.js";

function normalizeLead(row) {
  if (!row) return null;

  return {
    id: row.id,
    businessName: row.business_name || "",
    contactName: row.contact_name || "",
    email: row.email || "",
    phone: row.phone || "",
    mobile: row.mobile || "",
    location: row.location || "",
    category: row.category || "",
    status: row.status || "new",
    stage: row.stage || "new",
    followUpDate: row.follow_up_date || null,
    notes: row.notes || "",
    notesHistory: Array.isArray(row.notes_history) ? row.notes_history : [],
    quoteAmount: row.quote_amount ?? null,
    quoteStatus: row.quote_status || "not_sent",
    estimatedValue: row.estimated_value ?? null,
    source: row.source || "",
    linkedinRole: row.linkedin_role || "",
    linkedinLocation: row.linkedin_location || "",
    linkedinKeywords: row.linkedin_keywords || "",
    linkedinCompany: row.linkedin_company || "",
    linkedinProfileUrl: row.linkedin_profile_url || "",
    linkedinHeadline: row.linkedin_headline || "",
    aiScore: row.ai_score ?? null,
    aiPriority: row.ai_priority || "",
    aiReasons: row.ai_reasons || "",
    dealProbability: row.deal_probability ?? null,
    followUpUrgency: row.follow_up_urgency || "",
    nextBestAction: row.next_best_action || "",
    nextFollowUp: row.next_follow_up || null,
    workspaceId: row.workspace_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapLeadInput(body = {}) {
  return {
    business_name: body.businessName || body.business_name || "",
    contact_name: body.contactName || body.contact_name || "",
    email: body.email || "",
    phone: body.phone || "",
    mobile: body.mobile || "",
    location: body.location || "",
    category: body.category || "",
    status: body.status || "new",
    stage: body.stage || "new",
    follow_up_date: body.followUpDate || body.follow_up_date || null,
    notes: body.notes || "",
    notes_history: Array.isArray(body.notesHistory || body.notes_history)
      ? body.notesHistory || body.notes_history
      : [],
    quote_amount: body.quoteAmount ?? body.quote_amount ?? null,
    quote_status: body.quoteStatus || body.quote_status || "not_sent",
    estimated_value: body.estimatedValue ?? body.estimated_value ?? null,
    source: body.source || "",
    linkedin_role: body.linkedinRole || body.linkedin_role || "",
    linkedin_location: body.linkedinLocation || body.linkedin_location || "",
    linkedin_keywords: body.linkedinKeywords || body.linkedin_keywords || "",
    linkedin_company: body.linkedinCompany || body.linkedin_company || "",
    linkedin_profile_url:
      body.linkedinProfileUrl || body.linkedin_profile_url || "",
    linkedin_headline: body.linkedinHeadline || body.linkedin_headline || "",
    ai_score: body.aiScore ?? body.ai_score ?? null,
    ai_priority: body.aiPriority || body.ai_priority || "",
    ai_reasons: body.aiReasons || body.ai_reasons || "",
    deal_probability: body.dealProbability ?? body.deal_probability ?? null,
    follow_up_urgency:
      body.followUpUrgency || body.follow_up_urgency || "",
    next_best_action: body.nextBestAction || body.next_best_action || "",
    next_follow_up: body.nextFollowUp || body.next_follow_up || null,
  };
}

export async function getLeads(req, res, next) {
  try {
    const workspaceId = req.user.workspaceId;

    const rows = await knex("leads")
      .where({ workspace_id: workspaceId })
      .orderBy("created_at", "desc");

    return res.json({
      leads: rows.map(normalizeLead),
    });
  } catch (error) {
    next(error);
  }
}

export async function createLead(req, res, next) {
  try {
    const workspaceId = req.user.workspaceId;
    const userEmail = req.user.email || null;

    const payload = mapLeadInput(req.body);

    const [created] = await knex("leads")
      .insert({
        ...payload,
        workspace_id: workspaceId,
        user_email: userEmail,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning("*");

    return res.status(201).json({
      lead: normalizeLead(created),
    });
  } catch (error) {
    next(error);
  }
}

export async function updateLead(req, res, next) {
  try {
    const workspaceId = req.user.workspaceId;
    const { id } = req.params;

    const payload = mapLeadInput(req.body);

    const [updated] = await knex("leads")
      .where({
        id,
        workspace_id: workspaceId,
      })
      .update({
        ...payload,
        updated_at: new Date(),
      })
      .returning("*");

    if (!updated) {
      return res.status(404).json({ message: "Lead not found." });
    }

    return res.json({
      lead: normalizeLead(updated),
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteLead(req, res, next) {
  try {
    const workspaceId = req.user.workspaceId;
    const { id } = req.params;

    const deletedCount = await knex("leads")
      .where({
        id,
        workspace_id: workspaceId,
      })
      .del();

    if (!deletedCount) {
      return res.status(404).json({ message: "Lead not found." });
    }

    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

export async function addLeadNote(req, res, next) {
  try {
    const workspaceId = req.user.workspaceId;
    const { id } = req.params;
    const noteText = String(req.body?.text || req.body?.note || "").trim();

    if (!noteText) {
      return res.status(400).json({ message: "Note text is required." });
    }

    const existing = await knex("leads")
      .where({
        id,
        workspace_id: workspaceId,
      })
      .first();

    if (!existing) {
      return res.status(404).json({ message: "Lead not found." });
    }

    const currentHistory = Array.isArray(existing.notes_history)
      ? existing.notes_history
      : [];

    const nextHistory = [
      ...currentHistory,
      {
        text: noteText,
        createdAt: new Date().toISOString(),
      },
    ];

    const [updated] = await knex("leads")
      .where({
        id,
        workspace_id: workspaceId,
      })
      .update({
        notes: noteText,
        notes_history: JSON.stringify(nextHistory),
        updated_at: new Date(),
      })
      .returning("*");

    return res.json({
      lead: normalizeLead({
        ...updated,
        notes_history: nextHistory,
      }),
    });
  } catch (error) {
    next(error);
  }
}