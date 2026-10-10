import { defineConfig } from '@playwright/test';

export default defineConfig({
  testMatch: '**/*.e2e.ts',
  use: {
    baseURL: 'http://localhost:4321',
    browserName: 'chromium',
    launchOptions: {
      executablePath: process.env.CHROMIUM_PATH,
    },
  },
  webServer: {
    command: 'exec node node_modules/astro/bin/astro.mjs dev --host localhost',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
  },
});
