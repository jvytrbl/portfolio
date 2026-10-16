import { expect, test } from "@playwright/test";

// CI runs the app against a real Postgres (E2E_EXPECT_DB=1); locally there may
// be no database, so DB-dependent assertions adapt.
const expectDb = process.env.E2E_EXPECT_DB === "1";

test.describe("contact form", () => {
  test("renders accessible fields and a safe unconfigured state", async ({ page }) => {
    await page.goto("/#contact");
    const form = page.locator("#contact form");

    for (const label of ["name", "email", "subject", "message"]) {
      await expect(form.getByLabel(label, { exact: true })).toBeVisible();
    }
    // The honeypot must stay out of the accessibility tree.
    await expect(form.getByRole("textbox", { name: "Website" })).toHaveCount(0);

    // Without Resend/Turnstile keys the form explains itself and can't submit.
    await expect(form.getByText("the form is being set up")).toBeVisible();
    await expect(form.getByRole("button", { name: "Send message" })).toBeDisabled();
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

  test("case study shows a view count only when the database is available", async ({ page }) => {
    await page.goto("/projects/unified-defect-ticketing");
    const counter = page.getByText(/^\d[\d,]* views?$/);
    if (expectDb) {
      await expect(counter).toBeVisible();
    } else {
      await page.waitForLoadState("networkidle");
      await expect(counter).toHaveCount(0);
    }
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
