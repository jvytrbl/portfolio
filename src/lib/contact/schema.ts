import * as z from "zod";

export const MESSAGE_MIN = 10;
export const MESSAGE_MAX = 5000;
export const DEFAULT_SUBJECT = "New message from your portfolio";

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your name (at least 2 characters).")
    .max(80, "Name is too long (80 characters max)."),
  email: z.email("Enter an email address like name@example.com.").max(254),
  // Optional: a quick hello shouldn't need a subject line.
  subject: z
    .string()
    .trim()
    .max(120, "Subject is too long (120 characters max).")
    .transform((v) => v || DEFAULT_SUBJECT),
  message: z
    .string()
    .trim()
    .min(MESSAGE_MIN, `Message needs at least ${MESSAGE_MIN} characters.`)
    .max(
      MESSAGE_MAX,
      `Message is too long (${MESSAGE_MAX.toLocaleString("en-US")} characters max).`,
    ),
});

export type ContactInput = z.output<typeof contactSchema>;
export type ContactField = keyof ContactInput;

export type ContactState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<ContactField, string>>;
      /** Echoed back so the form keeps what the visitor typed. */
      values?: Partial<Record<ContactField, string>>;
    };

export const initialContactState: ContactState = { status: "idle" };

/** Hidden field real visitors never fill in; bots usually do. */
export const HONEYPOT_FIELD = "website";
/** Field name the Turnstile widget writes its token to. */
export const TURNSTILE_FIELD = "cf-turnstile-response";
