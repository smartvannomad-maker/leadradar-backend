import knex from "../db/knex.js";
import { v4 as uuidv4 } from "uuid";

function normalizeNotesHistory(value) {
  if (Array.isArray(value)) return value;

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  return [];
}

function normalizeJsonField(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") return value;

  if (typeof value === "string") {
    const trimmed = value.trim();

    if (!trimmed) return [];

    try {
      return JSON.parse(trimmed);
    } catch {
      return [];
    }
  }

  return [];
}

function normalizeLead(row) {
  if (!row) return null;

  return {
    id: row.id,
    businessName: row.business_name || "",
    contactName: row.contact_name || "",
    mobile: row.mobile || "",
    category: row.category || "",
    status: row.status || "new",
    stage: row.stage || "new",
    followUpDate: row.follow_up_date || null,
    notes: row.notes || "",
    notesHistory: normalizeNotesHistory(row.notes_history),
    quoteAmount: row.quote_amount ?? null,
    quoteStatus: row.quote_status || "not_sent",
    estimatedValue: row.estimated_value ?? null,
    linkedinRole: row.linkedin_role || "",
    linkedinLocation: row.linkedin_location || "",
    linkedinKeywords: row.linkedin_keywords || "",
    linkedinCompany: row.linkedin_company || "",
    linkedinProfileUrl: row.linkedin_profile_url || "",
    linkedinHeadline: row.linkedin_headline || "",
    aiScore: row.ai_score ?? null,
    aiPriority: row.ai_priority || "",
    aiReasons: normalizeJsonField(row.ai_reasons),
    dealProbability: row.deal_probability ?? null,
    followUpUrgency: row.follow_up_urgency || "",
    nextBestAction: row.next_best_action || "",
    workspaceId: row.workspace_id || "",
    createdBy: row.created_by || "",
    userId: row.user_id || "",
    userEmail: row.user_email || "",
    createdAt: row.created_at || null,
    updatedAt: row.updated_at || null,
  };
}

function mapLeadInput(body = {}) {
  const notesHistoryValue = body.notesHistory ?? body.notes_history;
  const aiReasonsValue = body.aiReasons ?? body.ai_reasons;

  return {
    business_name: body.businessName || body.business_name || "",
    contact_name: body.contactName || body.contact_name || "",
    mobile: body.mobile || "",
    category: body.category || "",
    status: body.status || "new",
    stage: body.stage || "new",
    follow_up_date: body.followUpDate || body.follow_up_date || null,
    notes: body.notes || "",
    notes_history: normalizeNotesHistory(notesHistoryValue),
    quote_amount: body.quoteAmount ?? body.quote_amount ?? null,
    quote_status: body.quoteStatus || body.quote_status || "not_sent",
    estimated_value: body.estimatedValue ?? body.estimated_value ?? null,
    linkedin_role: body.linkedinRole || body.linkedin_role || "",
    linkedin_location: body.linkedinLocation || body.linkedin_location || "",
    linkedin_keywords: body.linkedinKeywords || body.linkedin_keywords || "",
    linkedin_company: body.linkedinCompany || body.linkedin_company || "",
    linkedin_profile_url:
      body.linkedinProfileUrl || body.linkedin_profile_url || "",
    linkedin_headline: body.linkedinHeadline || body.linkedin_headline || "",
    ai_score: body.aiScore ?? body.ai_score ?? null,
    ai_priority: body.aiPriority || body.ai_priority || "",
    ai_reasons: normalizeJsonField(aiReasonsValue),
    deal_probability: body.dealProbability ?? body.deal_probability ?? null,
    follow_up_urgency:
      body.followUpUrgency || body.follow_up_urgency || "",
    next_best_action: body.nextBestAction || body.next_best_action || "",
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
  let payload;

  try {
    const workspaceId = req.user.workspaceId;
    const userId = req.user.userId || req.user.id || null;
    const userEmail = req.user.email || null;

    payload = mapLeadInput(req.body);

    console.log("🚀 NEW CREATE LEAD CONTROLLER RUNNING", {
      workspaceId,
      userId,
      userEmail,
      payloadKeys: Object.keys(payload || {}),
      payload,
    });

    const insertData = {
      id: uuidv4(),
      ...payload,
      workspace_id: workspaceId,
      created_by: userId,
      user_id: userId,
      user_email: userEmail,
      created_at: new Date(),
      updated_at: new Date(),
    };

    console.log("🚀 LEAD INSERT DATA", insertData);

    const [created] = await knex("leads")
      .insert(insertData)
      .returning("*");

    return res.status(201).json({
      lead: normalizeLead(created),
    });
  } catch (error) {
    console.error("createLead error:", error.message || error);
    console.error("createLead payload:", payload);
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

    const currentHistory = normalizeNotesHistory(existing.notes_history);

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
        notes_history: nextHistory,
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