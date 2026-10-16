import { createEnv } from "@t3-oss/env-nextjs";
import * as z from "zod";

// Validated at build time (imported by next.config.ts). Integration secrets
// are optional so the site builds before accounts exist; features that need
// them report "not configured" instead of failing.
export const env = createEnv({
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    // Supabase → Connect → Transaction pooler (port 6543)
    DATABASE_URL: z.url().optional(),
    RESEND_API_KEY: z.string().startsWith("re_").optional(),
    CONTACT_TO_EMAIL: z.email().default("hakimiazizi060@gmail.com"),
    TURNSTILE_SECRET_KEY: z.string().min(1).optional(),
    // Optional: raises the GitHub API limit and enables pinned repos + contributions.
    GITHUB_TOKEN: z.string().min(1).optional(),
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1).optional(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CONTACT_TO_EMAIL: process.env.CONTACT_TO_EMAIL,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  },
  emptyStringAsUndefined: true,
});

/** True when every service the contact form depends on is configured. */
export function isContactConfigured(): boolean {
  return Boolean(
    env.DATABASE_URL &&
    env.RESEND_API_KEY &&
    env.TURNSTILE_SECRET_KEY &&
    env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  );
}
