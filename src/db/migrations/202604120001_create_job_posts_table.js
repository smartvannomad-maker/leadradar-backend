export async function up(knex) {
  await knex.schema.createTable("job_posts", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("workspace_id")
      .notNullable()
      .references("id")
      .inTable("workspaces")
      .onDelete("CASCADE");

    table.string("source", 50).notNullable();
    table.string("external_id", 255).nullable();
    table.string("url", 2048).nullable();

    table.string("title", 255).notNullable();
    table.string("company_name", 255).notNullable();
    table.string("location", 255).nullable();
    table.string("employment_type", 100).nullable();
    table.string("work_model", 100).nullable();

    table.text("description").nullable();
    table.jsonb("tech_stack").defaultTo("[]");
    table.jsonb("signals").defaultTo("{}");

    table.string("contact_name", 255).nullable();
    table.string("contact_email", 255).nullable();
    table.string("company_website", 255).nullable();

    table.timestamp("posted_at").nullable();
    table.timestamp("discovered_at").notNullable().defaultTo(knex.fn.now());

    table.index(["workspace_id"]);
    table.index(["company_name"]);
    table.index(["source"]);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("job_posts");
}