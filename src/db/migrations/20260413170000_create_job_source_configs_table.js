export async function up(knex) {
  await knex.schema.createTable("job_source_configs", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));

    table
      .uuid("workspace_id")
      .notNullable()
      .references("id")
      .inTable("workspaces")
      .onDelete("CASCADE");

    table.string("label", 255).notNullable();
    table.string("source_type", 50).notNullable(); // greenhouse, lever, ashby, rss, manual_url
    table.jsonb("config").notNullable().defaultTo("{}");
    table.boolean("is_active").notNullable().defaultTo(true);

    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());

    table.index(["workspace_id"]);
    table.index(["source_type"]);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("job_source_configs");
}