
export async function up(knex) {
  await knex.schema.createTable("workspace_members", (table) => {
    table.uuid("id").primary();

    table
      .uuid("workspace_id")
      .notNullable()
      .references("id")
      .inTable("workspaces")
      .onDelete("CASCADE");

    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.string("role").notNullable().defaultTo("member");

    table.timestamps(true, true);

    table.unique(["workspace_id", "user_id"]);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("workspace_members");
}