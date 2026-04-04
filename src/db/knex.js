import knex from "knex";
import configFile from "../../knexfile.js";

const environment = "development";
const config = configFile[environment];

const db = knex(config);

export default db;