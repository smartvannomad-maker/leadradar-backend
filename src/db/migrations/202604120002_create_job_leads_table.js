export async function up(knex) {
  await knex.schema.createTable("job_leads", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("workspace_id")
      .notNullable()
      .references("id")
      .inTable("workspaces")
      .onDelete("CASCADE");

    table
      .uuid("job_post_id")
      .nullable()
      .references("id")
      .inTable("job_posts")
      .onDelete("SET NULL");

    table.string("company_name", 255).notNullable();
    table.string("company_domain", 255).nullable();
    table.string("website", 2048).nullable();

    table.string("decision_maker_name", 255).nullable();
    table.string("decision_maker_title", 255).nullable();
    table.string("decision_maker_linkedin", 2048).nullable();
    table.string("decision_maker_email", 255).nullable();

    table.integer("company_size").nullable();
    table.string("industry", 255).nullable();
    table.string("location", 255).nullable();

    table.jsonb("hiring_signals").defaultTo("{}");
    table.jsonb("tech_stack").defaultTo("[]");
    table.integer("lead_score").notNullable().defaultTo(0);

    table.text("pain_point").nullable();
    table.text("pitch_angle").nullable();
    table.text("ai_summary").nullable();
    table.text("outreach_message").nullable();

    table.string("status", 50).notNullable().defaultTo("new");
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());

    table.index(["workspace_id"]);
    table.index(["company_name"]);
    table.index(["status"]);
    table.index(["lead_score"]);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("job_leads");
}