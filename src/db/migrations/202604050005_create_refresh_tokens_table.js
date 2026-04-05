export async function up(knex) {
  await knex.schema.createTable("refresh_tokens", (table) => {
    table.uuid("id").primary();

    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.text("token").notNullable();
    table.timestamp("expires_at");
    table.boolean("revoked").notNullable().defaultTo(false);

    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("refresh_tokens");
}