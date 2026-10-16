import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/env";
import * as schema from "./schema";

type Database = ReturnType<typeof drizzle<typeof schema>>;

// One connection per serverless instance. `prepare: false` is required by
// Supabase's transaction pooler.
const globalForDb = globalThis as unknown as { db?: Database };

export function getDb(): Database | null {
  if (!env.DATABASE_URL) return null;
  globalForDb.db ??= drizzle(postgres(env.DATABASE_URL, { prepare: false, max: 1 }), { schema });
  return globalForDb.db;
}
