import { test, expect } from './fixtures.js';

test('deployed tutoring placeholder and project assets load', async ({
  page,
  request,
  baseURL,
}) => {
  await expect
    .poll(async () => (await request.get('./')).status(), {
      timeout: 15000,
      intervals: [1000, 3000, 5000],
    })
    .toBe(200);
  expect((await page.goto('./')).ok()).toBe(true);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Tutoring', exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('main')).toContainText('Coming soon.');
  const scripts = await page
    .locator('script[src]')
    .evaluateAll((elements) => elements.map((element) => element.src));
  expect(scripts.length).toBeGreaterThan(0);
  for (const src of scripts) {
    expect(new URL(src).origin).toBe(new URL(baseURL).origin);
    expect(new URL(src).pathname).toMatch(/^\/tutoring\//);
    const asset = await request.get(src);
    expect(asset.ok()).toBe(true);
    expect(asset.headers()['content-type']).toMatch(/javascript/);
  }
});
