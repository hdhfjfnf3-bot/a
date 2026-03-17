import app from "./app";
import { pool, supabase } from "@workspace/db";

const rawPort = process.env["PORT"] || "3000";

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// ─── Initialize DB Tables ───
async function setupDb() {
  if (pool) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS messages (
          id SERIAL PRIMARY KEY,
          user_phone TEXT NOT NULL,
          product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
          sender TEXT NOT NULL DEFAULT 'user',
          content TEXT NOT NULL,
          created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL
        )
      `);
      console.log("Database tables verified/created successfully.");
    } catch (e) {
      console.error("Failed to setup db tables via pool:", e);
    }
  } else if (supabase) {
    // Note: Supabase structure creation typically via migrations or migrations dashboard
    console.log("Using Supabase. Ensure 'messages' table exists in the remote schema.");
  }
}

setupDb().then(() => {
  // Only listen if not running in Vercel
  if (process.env.NODE_ENV !== "production" && process.env.VERCEL !== "1") {
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  }
}).catch(console.error);

export default app;
// @ts-ignore
module.exports = app;
