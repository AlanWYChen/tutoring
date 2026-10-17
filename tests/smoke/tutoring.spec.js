import { test, expect, expectNoOverflow } from './fixtures.js';

test('tutoring placeholder renders at its production base path', async ({
  page,
  siteHealth,
}) => {
  const response = await page.goto('/tutoring/');
  expect(response.ok()).toBe(true);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Tutoring', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('main')).toContainText('Coming soon.');
  await page.reload();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Tutoring', exact: true }),
  ).toBeVisible();
  await expect(page.locator('a[href]')).toHaveCount(0);
  await expectNoOverflow(page);
  expect(siteHealth.assets.size).toBeGreaterThan(0);
  for (const asset of siteHealth.assets) {
    expect(new URL(asset).pathname).toMatch(/^\/tutoring\//);
  }
});
