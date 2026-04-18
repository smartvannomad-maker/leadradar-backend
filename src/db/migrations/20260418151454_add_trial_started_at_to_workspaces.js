export async function up(knex) {
  await knex.schema.alterTable("workspaces", (table) => {
    table.timestamp("trial_started_at", { useTz: true }).nullable();
  });
}

export async function down(knex) {
  await knex.schema.alterTable("workspaces", (table) => {
    table.dropColumn("trial_started_at");
  });
}