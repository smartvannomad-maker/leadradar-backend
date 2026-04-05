export async function up(knex) {
  await knex.schema.createTable("workspaces", (table) => {
    table.uuid("id").primary();
    table.string("name").notNullable();
    table.string("slug").unique();
    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("workspaces");
}