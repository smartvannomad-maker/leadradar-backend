import db from "../db/knex.js";

function normalizeSourceConfig(sourceType, value) {
  const cleanValue = String(value || "").trim();

  if (!cleanValue) {
    throw new Error("Source value is required.");
  }

  if (sourceType === "greenhouse") {
    return { boardToken: cleanValue };
  }

  if (sourceType === "lever") {
    return { companyHandle: cleanValue };
  }

  if (sourceType === "ashby") {
    return { organizationSlug: cleanValue };
  }

  if (sourceType === "rss") {
    return { feedUrl: cleanValue };
  }

  if (sourceType === "manual_url") {
    return { url: cleanValue };
  }

  throw new Error("Unsupported source type.");
}

export async function listJobSourceConfigs(workspaceId) {
  return db("job_source_configs")
    .where({ workspace_id: workspaceId })
    .orderBy("created_at", "desc");
}

export async function createJobSourceConfig(workspaceId, { label, sourceType, value }) {
  const cleanLabel = String(label || "").trim();

  if (!cleanLabel) {
    throw new Error("Label is required.");
  }

  const config = normalizeSourceConfig(sourceType, value);

  const [row] = await db("job_source_configs")
    .insert({
      workspace_id: workspaceId,
      label: cleanLabel,
      source_type: sourceType,
      config: JSON.stringify(config),
      is_active: true,
      updated_at: db.fn.now(),
    })
    .returning("*");

  return row;
}

export async function deleteJobSourceConfig(workspaceId, sourceId) {
  const deleted = await db("job_source_configs")
    .where({
      id: sourceId,
      workspace_id: workspaceId,
    })
    .del();

  return deleted;
}