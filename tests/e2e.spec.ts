import { test, expect, Page } from '@playwright/test';

const MOCK_ARTICLE = {
  id: 1,
  documentId: 'mock-article-1',
  title: 'Kubernetes Homelab Guide',
  description: 'Setting up a resilient Kubernetes cluster at home.',
  tags: ['kubernetes', 'devops'],
  publishedAt: '2026-08-01T00:00:00.000Z',
  cover: {
    url: '/polodev-logo.jpg',
    alternativeText: 'Polodev Cover',
  },
  MDContent: '# Heading\n\n```ts\nconsole.log("hello polodev");\n```\n',
};

async function mockArticlesFallback(page: Page) {
  await page.route('**/api/articles**', async (route) => {
    const url = new URL(route.request().url());
    const isDetail = /\/api\/articles\/[^/]+$/.test(url.pathname);
    try {
      const response = await route.fetch({ timeout: 2000 });
      if (response.ok()) {
        const body = await response.json();
        const hasData = isDetail ? Boolean(body?.data) : Array.isArray(body?.data) && body.data.length > 0;
        if (hasData) {
          await route.fulfill({ response, json: body });
          return;
        }
      }
    } catch {
      // CMS is not running locally; serve deterministic fixture data.
    }

    if (isDetail) {
      await route.fulfill({ json: { data: MOCK_ARTICLE, meta: {} } });
      return;
    }

    const pageNum = url.searchParams.get('pagination[page]') || '1';
    await route.fulfill({
      json: {
        data: pageNum === '1' ? [MOCK_ARTICLE] : [],
        meta: { pagination: { page: Number(pageNum), pageSize: 10, pageCount: 1, total: 1 } },
      },
    });
  });
}

test.describe('General UI and Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await mockArticlesFallback(page);
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
    await mockArticlesFallback(page);
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
