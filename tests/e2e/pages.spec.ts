import { expect, test } from "@playwright/test";

test.describe("home", () => {
  test("opens on the project carousel and the name", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Muhammad Hakimi");
    const carousel = page.getByRole("region", { name: "Selected projects" });
    await expect(carousel.getByRole("link")).toHaveCount(3);
    await expect(page.getByRole("region", { name: "Before and after" })).toBeAttached();

    await carousel.getByRole("link").first().click();
    await expect(page).toHaveURL(/\/work\/unified-defect-ticketing$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Unified Defect Ticketing System",
    );
  });

  test("shows selected work with a link to the archive", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Selected Work" })).toBeVisible();
    await page.getByRole("link", { name: "All work" }).click();
    await expect(page).toHaveURL(/\/work$/);
  });
});

test.describe("navigation", () => {
  test("moves between the sections as separate pages", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });

    await nav.getByRole("link", { name: "Work" }).click();
    await expect(page).toHaveURL(/\/work$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Selected Work");

    await nav.getByRole("link", { name: "About" }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.getByRole("heading", { name: "Career" })).toBeVisible();

    await nav.getByRole("link", { name: "Contact" }).click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Say Hello");
  });

  test("redirects the old /projects URLs", async ({ page }) => {
    await page.goto("/projects");
    await expect(page).toHaveURL(/\/work$/);
    await page.goto("/projects/unified-defect-ticketing");
    await expect(page).toHaveURL(/\/work\/unified-defect-ticketing$/);
  });

  test("never scrolls sideways on a small phone", async ({ browser }) => {
    const page = await browser.newPage({ viewport: { width: 360, height: 780 } });
    for (const path of ["/", "/work", "/work/unified-defect-ticketing", "/about", "/contact"]) {
      await page.goto(path);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${path} overflows by ${overflow}px`).toBeLessThanOrEqual(0);
    }
    await page.close();
  });
});

test.describe("work", () => {
  test("archive lists every project with the cover story first", async ({ page }) => {
    await page.goto("/work");
    const cards = page.getByRole("main").getByRole("article");
    await expect(cards).toHaveCount(3);
    await expect(cards.first()).toContainText("Unified Defect Ticketing System");
  });

  test("internal project is shown as type, not screenshots", async ({ page }) => {
    await page.goto("/work/unified-defect-ticketing");
    await expect(page).toHaveTitle(/Unified Defect Ticketing System/);
    await expect(page.getByText("Internal system · shown as type, not screenshots")).toBeVisible();
    await expect(page.getByRole("region", { name: "Key numbers" })).toContainText("90,000+");
    await expect(page.getByRole("region", { name: "Screens" })).toHaveCount(0);

    const log = page.locator("figure", { hasText: "impact.log" });
    await log.scrollIntoViewIfNeeded();
    const skip = log.getByRole("button", { name: "skip" });
    if (await skip.isVisible()) await skip.click();
    await expect(log.getByText("4 departments", { exact: true }).last()).toBeVisible();
  });

  test("project with screenshots renders its cover and gallery", async ({ page }) => {
    await page.goto("/work/engineering-portfolio");
    await expect(page.getByRole("img", { name: "Engineering Portfolio screenshot" })).toBeVisible();
    const screens = page.getByRole("region", { name: "Screens" });
    await expect(screens.getByRole("img")).toHaveCount(2);
    await expect(screens.getByText("Home on mobile")).toBeVisible();
  });

  test("project without screenshots shows placeholders", async ({ page }) => {
    await page.goto("/work/vendor-performance-intelligence-platform");
    await expect(page.getByRole("region", { name: "Screens" })).toContainText(
      "Screenshot coming soon",
    );
  });

  test("shows the not-found page (noindex) for an unknown project", async ({ page }) => {
    // Unknown slugs render after the static shell starts streaming, so Next.js
    // serves the 404 UI with a noindex tag (soft 404).
    await page.goto("/work/does-not-exist");
    await expect(page.getByRole("heading", { name: /not found/i })).toBeVisible();
    await expect(page.locator('meta[name="robots"][content*="noindex"]')).toBeAttached();
  });

  test("projects are searchable from the command menu", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("ControlOrMeta+k");
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.type("vendor");
    await expect(
      page.getByRole("option", { name: "Vendor Performance Intelligence Platform" }),
    ).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/work\/vendor-performance-intelligence-platform$/);
  });
});

test.describe("about", () => {
  test("tells the career, credentials and toolkit chapters", async ({ page }) => {
    await page.goto("/about");
    for (const chapter of ["Career", "Credentials", "Toolkit"]) {
      await expect(page.getByRole("heading", { level: 2, name: chapter })).toBeVisible();
    }
    await expect(page.getByText("Jotex Sdn Bhd, Seremban")).toBeVisible();
    await expect(page.getByText("Top 50 Semi-Finalist")).toBeVisible();
  });
});
