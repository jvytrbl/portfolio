import { expect, test } from "@playwright/test";

test.describe("home page", () => {
  test("renders every section with working anchors", async ({ page }) => {
    await page.goto("/");
    for (const id of ["projects", "experience", "credentials", "skills", "contact"]) {
      await expect(page.locator(`section#${id}`)).toBeAttached();
    }
    await page
      .getByRole("navigation", { name: "Primary" })
      .getByRole("link", { name: "Skills" })
      .click();
    await expect(page).toHaveURL(/#skills$/);
    await expect(page.getByRole("heading", { name: "Technical skills" })).toBeInViewport();
  });

  test("links featured projects to their case studies", async ({ page }) => {
    await page.goto("/");
    const card = page.locator("#projects").getByRole("link").first();
    const title = await card.textContent();
    await card.click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title!);
  });
});

test.describe("projects", () => {
  test("filters the project list by category", async ({ page }) => {
    await page.goto("/projects");
    const cards = page.getByRole("main").getByRole("article");
    const total = await cards.count();
    expect(total).toBeGreaterThan(1);

    await page.getByRole("button", { name: /^AI\/ML/ }).click();
    await expect(cards).not.toHaveCount(total);
    await expect(cards.first()).toContainText("AI/ML");
  });

  test("renders a case study with table of contents and highlighted code", async ({ page }) => {
    await page.goto("/projects/vendor-performance-intelligence-platform");
    await expect(page).toHaveTitle(/Vendor Performance Intelligence Platform/);
    await expect(page.locator("pre.shiki").first()).toBeVisible();

    await page
      .getByRole("navigation", { name: "On this page" })
      .getByRole("link", { name: "Testing strategy" })
      .click();
    await expect(page).toHaveURL(/#testing-strategy$/);
  });

  test("shows the not-found page (noindex) for an unknown project", async ({ page }) => {
    // Unknown slugs render at request time after the static shell starts
    // streaming, so Next.js serves the 404 UI with a noindex tag (soft 404).
    await page.goto("/projects/does-not-exist");
    await expect(page.getByText("cd: no such file or directory")).toBeVisible();
    await expect(page.locator('meta[name="robots"][content*="noindex"]')).toBeAttached();
  });

  test("lists projects in the command menu", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("ControlOrMeta+k");
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.type("vendor");
    await expect(
      page.getByRole("option", { name: "Vendor Performance Intelligence Platform" }),
    ).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/projects\/vendor-performance-intelligence-platform$/);
  });
});
