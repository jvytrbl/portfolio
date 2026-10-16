import { describe, expect, it, vi } from "vitest";
import {
  RATE_LIMIT,
  handleContactSubmission,
  type ContactDeps,
  type ContactRequest,
} from "@/lib/contact/service";

const validFields = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  subject: "Hello there",
  message: "I'd like to talk about a role.",
};

function request(overrides: Partial<ContactRequest> = {}): ContactRequest {
  return {
    fields: { ...validFields },
    honeypot: "",
    turnstileToken: "token",
    ip: "203.0.113.7",
    ipHash: "hash",
    ...overrides,
  };
}

function deps(overrides: Partial<ContactDeps> = {}): ContactDeps {
  return {
    configured: true,
    now: () => new Date("2026-10-16T12:00:00Z"),
    verifyTurnstile: vi.fn(async () => true),
    countSubmissions: vi.fn(async () => 0),
    saveSubmission: vi.fn(async () => {}),
    sendNotification: vi.fn(async () => {}),
    log: vi.fn(),
    ...overrides,
  };
}

describe("handleContactSubmission", () => {
  it("stores and emails a valid submission", async () => {
    const d = deps();
    const result = await handleContactSubmission(request(), d);

    expect(result.status).toBe("success");
    expect(d.saveSubmission).toHaveBeenCalledWith({ ...validFields, ipHash: "hash" });
    expect(d.sendNotification).toHaveBeenCalledWith(validFields);
    expect(d.verifyTurnstile).toHaveBeenCalledWith("token", "203.0.113.7");
  });

  it("treats subject as optional, defaulting it", async () => {
    const d = deps();
    const result = await handleContactSubmission(
      request({ fields: { ...validFields, subject: "  " } }),
      d,
    );
    expect(result.status).toBe("success");
    expect(d.saveSubmission).toHaveBeenCalledWith(
      expect.objectContaining({ subject: "New message from your portfolio" }),
    );
  });

  it("refuses politely when the integrations aren't configured", async () => {
    const d = deps({ configured: false });
    const result = await handleContactSubmission(request(), d);

    expect(result).toMatchObject({ status: "error", values: { name: "Ada Lovelace" } });
    expect(d.saveSubmission).not.toHaveBeenCalled();
  });

  it("silently drops honeypot submissions while reporting success", async () => {
    const d = deps();
    const result = await handleContactSubmission(request({ honeypot: "http://spam" }), d);

    expect(result.status).toBe("success");
    expect(d.verifyTurnstile).not.toHaveBeenCalled();
    expect(d.saveSubmission).not.toHaveBeenCalled();
  });

  it("returns per-field errors and echoes values back", async () => {
    const d = deps();
    const result = await handleContactSubmission(
      request({ fields: { ...validFields, email: "not-an-email", message: "short" } }),
      d,
    );

    expect(result.status).toBe("error");
    if (result.status !== "error") throw new Error();
    expect(result.fieldErrors).toEqual({
      email: "Enter an email address like name@example.com.",
      message: "Message needs at least 10 characters.",
    });
    expect(result.message).toBe("Please fix the 2 highlighted fields.");
    expect(result.values?.email).toBe("not-an-email");
    expect(d.verifyTurnstile).not.toHaveBeenCalled();
  });

  it("rejects when the human check fails or is missing", async () => {
    const failing = deps({ verifyTurnstile: vi.fn(async () => false) });
    expect((await handleContactSubmission(request(), failing)).status).toBe("error");

    const missing = deps();
    expect((await handleContactSubmission(request({ turnstileToken: "" }), missing)).status).toBe(
      "error",
    );
    expect(missing.verifyTurnstile).not.toHaveBeenCalled();
    expect(failing.saveSubmission).not.toHaveBeenCalled();
  });

  it("enforces the per-IP hourly limit", async () => {
    const d = deps({
      countSubmissions: vi.fn(async ({ ipHash }) => (ipHash ? RATE_LIMIT.perIpPerHour : 0)),
    });
    const result = await handleContactSubmission(request(), d);

    expect(result).toMatchObject({
      status: "error",
      message: expect.stringMatching(/try again in an hour/i),
    });
    expect(d.saveSubmission).not.toHaveBeenCalled();
  });

  it("enforces the global daily cap and queries the right windows", async () => {
    const countSubmissions = vi.fn(async ({ ipHash }: { ipHash?: string }) =>
      ipHash ? 0 : RATE_LIMIT.globalPerDay,
    );
    const result = await handleContactSubmission(request(), deps({ countSubmissions }));

    expect(result.status).toBe("error");
    expect(countSubmissions).toHaveBeenCalledWith({
      ipHash: "hash",
      since: new Date("2026-10-16T11:00:00Z"),
    });
    expect(countSubmissions).toHaveBeenCalledWith({ since: new Date("2026-10-15T12:00:00Z") });
  });

  it("reports an error and skips the email when storing fails", async () => {
    const d = deps({ saveSubmission: vi.fn(async () => Promise.reject(new Error("db down"))) });
    const result = await handleContactSubmission(request(), d);

    expect(result.status).toBe("error");
    expect(d.sendNotification).not.toHaveBeenCalled();
    expect(d.log).toHaveBeenCalled();
  });

  it("still succeeds when only the email fails (message is already stored)", async () => {
    const d = deps({ sendNotification: vi.fn(async () => Promise.reject(new Error("resend"))) });
    const result = await handleContactSubmission(request(), d);

    expect(result.status).toBe("success");
    expect(d.saveSubmission).toHaveBeenCalled();
    expect(d.log).toHaveBeenCalledWith("contact: notification email failed", expect.any(Error));
  });
});
