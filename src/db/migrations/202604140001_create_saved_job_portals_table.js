export async function up(knex) {
  const exists = await knex.schema.hasTable("saved_job_portals");

  if (!exists) {
    await knex.schema.createTable("saved_job_portals", (table) => {
      table.increments("id").primary();
      table.uuid("user_id").notNullable();
      table.uuid("workspace_id").notNullable();
      table.string("name").notNullable();
      table.text("url").notNullable();
      table.string("source").nullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
    return;
  }

  const hasUserId = await knex.schema.hasColumn("saved_job_portals", "user_id");
  const hasWorkspaceId = await knex.schema.hasColumn("saved_job_portals", "workspace_id");

  if (hasUserId || hasWorkspaceId) {
    await knex.schema.dropTable("saved_job_portals");
  }

  await knex.schema.createTable("saved_job_portals", (table) => {
    table.increments("id").primary();
    table.uuid("user_id").notNullable();
    table.uuid("workspace_id").notNullable();
    table.string("name").notNullable();
    table.text("url").notNullable();
    table.string("source").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("saved_job_portals");
}