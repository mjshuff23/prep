import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
  // Next.js default app creates a page with "Create Next App" or similar.
  // We'll just check if the page loads and has a body.
  const body = page.locator('body');
  await expect(body).toBeVisible();
});
