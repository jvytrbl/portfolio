import "server-only";
import { createHmac } from "node:crypto";
import { and, count, eq, gte } from "drizzle-orm";
import { getDb } from "@/db/client";
import { contactSubmissions } from "@/db/schema";
import { env } from "@/env";
import type { ContactDeps } from "./service";
import type { ContactInput } from "./schema";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const RESEND_URL = "https://api.resend.com/emails";
// Resend's shared sender works without a verified domain; switch to your own
// domain address once it's verified in Resend.
const FROM_ADDRESS = "Portfolio Contact <onboarding@resend.dev>";

export async function verifyTurnstile(token: string, ip: string | null): Promise<boolean> {
  if (!env.TURNSTILE_SECRET_KEY) return false;
  const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET_KEY, response: token });
  if (ip) body.set("remoteip", ip);
  const res = await fetch(TURNSTILE_VERIFY_URL, { method: "POST", body });
  if (!res.ok) return false;
  const data = (await res.json()) as { success?: boolean };
  return data.success === true;
}

/** Keyed hash so raw IPs are never stored and can't be brute-forced back. */
export function hashIp(ip: string | null): string {
  const key = env.TURNSTILE_SECRET_KEY ?? "unconfigured";
  return createHmac("sha256", key)
    .update(ip ?? "unknown")
    .digest("hex");
}

export async function sendNotification(data: ContactInput): Promise<void> {
  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: [env.CONTACT_TO_EMAIL],
      reply_to: data.email,
      subject: `[Portfolio] ${data.subject}`,
      // Plain text only — visitor input is never interpreted as HTML.
      text: `From: ${data.name} <${data.email}>\n\n${data.message}`,
    }),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
}

export function createContactDeps(configured: boolean): ContactDeps {
  return {
    configured,
    now: () => new Date(),
    verifyTurnstile,
    async countSubmissions({ ipHash, since }) {
      const db = getDb();
      if (!db) throw new Error("Database not configured");
      const where = ipHash
        ? and(eq(contactSubmissions.ipHash, ipHash), gte(contactSubmissions.createdAt, since))
        : gte(contactSubmissions.createdAt, since);
      const [row] = await db.select({ value: count() }).from(contactSubmissions).where(where);
      return row?.value ?? 0;
    },
    async saveSubmission({ name, email, subject, message, ipHash }) {
      const db = getDb();
      if (!db) throw new Error("Database not configured");
      await db.insert(contactSubmissions).values({
        senderName: name,
        senderEmail: email,
        subject,
        message,
        ipHash,
      });
    },
    sendNotification,
    log: (message, error) => console.error(message, error),
  };
}
