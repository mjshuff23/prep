import { test, expect } from "@playwright/test";

test.describe("Authentication Flows", () => {
  test("guest can access playground", async ({ page }) => {
    await page.goto("/playground");
    // Should stay on playground, not redirect to sign in
    await expect(page).toHaveURL(/.*\/playground/);
    await expect(page.getByRole("link", { name: /sign in/i })).toBeVisible();
  });

  test("guest is redirected to sign-in from protected routes", async ({ page }) => {
    await page.goto("/dashboard");
    // Should be redirected to sign-in
    await expect(page).toHaveURL(/.*\/sign-in/);
  });

  test("guest is redirected to sign-in from settings", async ({ page }) => {
    await page.goto("/settings");
    await expect(page).toHaveURL(/.*\/sign-in/);
  });
});
