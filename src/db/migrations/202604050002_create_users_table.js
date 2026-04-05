export async function up(knex) {
  await knex.schema.createTable("users", (table) => {
    table.uuid("id").primary();
    table
      .uuid("workspace_id")
      .references("id")
      .inTable("workspaces")
      .onDelete("CASCADE");

    table.string("email").notNullable().unique();
    table.string("password_hash").notNullable();
    table.string("full_name");
    table.string("role").notNullable().defaultTo("member");

    table.timestamps(true, true);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("users");
}