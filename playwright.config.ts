import { defineConfig } from '@playwright/test';

export default defineConfig({
  testMatch: '**/*.e2e.ts',
  use: {
    baseURL: 'http://127.0.0.1:4321',
    browserName: 'chromium',
    launchOptions: {
      executablePath: process.env.CHROMIUM_PATH,
    },
  },
  webServer: {
    command: 'exec node node_modules/astro/bin/astro.mjs dev --host 127.0.0.1',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
  },
});
