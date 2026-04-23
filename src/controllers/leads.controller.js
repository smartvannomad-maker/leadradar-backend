import knex from "../db/knex.js";
import { v4 as uuidv4 } from "uuid";
import { scoreLead } from "../utils/leadScoring.js";

console.log("LEAD CONTROLLER VERSION: SCORE_DEBUG_2026_04_23");

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

function normalizeLinkedInProfileUrl(value) {
  if (!value) return "";

  const raw = String(value).trim();
  if (!raw) return "";

  try {
    const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const url = new URL(withProtocol);

    url.hash = "";
    url.search = "";

    let pathname = (url.pathname || "").replace(/\/+$/, "");
    if (!pathname) pathname = "/";

    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");

    return `https://${hostname}${pathname}`.toLowerCase();
  } catch {
    return raw.toLowerCase().split("?")[0].replace(/\/+$/, "");
  }
}

function isUniqueConstraintViolation(error) {
  if (!error) return false;

  return (
    error.code === "23505" ||
    String(error.constraint || "").includes(
      "leads_workspace_id_linkedin_profile_url_unique"
    )
  );
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
    aiScore: row.ai_score ?? 0,
    aiPriority: row.ai_priority || "cold",
    aiReasons: normalizeJsonField(row.ai_reasons),
    dealProbability: row.deal_probability ?? 0,
    followUpUrgency: row.follow_up_urgency || "low",
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

  return {
    business_name: body.businessName || body.business_name || "",
    contact_name: body.contactName || body.contact_name || "",
    mobile: body.mobile || body.phone || "",
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
    linkedin_profile_url: normalizeLinkedInProfileUrl(
      body.linkedinProfileUrl || body.linkedin_profile_url || ""
    ),
    linkedin_headline: body.linkedinHeadline || body.linkedin_headline || "",
  };
}

function mapLeadPatch(body = {}) {
  const patch = {};

  if ("businessName" in body || "business_name" in body) {
    patch.business_name = body.businessName ?? body.business_name ?? "";
  }

  if ("contactName" in body || "contact_name" in body) {
    patch.contact_name = body.contactName ?? body.contact_name ?? "";
  }

  if ("mobile" in body) {
    patch.mobile = body.mobile ?? "";
  }

  if ("phone" in body && !("mobile" in body)) {
    patch.mobile = body.phone ?? "";
  }

  if ("category" in body) {
    patch.category = body.category ?? "";
  }

  if ("status" in body) {
    patch.status = body.status ?? "new";
  }

  if ("stage" in body) {
    patch.stage = body.stage ?? "new";
  }

  if ("followUpDate" in body || "follow_up_date" in body) {
    patch.follow_up_date = body.followUpDate ?? body.follow_up_date ?? null;
  }

  if ("notes" in body) {
    patch.notes = body.notes ?? "";
  }

  if ("notesHistory" in body || "notes_history" in body) {
    patch.notes_history = normalizeNotesHistory(
      body.notesHistory ?? body.notes_history
    );
  }

  if ("quoteAmount" in body || "quote_amount" in body) {
    patch.quote_amount = body.quoteAmount ?? body.quote_amount ?? null;
  }

  if ("quoteStatus" in body || "quote_status" in body) {
    patch.quote_status = body.quoteStatus ?? body.quote_status ?? "not_sent";
  }

  if ("estimatedValue" in body || "estimated_value" in body) {
    patch.estimated_value = body.estimatedValue ?? body.estimated_value ?? null;
  }

  if ("linkedinRole" in body || "linkedin_role" in body) {
    patch.linkedin_role = body.linkedinRole ?? body.linkedin_role ?? "";
  }

  if ("linkedinLocation" in body || "linkedin_location" in body) {
    patch.linkedin_location =
      body.linkedinLocation ?? body.linkedin_location ?? "";
  }

  if ("linkedinKeywords" in body || "linkedin_keywords" in body) {
    patch.linkedin_keywords =
      body.linkedinKeywords ?? body.linkedin_keywords ?? "";
  }

  if ("linkedinCompany" in body || "linkedin_company" in body) {
    patch.linkedin_company = body.linkedinCompany ?? body.linkedin_company ?? "";
  }

  if ("linkedinProfileUrl" in body || "linkedin_profile_url" in body) {
    patch.linkedin_profile_url = normalizeLinkedInProfileUrl(
      body.linkedinProfileUrl ?? body.linkedin_profile_url ?? ""
    );
  }

  if ("linkedinHeadline" in body || "linkedin_headline" in body) {
    patch.linkedin_headline =
      body.linkedinHeadline ?? body.linkedin_headline ?? "";
  }

  return patch;
}

function buildScoreInputFromDb(row = {}) {
  return {
    businessName: row.business_name || "",
    contactName: row.contact_name || "",
    mobile: row.mobile || "",
    category: row.category || "",
    status: row.status || "",
    stage: row.stage || "",
    followUpDate: row.follow_up_date || "",
    notes: row.notes || "",
    quoteAmount: row.quote_amount ?? null,
    quoteStatus: row.quote_status || "",
    linkedinRole: row.linkedin_role || "",
    linkedinLocation: row.linkedin_location || "",
    linkedinKeywords: row.linkedin_keywords || "",
    linkedinCompany: row.linkedin_company || "",
    linkedinProfileUrl: row.linkedin_profile_url || "",
    linkedinHeadline: row.linkedin_headline || "",
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

    if (!workspaceId) {
      return res.status(401).json({
        message: "Session is missing workspace access. Please log in again.",
        code: "STALE_SESSION",
      });
    }

    const workspaceExists = await knex("workspaces")
      .where({ id: workspaceId })
      .first();

    if (!workspaceExists) {
      return res.status(401).json({
        message: "Workspace not found for this session. Please log in again.",
        code: "STALE_SESSION",
      });
    }

    payload = mapLeadInput(req.body);

    if (payload.linkedin_profile_url) {
      const existingLead = await knex("leads")
        .where({
          workspace_id: workspaceId,
          linkedin_profile_url: payload.linkedin_profile_url,
        })
        .first();

      if (existingLead) {
        return res.status(409).json({
          code: "DUPLICATE_LEAD",
          message: "Lead already exists in this workspace",
          lead: normalizeLead(existingLead),
        });
      }
    }

    const ai = scoreLead({
      businessName: payload.business_name,
      contactName: payload.contact_name,
      mobile: payload.mobile,
      category: payload.category,
      status: payload.status,
      stage: payload.stage,
      followUpDate: payload.follow_up_date,
      notes: payload.notes,
      quoteAmount: payload.quote_amount,
      quoteStatus: payload.quote_status,
      linkedinRole: payload.linkedin_role,
      linkedinLocation: payload.linkedin_location,
      linkedinKeywords: payload.linkedin_keywords,
      linkedinCompany: payload.linkedin_company,
      linkedinProfileUrl: payload.linkedin_profile_url,
      linkedinHeadline: payload.linkedin_headline,
    });

    const insertData = {
      id: uuidv4(),
      ...payload,
      ai_score: ai.ai_score,
      ai_priority: ai.ai_priority,
      ai_reasons: JSON.stringify(ai.ai_reasons),
      deal_probability: ai.deal_probability,
      estimated_value: ai.estimated_value,
      next_best_action: ai.next_best_action,
      follow_up_urgency: ai.follow_up_urgency,
      workspace_id: workspaceId,
      created_by: userId,
      user_id: userId,
      user_email: userEmail,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const [created] = await knex("leads").insert(insertData).returning("*");

    return res.status(201).json({
      lead: normalizeLead(created),
    });
  } catch (error) {
    if (isUniqueConstraintViolation(error)) {
      return res.status(409).json({
        code: "DUPLICATE_LEAD",
        message: "Lead already exists in this workspace",
      });
    }

    next(error);
  }
}

export async function updateLead(req, res, next) {
  try {
    const workspaceId = req.user.workspaceId;
    const { id } = req.params;

    const existing = await knex("leads")
      .where({ id, workspace_id: workspaceId })
      .first();

    if (!existing) {
      return res.status(404).json({ message: "Lead not found." });
    }

    const payload = mapLeadPatch(req.body);

    if (!Object.keys(payload).length) {
      return res.json({
        lead: normalizeLead(existing),
      });
    }

    if (payload.linkedin_profile_url) {
      const existingLead = await knex("leads")
        .where({
          workspace_id: workspaceId,
          linkedin_profile_url: payload.linkedin_profile_url,
        })
        .whereNot({ id })
        .first();

      if (existingLead) {
        return res.status(409).json({
          code: "DUPLICATE_LEAD",
          message: "Lead already exists in this workspace",
          lead: normalizeLead(existingLead),
        });
      }
    }

    const mergedDbShape = {
      ...existing,
      ...payload,
    };

    const ai = scoreLead(buildScoreInputFromDb(mergedDbShape));

    const [updated] = await knex("leads")
      .where({ id, workspace_id: workspaceId })
      .update({
        ...payload,
        ai_score: ai.ai_score,
        ai_priority: ai.ai_priority,
        ai_reasons: JSON.stringify(ai.ai_reasons),
        deal_probability: ai.deal_probability,
        estimated_value: ai.estimated_value,
        next_best_action: ai.next_best_action,
        follow_up_urgency: ai.follow_up_urgency,
        updated_at: new Date(),
      })
      .returning("*");

    return res.json({
      lead: normalizeLead(updated),
    });
  } catch (error) {
    if (isUniqueConstraintViolation(error)) {
      return res.status(409).json({
        code: "DUPLICATE_LEAD",
        message: "Lead already exists in this workspace",
      });
    }

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

    const mergedDbShape = {
      ...existing,
      notes: noteText,
      notes_history: nextHistory,
    };

    const ai = scoreLead(buildScoreInputFromDb(mergedDbShape));

    const [updated] = await knex("leads")
      .where({
        id,
        workspace_id: workspaceId,
      })
      .update({
        notes: noteText,
        notes_history: nextHistory,
        ai_score: ai.ai_score,
        ai_priority: ai.ai_priority,
        ai_reasons: JSON.stringify(ai.ai_reasons),
        deal_probability: ai.deal_probability,
        estimated_value: ai.estimated_value,
        next_best_action: ai.next_best_action,
        follow_up_urgency: ai.follow_up_urgency,
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