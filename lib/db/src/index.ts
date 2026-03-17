// @ts-nocheck
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { createClient } from "@supabase/supabase-js";
import * as schema from "./schema";

const { Pool } = pg;

// Supabase client (used when DATABASE_URL not available)
const fallbackUrl = "https://lopqvaepgpzemswxiqzr.supabase.co";
const fallbackKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxvcHF2YWVwZ3B6ZW1zd3hpcXpyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzUzNzQ1NiwiZXhwIjoyMDg5MTEzNDU2fQ.kwEeEVnaJFUmiGZpqjLddZLE6TOnlNwd_RPBhQ2md_Y";

const supabaseUrl = process.env.SUPABASE_URL || fallbackUrl;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || fallbackKey;

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// Drizzle client (used when DATABASE_URL is available)
let _db: ReturnType<typeof drizzle> | null = null;
let _pool: pg.Pool | null = null;

if (process.env.DATABASE_URL) {
  _pool = new Pool({ connectionString: process.env.DATABASE_URL });
  _db = drizzle(_pool, { schema });
}

export const pool = _pool;
export const db = _db as ReturnType<typeof drizzle<typeof schema>>;

export * from "./schema";
