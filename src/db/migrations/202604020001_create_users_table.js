export async function up(knex) {
  await knex.schema.createTable("leads", (table) => {
    table.string("id").primary();
    table.string("user_id").notNullable().index();
    table.string("user_email").nullable();

    table.string("business_name").notNullable().defaultTo("");
    table.string("contact_name").defaultTo("");
    table.string("mobile").defaultTo("");

    table.string("category").notNullable().defaultTo("Cafe / Restaurant");
    table.string("status").notNullable().defaultTo("New");
    table.string("stage").notNullable().defaultTo("Prospect");
    table.string("follow_up_date").defaultTo("");

    table.text("notes").defaultTo("");
    table.jsonb("notes_history").notNullable().defaultTo("[]");

    table.string("quote_amount").defaultTo("");
    table.string("quote_status").notNullable().defaultTo("Not Sent");

    table.string("linkedin_role").defaultTo("");
    table.string("linkedin_location").defaultTo("");
    table.string("linkedin_keywords").defaultTo("");
    table.string("linkedin_company").defaultTo("");
    table.text("linkedin_profile_url").defaultTo("");
    table.text("linkedin_headline").defaultTo("");

    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("leads");
}