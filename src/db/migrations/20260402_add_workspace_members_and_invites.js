export async function up(knex) {
  await knex.schema.alterTable("users", (table) => {
    table.string("workspace_role").notNullable().defaultTo("member");
  });

  await knex("users").update({
    workspace_role: "owner",
  });

  await knex.schema.createTable("workspace_invites", (table) => {
    table.uuid("id").primary();
    table.uuid("workspace_id").notNullable();
    table.string("email").notNullable();
    table.string("role").notNullable().defaultTo("member");
    table.string("status").notNullable().defaultTo("pending");

    // IMPORTANT: match existing users.id type
    table.string("invited_by").notNullable();

    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("accepted_at").nullable();

    table
      .foreign("workspace_id")
      .references("id")
      .inTable("workspaces")
      .onDelete("CASCADE");

    table
      .foreign("invited_by")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.index(["workspace_id"]);
    table.index(["email"]);
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists("workspace_invites");

  await knex.schema.alterTable("users", (table) => {
    table.dropColumn("workspace_role");
  });
}