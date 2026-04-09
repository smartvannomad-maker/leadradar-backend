export async function up(knex) {
  await knex.schema.alterTable("leads", (table) => {
    table.integer("deal_probability").defaultTo(0);
    table.integer("estimated_value").defaultTo(0);
    table.text("next_best_action").defaultTo("");
    table.string("follow_up_urgency").defaultTo("low");
  });
}

export async function down(knex) {
  await knex.schema.alterTable("leads", (table) => {
    table.dropColumn("deal_probability");
    table.dropColumn("estimated_value");
    table.dropColumn("next_best_action");
    table.dropColumn("follow_up_urgency");
  });
}