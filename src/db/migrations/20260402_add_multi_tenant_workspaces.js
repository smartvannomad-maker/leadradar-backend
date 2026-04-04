import { v4 as uuidv4 } from "uuid";

export async function up(knex) {
  await knex.schema.createTable("workspaces", (table) => {
    table.uuid("id").primary();
    table.string("name").notNullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.alterTable("users", (table) => {
    table.uuid("workspace_id").nullable();
  });

  await knex.schema.alterTable("leads", (table) => {
    table.uuid("workspace_id").nullable();
  });

  await knex.schema.alterTable("users", (table) => {
    table
      .foreign("workspace_id")
      .references("id")
      .inTable("workspaces")
      .onDelete("CASCADE");
  });

  await knex.schema.alterTable("leads", (table) => {
    table
      .foreign("workspace_id")
      .references("id")
      .inTable("workspaces")
      .onDelete("CASCADE");
  });

  // Backfill existing users with their own workspace
  const existingUsers = await knex("users").select("id", "email", "workspace_id");

  for (const user of existingUsers) {
    if (!user.workspace_id) {
      const workspaceId = uuidv4();
      const workspaceName =
        (user.email && user.email.split("@")[0]) || "My Workspace";

      await knex("workspaces").insert({
        id: workspaceId,
        name: workspaceName,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await knex("users")
        .where({ id: user.id })
        .update({ workspace_id: workspaceId });

      // Assign this user's existing leads to that workspace
      await knex("leads")
        .where({ user_id: user.id })
        .update({ workspace_id: workspaceId });
    }
  }

  // Safety backfill for any leads still missing workspace_id
  const leadsMissingWorkspace = await knex("leads")
    .whereNull("workspace_id")
    .select("id", "user_id");

  for (const lead of leadsMissingWorkspace) {
    const owner = await knex("users")
      .select("workspace_id")
      .where({ id: lead.user_id })
      .first();

    if (owner?.workspace_id) {
      await knex("leads")
        .where({ id: lead.id })
        .update({ workspace_id: owner.workspace_id });
    }
  }

  await knex.schema.alterTable("users", (table) => {
    table.uuid("workspace_id").notNullable().alter();
  });

  await knex.schema.alterTable("leads", (table) => {
    table.uuid("workspace_id").notNullable().alter();
  });

  await knex.schema.alterTable("users", (table) => {
    table.index(["workspace_id"]);
  });

  await knex.schema.alterTable("leads", (table) => {
    table.index(["workspace_id"]);
  });
}

export async function down(knex) {
  await knex.schema.alterTable("leads", (table) => {
    table.dropIndex(["workspace_id"]);
    table.dropForeign(["workspace_id"]);
    table.dropColumn("workspace_id");
  });

  await knex.schema.alterTable("users", (table) => {
    table.dropIndex(["workspace_id"]);
    table.dropForeign(["workspace_id"]);
    table.dropColumn("workspace_id");
  });

  await knex.schema.dropTableIfExists("workspaces");
}