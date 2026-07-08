import { defineConfig, devices } from '@playwright/test';
import { TestOptions } from './test-options';

import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig<TestOptions>({
  forbidOnly: !!process.env.CI,
  retries: 1,
  reporter: [
    ['html'],
    ['allure-playwright']
  ],
  use: {
    baseURL: 'http://localhost:4200/',
    globalQaURL: 'https://www.globalsqa.com/demo-site/draganddrop/',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200/',
     timeout: 120000
  }
});
