export async function up(knex) {
  const hasTable = await knex.schema.hasTable("job_posts");
  if (!hasTable) return;

  const hasColumn = await knex.schema.hasColumn("job_posts", "workspace_id");

  if (!hasColumn) {
    await knex.schema.alterTable("job_posts", (table) => {
      table.uuid("workspace_id").nullable();
    });
  }

  await knex.raw(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'job_posts_workspace_id_foreign'
          AND table_name = 'job_posts'
      ) THEN
        ALTER TABLE "job_posts"
        ADD CONSTRAINT "job_posts_workspace_id_foreign"
        FOREIGN KEY ("workspace_id")
        REFERENCES "workspaces"("id")
        ON DELETE CASCADE;
      END IF;
    END
    $$;
  `);
}

export async function down(knex) {
  const hasTable = await knex.schema.hasTable("job_posts");
  if (!hasTable) return;

  await knex.raw(`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'job_posts_workspace_id_foreign'
          AND table_name = 'job_posts'
      ) THEN
        ALTER TABLE "job_posts"
        DROP CONSTRAINT "job_posts_workspace_id_foreign";
      END IF;
    END
    $$;
  `);

  // Leave the column in place to avoid damaging existing data/schema.
}