import client from "./config/supabaseClient.config.js";

const initDb = async () => {
  try {
    await client.connect();
    await client.query("SELECT 1"); // test query
    console.log("✅ Connected to supaBase DB");
  } catch (error) {
    console.error("❌ Failed to connect to supaBase DB:", error);
    // process.exit(1); // Exit if DB connection fails
  }
};

export default initDb;
