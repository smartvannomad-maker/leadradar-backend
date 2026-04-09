export async function up(knex) {
  await knex.schema.alterTable("leads", (table) => {
    table.integer("ai_score").defaultTo(0);
    table.string("ai_priority").defaultTo("cold");
    table.jsonb("ai_reasons").defaultTo("[]");
  });
}

export async function down(knex) {
  await knex.schema.alterTable("leads", (table) => {
    table.dropColumn("ai_score");
    table.dropColumn("ai_priority");
    table.dropColumn("ai_reasons");
  });
}