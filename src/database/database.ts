import { Pool } from "pg";
import config from "../config/config";

export const pool = new Pool({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: config.dbPass,
  database: config.dbName,
});
