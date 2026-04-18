export async function up(knex) {
  await knex.schema.alterTable("workspaces", (table) => {
    table.string("billing_provider").nullable();
    table.string("provider_customer_id").nullable();
    table.string("provider_subscription_id").nullable();
  });
}

export async function down(knex) {
  await knex.schema.alterTable("workspaces", (table) => {
    table.dropColumn("provider_subscription_id");
    table.dropColumn("provider_customer_id");
    table.dropColumn("billing_provider");
  });
}