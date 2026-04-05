import "dotenv/config";

const config = {
  client: "pg",
  connection: process.env.DATABASE_URL,
  migrations: {
    directory: "./src/db/migrations",
    tableName: "knex_migrations"
  }
};

export default {
  development: config,
  production: config
};