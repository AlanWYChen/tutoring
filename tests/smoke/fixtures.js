import { test as base, expect } from '@playwright/test';

export { expect };
export const test = base.extend({
  siteHealth: [
    async ({ page, baseURL }, use) => {
      const origin = new URL(baseURL).origin;
      const assets = new Set();
      const errors = [];
      const isLocalAsset = (request) =>
        new URL(request.url()).origin === origin &&
        ['script', 'stylesheet', 'image', 'font'].includes(
          request.resourceType(),
        );

      // Exercise system-font fallbacks deterministically, without external requests.
      await page.route(
        /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
        (route) =>
          route.fulfill({ status: 200, contentType: 'text/css', body: '' }),
      );
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('request', (request) => {
        if (isLocalAsset(request)) assets.add(request.url());
      });
      page.on('response', (response) => {
        if (isLocalAsset(response.request()) && response.status() >= 400) {
          errors.push(`${response.status()} ${response.url()}`);
        }
      });
      page.on('requestfailed', (request) => {
        if (isLocalAsset(request))
          errors.push(`${request.failure()?.errorText} ${request.url()}`);
      });
      await use({ assets });
      expect(
        errors,
        'Uncaught application errors or failed local assets',
      ).toEqual([]);
    },
    { auto: true },
  ],
});

export async function expectNoOverflow(page) {
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    )
    .toBe(true);
}

export async function loadImages(page) {
  for (const image of await page.locator('img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect
      .poll(
        () =>
          image.evaluate(
            (element) => element.complete && element.naturalWidth > 0,
          ),
        { message: `Image must load: ${await image.getAttribute('src')}` },
      )
      .toBe(true);
  }
}
