import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  // Adjust this based on your actual page title or content
  await expect(page).toHaveTitle(/polodev/i);
});

test('navigation to about-me works', async ({ page }) => {
  await page.goto('/');

  // Assuming there is a link to about-me
  const aboutLink = page.getByRole('link', { name: /about/i });
  if (await aboutLink.isVisible()) {
    await aboutLink.click();
    await expect(page).toHaveURL(/\/about-me/);
  }
});
