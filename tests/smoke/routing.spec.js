import { test, expect } from './fixtures.js';

test('project redirect preserves queries and unknown paths return real 404s', async ({
  request,
}) => {
  const redirect = await request.get('/tutoring?source=smoke', {
    maxRedirects: 0,
  });
  expect(redirect.status()).toBe(301);
  expect(redirect.headers().location).toBe('/tutoring/?source=smoke');
  for (const path of ['/smoke-missing-page', '/tutoring/smoke-missing-page']) {
    expect((await request.get(path)).status()).toBe(404);
  }
});
