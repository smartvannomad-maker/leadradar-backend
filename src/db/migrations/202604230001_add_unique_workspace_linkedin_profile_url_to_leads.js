function normalizeLinkedInProfileUrl(value) {
  if (!value) return "";

  const raw = String(value).trim();
  if (!raw) return "";

  try {
    const withProtocol = /^https?:\/\//i.test(raw)
      ? raw
      : `https://${raw}`;

    const url = new URL(withProtocol);

    url.hash = "";
    url.search = "";

    let pathname = (url.pathname || "").replace(/\/+$/, "");
    if (!pathname) pathname = "/";

    const hostname = url.hostname.toLowerCase().replace(/^www\./, "");

    return `https://${hostname}${pathname}`.toLowerCase();
  } catch {
    return raw
      .toLowerCase()
      .split("?")[0]
      .replace(/\/+$/, "");
  }
}

export async function up(knex) {
  const leads = await knex("leads").select("id", "linkedin_profile_url");

  for (const lead of leads) {
    const normalizedUrl = normalizeLinkedInProfileUrl(lead.linkedin_profile_url);

    if (normalizedUrl !== (lead.linkedin_profile_url || "")) {
      await knex("leads")
        .where({ id: lead.id })
        .update({
          linkedin_profile_url: normalizedUrl,
          updated_at: new Date(),
        });
    }
  }

  const duplicateRows = await knex("leads")
    .select("workspace_id", "linkedin_profile_url")
    .whereNotNull("linkedin_profile_url")
    .where("linkedin_profile_url", "<>", "")
    .groupBy("workspace_id", "linkedin_profile_url")
    .havingRaw("COUNT(*) > 1");

  if (duplicateRows.length > 0) {
    const duplicateList = duplicateRows
      .map(
        (row) =>
          `workspace_id=${row.workspace_id}, linkedin_profile_url=${row.linkedin_profile_url}`
      )
      .join(" | ");

    throw new Error(
      `Cannot add unique constraint to leads: duplicate LinkedIn URLs already exist. Resolve duplicates first. ${duplicateList}`
    );
  }

  await knex.schema.alterTable("leads", (table) => {
    table.unique(
      ["workspace_id", "linkedin_profile_url"],
      "leads_workspace_id_linkedin_profile_url_unique"
    );
  });
}

export async function down(knex) {
  await knex.schema.alterTable("leads", (table) => {
    table.dropUnique(
      ["workspace_id", "linkedin_profile_url"],
      "leads_workspace_id_linkedin_profile_url_unique"
    );
  });
}