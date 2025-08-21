import { expect, test } from '@playwright/test';

test.describe('Site page', () => {
  test('should have correct title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle('Lipsync Timing Checker');
  });
});
