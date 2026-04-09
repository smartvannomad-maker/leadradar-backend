export async function up(knex) {
  await knex.schema.alterTable("workspaces", (table) => {
    table.string("plan").notNullable().defaultTo("starter");
    table
      .string("subscription_status")
      .notNullable()
      .defaultTo("trialing");
    table.timestamp("trial_ends_at", { useTz: true }).nullable();
  });
}

export async function down(knex) {
  await knex.schema.alterTable("workspaces", (table) => {
    table.dropColumn("trial_ends_at");
    table.dropColumn("subscription_status");
    table.dropColumn("plan");
  });
}