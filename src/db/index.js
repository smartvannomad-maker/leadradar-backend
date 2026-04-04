import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err) => {
  console.error("Unexpected Postgres error:", err);
});

export default {
  query(text, params) {
    return pool.query(text, params);
  },
};