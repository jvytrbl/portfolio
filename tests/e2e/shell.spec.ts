import { expect, test } from "@playwright/test";

test.describe("site shell", () => {
  test("renders landmarks and marks the current section in the nav", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();

    const nav = page.getByRole("navigation", { name: "Primary" });
    await expect(nav.getByRole("link", { name: "About" })).toHaveAttribute("aria-current", "page");
    await expect(nav.getByRole("link", { name: "Work" })).not.toHaveAttribute("aria-current");
  });

  test("mobile menu opens inline and navigates", async ({ browser }) => {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Open menu" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
    const menu = page.getByRole("navigation", { name: "Mobile" });
    await menu.getByRole("link", { name: "Work" }).click();
    await expect(page).toHaveURL(/\/work$/);
    await expect(menu).toBeHidden();
    await page.close();
  });

  test("opens the command menu with the keyboard", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("ControlOrMeta+k");

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await page.keyboard.type("source");
    await expect(dialog.getByRole("option", { name: /view source code/i })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("shows the 404 page", async ({ page }) => {
    const response = await page.goto("/does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: /not found/i })).toBeVisible();
  });
});
