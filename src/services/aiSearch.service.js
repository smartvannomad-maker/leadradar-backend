import client from "./openai.service.js";
import db from "../db/knex.js";

function safe(value) {
  return String(value || "").trim();
}

function buildPrompt({ query, filters, localLeads }) {
  return `
You are LeadRadar AI Search.

User query:
${query}

Filters:
${JSON.stringify(filters || {}, null, 2)}

Internal CRM leads:
${JSON.stringify(localLeads || [], null, 2)}

Your job:
1. Understand the search intent
2. Find relevant matches from internal leads
3. Find additional relevant prospects using web search
4. Return structured JSON

Rules:
- Keep answers practical and sales-focused
- Prefer local (South Africa) results if relevant
- Do NOT invent URLs
- Keep snippets short
- Suggested actions must be actionable

Return ONLY JSON.
  `.trim();
}

function mapLeadToInternalResult(lead) {
  return {
    title:
      lead.contact_name ||
      lead.linkedin_role ||
      "Existing lead",
    company:
      lead.business_name ||
      lead.linkedin_company ||
      "Unknown company",
    location:
      lead.linkedin_location ||
      "Unknown location",
    reason:
      "Matched from your workspace data. Review this lead and decide whether to follow up or enrich.",
  };
}

function buildMockResult({ query, filters, localLeads }) {
  const internalResults = (localLeads || [])
    .slice(0, 3)
    .map(mapLeadToInternalResult);

  return {
    query,
    filters,
    localLeadCount: localLeads.length,
    summary:
      "Mock AI mode is active. These are test results so you can validate the UI and workflow without using the OpenAI API.",
    internal_results: internalResults,
    web_results: [
      {
        title: "Example prospect source",
        url: "https://example.com/prospect-1",
        source: "Mock Web Result",
        snippet:
          "This is a placeholder result for testing your AI Search UI layout.",
      },
      {
        title: "Example company listing",
        url: "https://example.com/prospect-2",
        source: "Mock Directory",
        snippet:
          "Use this to verify result cards, buttons, and interactions.",
      },
    ],
    suggested_actions: [
      "Review internal matches first.",
      "Test the result cards UI.",
      "Add Save as Lead functionality next.",
    ],
  };
}

async function getLocalLeads({ workspaceId, filters }) {
  if (!workspaceId) return [];

  const query = db("leads")
    .where({ workspace_id: workspaceId })
    .orderBy("updated_at", "desc")
    .limit(20);

  const location = safe(filters.location);
  const industry = safe(filters.industry);

  // ✅ FIXED: no 'location' column
  if (location) {
    query.andWhere((builder) => {
      builder
        .whereILike("linkedin_location", `%${location}%`)
        .orWhereILike("business_name", `%${location}%`);
    });
  }

  // ✅ FIXED: no 'category' column
  if (industry) {
    query.andWhere((builder) => {
      builder
        .whereILike("linkedin_company", `%${industry}%`)
        .orWhereILike("business_name", `%${industry}%`)
        .orWhereILike("notes", `%${industry}%`);
    });
  }

  return query;
}

export async function runAISearch({ query, filters = {}, user }) {
  const workspaceId = user?.workspace_id || user?.workspaceId;

  const localLeads = await getLocalLeads({
    workspaceId,
    filters,
  });

  // ✅ MOCK MODE (for testing without billing)
  if (process.env.AI_SEARCH_MOCK_MODE === "true") {
    return buildMockResult({
      query,
      filters,
      localLeads,
    });
  }

  const prompt = buildPrompt({
    query,
    filters,
    localLeads,
  });

  const response = await client.responses.create({
    model: "gpt-5.4",
    input: prompt,
    tools: [{ type: "web_search" }],
    text: {
      format: {
        type: "json_schema",
        name: "ai_search",
        strict: true,
        schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            internal_results: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  company: { type: "string" },
                  location: { type: "string" },
                  reason: { type: "string" },
                },
                required: ["title", "company", "location", "reason"],
                additionalProperties: false,
              },
            },
            web_results: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  url: { type: "string" },
                  source: { type: "string" },
                  snippet: { type: "string" },
                },
                required: ["title", "url", "source", "snippet"],
                additionalProperties: false,
              },
            },
            suggested_actions: {
              type: "array",
              items: { type: "string" },
            },
          },
          required: [
            "summary",
            "internal_results",
            "web_results",
            "suggested_actions",
          ],
          additionalProperties: false,
        },
      },
    },
  });

  const parsed = JSON.parse(response.output_text);

  return {
    query,
    filters,
    localLeadCount: localLeads.length,
    ...parsed,
  };
}