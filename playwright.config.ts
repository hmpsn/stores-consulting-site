import { defineConfig, devices } from '@playwright/test';

const viewports = [320, 390, 768, 1024, 1440];

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: 2,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://127.0.0.1:4321',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    ...viewports.map((width) => ({
      name: `chromium-${width}`,
      use: { ...devices['Desktop Chrome'], viewport: { width, height: width <= 390 ? 844 : 900 } },
    })),
    { name: 'chromium-1106', use: { ...devices['Desktop Chrome'], viewport: { width: 1106, height: 849 } } },
    { name: 'chromium-no-js', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, javaScriptEnabled: false } },
  ],
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
