"use server";

import { headers } from "next/headers";
import { isContactConfigured } from "@/env";
import { createContactDeps, hashIp } from "@/lib/contact/integrations";
import { HONEYPOT_FIELD, TURNSTILE_FIELD, type ContactState } from "@/lib/contact/schema";
import { handleContactSubmission } from "@/lib/contact/service";

function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    null;

  return handleContactSubmission(
    {
      fields: {
        name: field(formData, "name"),
        email: field(formData, "email"),
        subject: field(formData, "subject"),
        message: field(formData, "message"),
      },
      honeypot: field(formData, HONEYPOT_FIELD),
      turnstileToken: field(formData, TURNSTILE_FIELD),
      ip,
      ipHash: hashIp(ip),
    },
    createContactDeps(isContactConfigured()),
  );
}
