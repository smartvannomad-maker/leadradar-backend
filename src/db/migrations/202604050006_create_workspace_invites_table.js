export async function up(knex) {
  await knex.schema.createTable("workspace_invites", (table) => {
    table.uuid("id").primary();

    table
      .uuid("workspace_id")
      .notNullable()
      .references("id")
      .inTable("workspaces")
      .onDelete("CASCADE");

    table.string("email").notNullable();
    table.string("role").notNullable().defaultTo("member");
    table.string("status").notNullable().defaultTo("pending");

    table
      .uuid("invited_by")
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");

    table.timestamp("accepted_at").nullable();

    table.timestamps(true, true);

    table.index(["workspace_id", "email"]);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("workspace_invites");
}