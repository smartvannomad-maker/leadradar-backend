export async function up(knex) {
  const hasUsers = await knex.schema.hasTable("users");

  if (!hasUsers) {
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

  const hasWorkspaceMembers = await knex.schema.hasTable("workspace_members");

  if (!hasWorkspaceMembers) {
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
    });
  }
}

export async function down(knex) {
  const hasWorkspaceMembers = await knex.schema.hasTable("workspace_members");
  if (hasWorkspaceMembers) {
    await knex.schema.dropTable("workspace_members");
  }

  const hasUsers = await knex.schema.hasTable("users");
  if (hasUsers) {
    await knex.schema.dropTable("users");
  }
}