import { test, expect } from '@playwright/test';

test('main user journey: landing to playground', async ({ page }) => {
  // 1. Visit landing page
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Master Data Structures');

  // 2. Click explore structures
  await page.click('text=Explore Structures');
  await expect(page).toHaveURL('/structures');
  await expect(page.locator('h1')).toContainText('Data Structures');

  // 3. Click Array structure
  await page.click('text=Array');
  await expect(page).toHaveURL('/structures/array');
  await expect(page.locator('h1')).toContainText('Array');

  // 4. Check tabs
  await expect(page.locator('text=Mental Model')).toBeVisible();
  
  // 5. Open in playground
  await page.click('text=Open in Playground');
  await expect(page).toHaveURL('/playground?structure=array');
  await expect(page.locator('h1', { hasText: 'Playground' })).toBeVisible();
});
