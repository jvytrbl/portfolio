import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

// Validated at build time (imported by next.config.ts). Server secrets for
// later phases (Supabase, Resend, Turnstile, GitHub) are added here as they land.
export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  emptyStringAsUndefined: true,
});
