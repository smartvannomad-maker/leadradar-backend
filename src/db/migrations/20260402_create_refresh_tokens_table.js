export async function up(knex) {
  await knex.schema.createTable("refresh_tokens", (table) => {
    table.string("id").primary();
    table.string("user_id").notNullable().index();
    table.text("token").notNullable();
    table.timestamp("expires_at").notNullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("refresh_tokens");
}