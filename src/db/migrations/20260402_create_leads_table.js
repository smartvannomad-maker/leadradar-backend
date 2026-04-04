export async function up(knex) {
  await knex.schema.createTable("users", (table) => {
    table.string("id").primary();
    table.string("email").notNullable().unique();
    table.string("password_hash").notNullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("users");
}