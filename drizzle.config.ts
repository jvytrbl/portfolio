import { defineConfig } from "drizzle-kit";

// drizzle-kit doesn't read .env.local on its own.
try {
  process.loadEnvFile(".env.local");
} catch {
  // No local env file — rely on the shell environment.
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL ?? "" },
});
