import { Client } from "pg";
import { databaseUrl } from "../config/env.config.js";

// Supabase database
const client = new Client({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10, 
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000, 
});

// local database
// const client = new Client({
//   user: "postgres",
//   host: "localhost",
//   database: "pos_project",
//   password: "1234",
//   port: 5432,
// });

export default client;