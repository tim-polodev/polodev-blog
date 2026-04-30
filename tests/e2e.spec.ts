import { test, expect } from '@playwright/test';

test.describe('General UI and Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('logo is visible on the navbar', async ({ page }) => {
    const logo = page.locator('nav').getByAltText('Polodev Logo');
    await expect(logo).toBeVisible();
    
    const logoText = page.locator('nav').getByText('Polodev');
    await expect(logoText).toBeVisible();
  });

  test('article list displays cover images and tags', async ({ page }) => {
    // Wait for at least one article card to appear
    const firstArticleCard = page.locator('a[href^="/articles/"]').first();
    await expect(firstArticleCard).toBeVisible();

    // Check cover image
    const coverImage = firstArticleCard.locator('img');
    await expect(coverImage).toBeVisible();

    // Check tags
    const tags = firstArticleCard.locator('span.rounded-full');
    const tagCount = await tags.count();
    expect(tagCount).toBeGreaterThan(0);
    await expect(tags.first()).toBeVisible();
  });

  test('dark mode toggle works', async ({ page }) => {
    const themeToggle = page.getByRole('button', { name: 'Toggle dark mode' });
    const html = page.locator('html');

    // Initial state (default is light)
    await expect(html).not.toHaveClass(/dark/);

    // Toggle to dark
    await themeToggle.click();
    await expect(html).toHaveClass(/dark/);

    // Toggle back to light
    await themeToggle.click();
    await expect(html).not.toHaveClass(/dark/);
  });
});

test.describe('Article Page Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.locator('a[href^="/articles/"]').first().click();
  });

  test('copy code feature works', async ({ page, context, browserName }) => {
    // Grant clipboard permissions for Chromium
    if (browserName === 'chromium') {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    }

    const codeBlock = page.locator('div[title="Click to copy"]').first();
    await expect(codeBlock).toBeVisible();

    // Get the code text before clicking
    const expectedCode = await codeBlock.locator('code').innerText();

    // Click to copy
    await codeBlock.click();

    // Check for "Copied!" feedback within the specific code block to avoid strict mode violation
    await expect(codeBlock.getByText('Copied!')).toBeVisible();

    // Verify clipboard content (Chromium only for reliable results)
    if (browserName === 'chromium') {
      const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
      expect(clipboardText.trim()).toBe(expectedCode.trim());
    }
  });

  test('polodev logo image in article content is visible', async ({ page }) => {
    // In ArticleContent.tsx, the author logo is rendered with alt="Polodev"
    const authorLogo = page.locator('main').getByAltText('Polodev');
    await expect(authorLogo).toBeVisible();
    await expect(authorLogo).toHaveAttribute('src', /polodev-logo\.jpg/);
  });
});
