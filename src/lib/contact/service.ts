import { contactSchema, type ContactField, type ContactInput, type ContactState } from "./schema";

export const RATE_LIMIT = {
  perIpPerHour: 3,
  // Stays well under Resend's free tier (100 emails/day).
  globalPerDay: 50,
} as const;

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export type ContactDeps = {
  configured: boolean;
  now: () => Date;
  verifyTurnstile: (token: string, ip: string | null) => Promise<boolean>;
  countSubmissions: (filter: { ipHash?: string; since: Date }) => Promise<number>;
  saveSubmission: (data: ContactInput & { ipHash: string }) => Promise<void>;
  sendNotification: (data: ContactInput) => Promise<void>;
  log: (message: string, error?: unknown) => void;
};

export type ContactRequest = {
  fields: Record<string, string>;
  honeypot: string;
  turnstileToken: string;
  ip: string | null;
  ipHash: string;
};

const SUCCESS: ContactState = {
  status: "success",
  message: "Thanks, your message is on its way. I aim to reply within two working days.",
};

// Pipeline: configured → honeypot → validate → human check → rate limit →
// persist → notify. Persisting before emailing means a failed email never
// loses a message.
export async function handleContactSubmission(
  req: ContactRequest,
  deps: ContactDeps,
): Promise<ContactState> {
  const values: Partial<Record<keyof ContactInput, string>> = {
    name: req.fields.name,
    email: req.fields.email,
    subject: req.fields.subject,
    message: req.fields.message,
  };

  if (!deps.configured) {
    return {
      status: "error",
      message: "The contact form isn't switched on yet. Please use the email address on the right.",
      values,
    };
  }

  // Pretend success so bots get no signal to adapt to.
  if (req.honeypot.trim() !== "") return SUCCESS;

  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors: Partial<Record<ContactField, string>> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as ContactField;
      fieldErrors[field] ??= issue.message;
    }
    const count = Object.keys(fieldErrors).length;
    return {
      status: "error",
      message: `Please fix ${count === 1 ? "the highlighted field" : `the ${count} highlighted fields`}.`,
      fieldErrors,
      values,
    };
  }

  if (!req.turnstileToken || !(await deps.verifyTurnstile(req.turnstileToken, req.ip))) {
    return {
      status: "error",
      message:
        "The human check didn't complete. Wait for the checkbox to turn green, then send again.",
      values,
    };
  }

  try {
    const now = deps.now().getTime();
    const [fromIp, total] = await Promise.all([
      deps.countSubmissions({ ipHash: req.ipHash, since: new Date(now - HOUR) }),
      deps.countSubmissions({ since: new Date(now - DAY) }),
    ]);
    if (fromIp >= RATE_LIMIT.perIpPerHour || total >= RATE_LIMIT.globalPerDay) {
      return {
        status: "error",
        message:
          "You've sent several messages recently. Please try again in an hour, or email me directly.",
        values,
      };
    }

    await deps.saveSubmission({ ...parsed.data, ipHash: req.ipHash });
  } catch (error) {
    deps.log("contact: failed to store submission", error);
    return {
      status: "error",
      message:
        "Something went wrong on my side and the message wasn't sent. Please email me directly.",
      values,
    };
  }

  try {
    await deps.sendNotification(parsed.data);
  } catch (error) {
    // Already stored, so the message is safe even if the email fails.
    deps.log("contact: notification email failed", error);
  }

  return SUCCESS;
}
