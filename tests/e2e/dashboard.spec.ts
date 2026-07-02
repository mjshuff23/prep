import { test, expect } from '@playwright/test';

test.describe('Dashboard routing', () => {
  test('unauthenticated user is redirected from dashboard to sign-in', async ({ page }) => {
    // Attempt to access protected dashboard routes
    await page.goto('/dashboard');
    
    // Should redirect to sign-in page
    await expect(page).toHaveURL(/.*\/sign-in.*/);
    
    // The sign-in page should display its heading
    const heading = page.getByRole('heading', { name: /sign in/i });
    await expect(heading).toBeVisible();
  });

  test('unauthenticated user is redirected from datasets to sign-in', async ({ page }) => {
    await page.goto('/dashboard/datasets');
    await expect(page).toHaveURL(/.*\/sign-in.*/);
  });
  
  test('unauthenticated user is redirected from playgrounds to sign-in', async ({ page }) => {
    await page.goto('/dashboard/playgrounds');
    await expect(page).toHaveURL(/.*\/sign-in.*/);
  });
});
