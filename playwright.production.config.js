import { defineConfig } from '@playwright/test';
import config from './playwright.config.js';

const baseURL =
  process.env.SMOKE_BASE_URL || 'https://alanwychen.github.io/tutoring/';
const url = new URL(baseURL);
if (
  !['http:', 'https:'].includes(url.protocol) ||
  url.pathname !== '/tutoring/'
) {
  throw new Error('SMOKE_BASE_URL must be an HTTP(S) URL ending in /tutoring/');
}

export default defineConfig({
  ...config,
  projects: [
    { name: 'production', use: { viewport: { width: 1440, height: 900 } } },
  ],
  testIgnore: [],
  testMatch: '**/production.spec.js',
  fullyParallel: false,
  workers: 1,
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report/production' }],
  ],
  outputDir: 'test-results/production',
  retries: 2,
  timeout: 45000,
  webServer: undefined,
  use: { ...config.use, baseURL },
});
