import express from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../db/knex.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { scoreLead } from "../utils/leadScoring.js";

const router = express.Router();

router.use(requireAuth);

function safeJsonParse(value, fallback = []) {
  try {
    if (typeof value === "string") {
      return JSON.parse(value || "[]");
    }
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function normalizeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function mapLead(row) {
  return {
    id: row.id,
    businessName: row.business_name,
    contactName: row.contact_name,

    // These do not exist in your current DB schema yet.
    phone: "",
    mobile: "",
    location: "",

    source: row.source,
    category: row.category,
    status: row.status,
    stage: row.stage,
    followUpDate: row.follow_up_date,
    nextFollowUp: row.next_follow_up,
    notes: row.notes,
    notesHistory: safeJsonParse(row.notes_history, []),
    quoteAmount: row.quote_amount,
    quoteStatus: row.quote_status,
    linkedinRole: row.linkedin_role,
    linkedinLocation: row.linkedin_location,
    linkedinKeywords: row.linkedin_keywords,
    linkedinCompany: row.linkedin_company,
    linkedinProfileUrl: row.linkedin_profile_url,
    linkedinHeadline: row.linkedin_headline,
    ai_score: row.ai_score || 0,
    ai_priority: row.ai_priority || "cold",
    ai_reasons: safeJsonParse(row.ai_reasons, []),
    deal_probability: row.deal_probability || 0,
    estimated_value: row.estimated_value || 0,
    next_best_action: row.next_best_action || "",
    follow_up_urgency: row.follow_up_urgency || "low",
    workspaceId: row.workspace_id,
    createdBy: row.created_by,
    userEmail: row.user_email,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function buildLeadScoreInput(body = {}, existingLead = null) {
  return {
    businessName:
      body.businessName ??
      existingLead?.business_name ??
      "",
    contactName:
      body.contactName ??
      existingLead?.contact_name ??
      "",

    // Not in DB yet, but safe for scoring input
    phone: body.phone ?? "",
    mobile: body.mobile ?? "",
    location: body.location ?? "",

    source:
      body.source ??
      existingLead?.source ??
      "",
    category:
      body.category ??
      existingLead?.category ??
      "",
    status:
      body.status ??
      existingLead?.status ??
      "",
    stage:
      body.stage ??
      existingLead?.stage ??
      "",
    followUpDate:
      body.followUpDate ??
      existingLead?.follow_up_date ??
      null,
    nextFollowUp:
      body.nextFollowUp ??
      existingLead?.next_follow_up ??
      null,
    notes:
      body.notes ??
      existingLead?.notes ??
      "",
    notesHistory: Array.isArray(body.notesHistory)
      ? body.notesHistory
      : safeJsonParse(existingLead?.notes_history, []),
    quoteAmount:
      body.quoteAmount ??
      existingLead?.quote_amount ??
      null,
    quoteStatus:
      body.quoteStatus ??
      existingLead?.quote_status ??
      "",
    linkedinRole:
      body.linkedinRole ??
      existingLead?.linkedin_role ??
      "",
    linkedinLocation:
      body.linkedinLocation ??
      existingLead?.linkedin_location ??
      "",
    linkedinKeywords:
      body.linkedinKeywords ??
      existingLead?.linkedin_keywords ??
      "",
    linkedinCompany:
      body.linkedinCompany ??
      existingLead?.linkedin_company ??
      "",
    linkedinProfileUrl:
      body.linkedinProfileUrl ??
      existingLead?.linkedin_profile_url ??
      "",
    linkedinHeadline:
      body.linkedinHeadline ??
      existingLead?.linkedin_headline ??
      "",
    estimatedValue:
      body.estimatedValue ??
      existingLead?.estimated_value ??
      0,
    dealProbability:
      body.dealProbability ??
      existingLead?.deal_probability ??
      0,
  };
}

function parseImportRow(row = {}) {
  const baseLead = {
    businessName: normalizeText(
      row.businessName || row["Business Name"] || row.business_name
    ),
    contactName: normalizeText(
      row.contactName || row["Contact Name"] || row.contact_name
    ),
    source: normalizeText(row.source || row.Source) || "LinkedIn",
    category: normalizeText(row.category || row.Category) || "Small Business",
    status: normalizeText(row.status || row.Status) || "New",
    stage: normalizeText(row.stage || row.Stage) || "Prospect",
    followUpDate:
      row.followUpDate ||
      row["Follow Up Date"] ||
      row.follow_up_date ||
      null,
    nextFollowUp:
      row.nextFollowUp ||
      row["Next Follow Up"] ||
      row.next_follow_up ||
      null,
    notes: normalizeText(row.notes || row.Notes),
    quoteAmount:
      row.quoteAmount || row["Quote Amount"] || row.quote_amount || null,
    quoteStatus:
      normalizeText(
        row.quoteStatus || row["Quote Status"] || row.quote_status
      ) || "not_sent",
    linkedinRole: normalizeText(
      row.linkedinRole || row["LinkedIn Role"] || row.linkedin_role
    ),
    linkedinLocation: normalizeText(
      row.linkedinLocation || row["LinkedIn Location"] || row.linkedin_location
    ),
    linkedinKeywords: normalizeText(
      row.linkedinKeywords || row["LinkedIn Keywords"] || row.linkedin_keywords
    ),
    linkedinCompany: normalizeText(
      row.linkedinCompany || row["LinkedIn Company"] || row.linkedin_company
    ),
    linkedinProfileUrl: normalizeText(
      row.linkedinProfileUrl ||
        row["LinkedIn Profile URL"] ||
        row.linkedin_profile_url
    ),
    linkedinHeadline: normalizeText(
      row.linkedinHeadline || row["LinkedIn Headline"] || row.linkedin_headline
    ),
    estimatedValue:
      row.estimatedValue || row["Estimated Value"] || row.estimated_value || 0,
    dealProbability:
      row.dealProbability ||
      row["Deal Probability"] ||
      row.deal_probability ||
      0,
  };

  const ai = scoreLead(baseLead);

  return {
    business_name: baseLead.businessName,
    contact_name: baseLead.contactName,
    source: baseLead.source,
    category: baseLead.category,
    status: baseLead.status,
    stage: baseLead.stage,
    follow_up_date: baseLead.followUpDate,
    next_follow_up: baseLead.nextFollowUp,
    notes: baseLead.notes,
    notes_history: JSON.stringify(
      baseLead.notes
        ? [
            {
              text: baseLead.notes,
              createdAt: new Date().toISOString(),
            },
          ]
        : []
    ),
    quote_amount: baseLead.quoteAmount,
    quote_status: baseLead.quoteStatus,
    linkedin_role: baseLead.linkedinRole,
    linkedin_location: baseLead.linkedinLocation,
    linkedin_keywords: baseLead.linkedinKeywords,
    linkedin_company: baseLead.linkedinCompany,
    linkedin_profile_url: baseLead.linkedinProfileUrl,
    linkedin_headline: baseLead.linkedinHeadline,
    ai_score: ai.ai_score,
    ai_priority: ai.ai_priority,
    ai_reasons: JSON.stringify(ai.ai_reasons),
    deal_probability: ai.deal_probability,
    estimated_value: ai.estimated_value,
    next_best_action: ai.next_best_action,
    follow_up_urgency: ai.follow_up_urgency,
  };
}

router.get("/", async (req, res) => {
  try {
    if (!req.user?.workspaceId) {
      return res.status(400).json({ message: "Workspace not resolved" });
    }

    const leads = await db("leads")
      .where({ workspace_id: req.user.workspaceId })
      .orderBy([
        { column: "ai_score", order: "desc" },
        { column: "created_at", order: "desc" },
      ]);

    return res.json(leads.map(mapLead));
  } catch (error) {
    console.error("GET /api/leads error:", error);
    return res.status(500).json({ message: "Failed to load leads" });
  }
});

router.post("/", async (req, res) => {
  try {
    if (!req.user?.workspaceId) {
      return res.status(400).json({ message: "Workspace not resolved" });
    }

    const body = req.body || {};
    const ai = scoreLead(buildLeadScoreInput(body));

    const lead = {
      id: uuidv4(),
      workspace_id: req.user.workspaceId,
      created_by: req.user.userId,
      user_email: req.user.email || null,
      business_name: normalizeText(body.businessName) || "New Lead",
      contact_name: normalizeText(body.contactName) || "",
      source: normalizeText(body.source) || "LinkedIn",
      category: normalizeText(body.category) || "Small Business",
      status: normalizeText(body.status) || "New",
      stage: normalizeText(body.stage) || "Prospect",
      follow_up_date: body.followUpDate || null,
      next_follow_up: body.nextFollowUp || null,
      notes: normalizeText(body.notes) || "",
      notes_history: JSON.stringify(
        Array.isArray(body.notesHistory) ? body.notesHistory : []
      ),
      quote_amount: body.quoteAmount ?? null,
      quote_status: normalizeText(body.quoteStatus) || "not_sent",
      linkedin_role: normalizeText(body.linkedinRole) || "",
      linkedin_location: normalizeText(body.linkedinLocation) || "",
      linkedin_keywords: normalizeText(body.linkedinKeywords) || "",
      linkedin_company: normalizeText(body.linkedinCompany) || "",
      linkedin_profile_url: normalizeText(body.linkedinProfileUrl) || "",
      linkedin_headline: normalizeText(body.linkedinHeadline) || "",
      ai_score: ai.ai_score,
      ai_priority: ai.ai_priority,
      ai_reasons: JSON.stringify(ai.ai_reasons),
      deal_probability: ai.deal_probability,
      estimated_value: ai.estimated_value,
      next_best_action: ai.next_best_action,
      follow_up_urgency: ai.follow_up_urgency,
      created_at: new Date(),
      updated_at: new Date(),
    };

    await db("leads").insert(lead);

    const createdLead = await db("leads")
      .where({
        id: lead.id,
        workspace_id: req.user.workspaceId,
      })
      .first();

    return res.status(201).json(mapLead(createdLead));
  } catch (error) {
    console.error("POST /api/leads error:", error);
    return res.status(500).json({
      message: error.message || "Failed to create lead",
    });
  }
});

router.post("/import", async (req, res) => {
  try {
    if (!req.user?.workspaceId) {
      return res.status(400).json({ message: "Workspace not resolved" });
    }

    const rows = Array.isArray(req.body?.rows) ? req.body.rows : [];

    if (!rows.length) {
      return res.status(400).json({ message: "No rows provided for import" });
    }

    const created = [];
    const skipped = [];
    const errors = [];

    for (let index = 0; index < rows.length; index += 1) {
      const rawRow = rows[index];
      const parsed = parseImportRow(rawRow);

      if (!parsed.business_name) {
        errors.push({
          row: index + 1,
          reason: "Business name is required",
        });
        continue;
      }

      const duplicate = await db("leads")
        .where({
          workspace_id: req.user.workspaceId,
          business_name: parsed.business_name,
          contact_name: parsed.contact_name,
        })
        .first();

      if (duplicate) {
        skipped.push({
          row: index + 1,
          businessName: parsed.business_name,
          reason: "Duplicate lead skipped",
        });
        continue;
      }

      const lead = {
        id: uuidv4(),
        workspace_id: req.user.workspaceId,
        created_by: req.user.userId,
        user_email: req.user.email || null,
        ...parsed,
        created_at: new Date(),
        updated_at: new Date(),
      };

      await db("leads").insert(lead);
      created.push(lead.id);
    }

    const createdRows = created.length
      ? await db("leads")
          .whereIn("id", created)
          .andWhere({ workspace_id: req.user.workspaceId })
          .orderBy([{ column: "created_at", order: "desc" }])
      : [];

    return res.status(201).json({
      message: "Import complete",
      importedCount: createdRows.length,
      skippedCount: skipped.length,
      errorCount: errors.length,
      skipped,
      errors,
      leads: createdRows.map(mapLead),
    });
  } catch (error) {
    console.error("POST /api/leads/import error:", error);
    return res.status(500).json({ message: "Failed to import leads" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    if (!req.user?.workspaceId) {
      return res.status(400).json({ message: "Workspace not resolved" });
    }

    const existingLead = await db("leads")
      .where({
        id: req.params.id,
        workspace_id: req.user.workspaceId,
      })
      .first();

    if (!existingLead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const updates = {
      updated_at: new Date(),
    };

    const fieldMap = {
      businessName: "business_name",
      contactName: "contact_name",
      source: "source",
      category: "category",
      status: "status",
      stage: "stage",
      followUpDate: "follow_up_date",
      nextFollowUp: "next_follow_up",
      notes: "notes",
      quoteAmount: "quote_amount",
      quoteStatus: "quote_status",
      linkedinRole: "linkedin_role",
      linkedinLocation: "linkedin_location",
      linkedinKeywords: "linkedin_keywords",
      linkedinCompany: "linkedin_company",
      linkedinProfileUrl: "linkedin_profile_url",
      linkedinHeadline: "linkedin_headline",
    };

    for (const [key, value] of Object.entries(req.body || {})) {
      if (fieldMap[key]) {
        updates[fieldMap[key]] = value;
      }
    }

    if (Array.isArray(req.body?.notesHistory)) {
      updates.notes_history = JSON.stringify(req.body.notesHistory);
    }

    const ai = scoreLead(buildLeadScoreInput(req.body, existingLead));

    updates.ai_score = ai.ai_score;
    updates.ai_priority = ai.ai_priority;
    updates.ai_reasons = JSON.stringify(ai.ai_reasons);
    updates.deal_probability = ai.deal_probability;
    updates.estimated_value = ai.estimated_value;
    updates.next_best_action = ai.next_best_action;
    updates.follow_up_urgency = ai.follow_up_urgency;

    await db("leads")
      .where({
        id: req.params.id,
        workspace_id: req.user.workspaceId,
      })
      .update(updates);

    const updatedLead = await db("leads")
      .where({
        id: req.params.id,
        workspace_id: req.user.workspaceId,
      })
      .first();

    return res.json(mapLead(updatedLead));
  } catch (error) {
    console.error("PATCH /api/leads/:id error:", error);
    return res.status(500).json({ message: "Failed to update lead" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (!req.user?.workspaceId) {
      return res.status(400).json({ message: "Workspace not resolved" });
    }

    const deleted = await db("leads")
      .where({
        id: req.params.id,
        workspace_id: req.user.workspaceId,
      })
      .del();

    if (!deleted) {
      return res.status(404).json({ message: "Lead not found" });
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/leads/:id error:", error);
    return res.status(500).json({ message: "Failed to delete lead" });
  }
});

router.post("/:id/notes", async (req, res) => {
  try {
    if (!req.user?.workspaceId) {
      return res.status(400).json({ message: "Workspace not resolved" });
    }

    const lead = await db("leads")
      .where({
        id: req.params.id,
        workspace_id: req.user.workspaceId,
      })
      .first();

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const existingHistory = safeJsonParse(lead.notes_history, []);
    const nextHistory = [
      ...existingHistory,
      {
        text: req.body?.text || "",
        createdAt: new Date().toISOString(),
      },
    ];

    const ai = scoreLead(
      buildLeadScoreInput(
        { notesHistory: nextHistory },
        lead
      )
    );

    await db("leads")
      .where({
        id: req.params.id,
        workspace_id: req.user.workspaceId,
      })
      .update({
        notes_history: JSON.stringify(nextHistory),
        ai_score: ai.ai_score,
        ai_priority: ai.ai_priority,
        ai_reasons: JSON.stringify(ai.ai_reasons),
        deal_probability: ai.deal_probability,
        estimated_value: ai.estimated_value,
        next_best_action: ai.next_best_action,
        follow_up_urgency: ai.follow_up_urgency,
        updated_at: new Date(),
      });

    const updatedLead = await db("leads")
      .where({
        id: req.params.id,
        workspace_id: req.user.workspaceId,
      })
      .first();

    return res.json(mapLead(updatedLead));
  } catch (error) {
    console.error("POST /api/leads/:id/notes error:", error);
    return res.status(500).json({ message: "Failed to save note" });
  }
});

export default router;