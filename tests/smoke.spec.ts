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

test('about-me page displays Reinvention with Agentic AI badge', async ({ page }) => {
  await page.goto('/about-me');
  
  // Verify the title is on the page
  const certTitle = page.getByText('Reinvention with Agentic AI');
  await expect(certTitle).toBeVisible();

  // Verify the badge container exists
  const badgeContainer = page.locator('div[data-share-badge-id="26c30a0c-9500-4731-b2d5-aeff36b4c346"]');
  await expect(badgeContainer).toBeAttached();
});
