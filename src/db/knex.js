import knex from "knex";
import configFile from "../../knexfile.js";

const environment = process.env.NODE_ENV || "development";
const config = configFile[environment];

const db = knex(config);

export default db;