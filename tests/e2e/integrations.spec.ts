import { expect, test } from "@playwright/test";

// CI runs the app against a real Postgres (E2E_EXPECT_DB=1); locally there may
// be no database, so DB-dependent assertions adapt.
const expectDb = process.env.E2E_EXPECT_DB === "1";

test.describe("contact form", () => {
  test("renders accessible fields and a safe unconfigured state", async ({ page }) => {
    await page.goto("/#contact");
    const form = page.locator("#contact form");

    for (const label of [
      "Name (required)",
      "Email (required)",
      "Subject (optional)",
      "Message (required)",
    ]) {
      await expect(form.getByLabel(label)).toBeVisible();
    }
    // The honeypot must stay out of the accessibility tree.
    await expect(form.getByRole("textbox", { name: "Website" })).toHaveCount(0);

    // Without Resend/Turnstile keys the form explains itself and can't submit,
    // but the button stays focusable so keyboard users learn why.
    const submit = form.getByRole("button", { name: "Send message" });
    await expect(submit).toHaveAttribute("aria-disabled", "true");
    await expect(submit).toHaveAccessibleDescription(/being set up/);
    await submit.focus();
    await expect(submit).toBeFocused();
    // Pressing Enter on the focused button must not submit anything.
    await page.keyboard.press("Enter");
    await expect(form.getByRole("alert")).toHaveCount(0);
    await expect(page.getByText("Message sent")).toHaveCount(0);
  });
});

test.describe("health & views API", () => {
  test("health endpoint reports database status", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.ok()).toBe(true);
    expect((await res.json()).db).toBe(expectDb ? "up" : "not-configured");
  });

  test("rejects view counts for unknown projects", async ({ request }) => {
    const res = await request.post("/api/views/not-a-project");
    expect(res.status()).toBe(404);
  });

  test("view API reflects database availability", async ({ request }) => {
    const res = await request.get("/api/views/unified-defect-ticketing");
    if (expectDb) {
      expect(res.ok()).toBe(true);
      expect(typeof (await res.json()).views).toBe("number");
    } else {
      expect(res.status()).toBe(503);
    }
  });

  test("case study reserves the counter slot but hides low counts", async ({ page }) => {
    // Fresh test databases sit far below the public threshold of 50 views.
    await page.goto("/projects/unified-defect-ticketing");
    await page.waitForLoadState("networkidle");
    const slot = page.getByTestId("view-counter");
    await expect(slot).toBeAttached();
    await expect(slot).toBeHidden();
  });
});

test.describe("github section", () => {
  test("renders live stats or a graceful fallback", async ({ page }) => {
    await page.goto("/#github");
    const section = page.locator("section#github");
    await expect(section.getByRole("heading", { name: "Open source activity" })).toBeVisible();
    await expect(
      section.getByText(/Public repos|stats are temporarily unavailable/).first(),
    ).toBeVisible();
  });
});
