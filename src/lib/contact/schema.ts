import * as z from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80, "Name is too long"),
  email: z.email("Please enter a valid email").max(254),
  subject: z.string().trim().min(3, "Subject is too short").max(120, "Subject is too long"),
  message: z
    .string()
    .trim()
    .min(10, "Message should be at least 10 characters")
    .max(5000, "Message is too long (5,000 characters max)"),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ContactField = keyof ContactInput;

export type ContactState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<ContactField, string>>;
      /** Echoed back so the form keeps what the visitor typed. */
      values?: Partial<ContactInput>;
    };

export const initialContactState: ContactState = { status: "idle" };

/** Hidden field real visitors never fill in; bots usually do. */
export const HONEYPOT_FIELD = "website";
/** Field name the Turnstile widget writes its token to. */
export const TURNSTILE_FIELD = "cf-turnstile-response";
