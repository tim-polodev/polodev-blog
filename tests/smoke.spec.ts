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

test('all certification badges are present on about-me page', async ({ page }) => {
  await page.goto('/about-me');

  const certifications = [
    { title: 'Reinvention with Agentic AI', badgeId: '26c30a0c-9500-4731-b2d5-aeff36b4c346' },
    { title: 'Generative AI Leader Certification', badgeId: 'dbbb93d8-b47e-4aee-a1a3-b1fca1fea690' },
    { title: 'Professional Cloud DevOps Engineer', badgeId: '9a08aecc-1072-41d4-91bc-04a8e9f2d335' },
    { title: 'Professional Machine Learning Engineer', badgeId: '3b6b6aa5-5425-42f1-a804-c2e4c6061fcc' },
    { title: 'AWS Solutions Architect Associate', badgeId: '66c140c3-c105-4b91-be83-ba77743e8831' },
    { title: 'Kubernetes and Cloud Native Associate', badgeId: '35744b06-60e7-4a56-a5a0-d99bc908d9fe' },
  ];

  for (const cert of certifications) {
    const title = page.getByText(cert.title);
    await expect(title).toBeVisible();

    const badge = page.locator(`div[data-share-badge-id="${cert.badgeId}"]`);
    await expect(badge).toBeAttached();
  }
});
