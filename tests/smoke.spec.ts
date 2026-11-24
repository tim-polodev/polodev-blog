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
    { title: 'Certified Partner Specialist Gemini Enterprise Agent Development', badgeId: '766dd33b-7a5d-419b-b6d8-028ec6ce1000' },
    { title: 'Deploy an Agent with Agent Development Kit (ADK)', badgeId: 'da525198-9e06-497b-b714-2b3adca0c0b1' },
    { title: 'Evaluate and Improve Agent Development Kit Agents', badgeId: 'a3f6ea3a-9bda-4b3d-8527-bff270bba5b2' },
    { title: 'Accelerate Development with Antigravity', badgeId: 'ea28463b-dd91-48f5-ab46-bc5d330eec34' },
    { title: 'Generative AI Leader Certification', badgeId: 'dbbb93d8-b47e-4aee-a1a3-b1fca1fea690' },
    { title: 'Professional Cloud DevOps Engineer', badgeId: '9a08aecc-1072-41d4-91bc-04a8e9f2d335' },
    { title: 'Professional Machine Learning Engineer', badgeId: '3b6b6aa5-5425-42f1-a804-c2e4c6061fcc' },
    { title: 'AWS Solutions Architect Associate', badgeId: '66c140c3-c105-4b91-be83-ba77743e8831' },
    { title: 'Kubernetes and Cloud Native Associate', badgeId: 'c8d3d61d-aa34-492d-9124-645989352191' },
    { title: 'Kubernetes and Cloud Native Security Associate', badgeId: 'cf6d1bd6-e567-4102-9655-1d0871a4c64a' },
    { title: 'Certified Kubernetes Administrator', badgeId: '82f115a3-73f5-4c4e-92a2-ad21dd8cda99' },
    { title: 'Certified Kubernetes Application Developer', badgeId: '21e2ac23-ef0b-49b6-bcd7-fcfca504a930' },
    { title: 'Certified Kubernetes Security Specialist', badgeId: 'c11e24ef-dc8a-4f43-b23f-766202fa94f4' },
    { title: 'Kubestronaut', badgeId: '226cb096-3ae0-49e9-82e2-a390ba775d9d' },
  ];

  const certsSection = page.locator('section', {
    has: page.getByRole('heading', { name: 'Licenses & Certifications' }),
  });

  for (const cert of certifications) {
    const title = certsSection.getByText(cert.title, { exact: true });
    await expect(title).toBeVisible();

    const badge = certsSection.locator(`div[data-share-badge-id="${cert.badgeId}"]`);
    await expect(badge).toBeAttached();
  }
});

test('about-me page displays VMO C11 Shining Star award image on hover', async ({ page }) => {
  await page.goto('/about-me');

  const awardTitle = page.getByText('VMO C11 Shining Star Award');
  await expect(awardTitle).toBeVisible();

  const awardImage = page.getByAltText('VMO C11 Shining Star Award');

  // Initially not visible before hover
  await expect(awardImage).not.toBeVisible();

  // Hover over the title to display fullsize preview
  await awardTitle.hover();
  await expect(awardImage).toBeVisible();

  // Move mouse away to hide preview
  await page.mouse.move(0, 0);
  await expect(awardImage).not.toBeVisible();
});


