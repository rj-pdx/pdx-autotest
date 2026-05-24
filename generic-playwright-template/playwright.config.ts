import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './projects',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    // Smoke Tests - Critical path, fast execution
    {
      name: 'myapp-smoke',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/smoke/**/*.spec.ts',
      // Admin Portal default for smoke tests
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.MYAPP_ADMINPORTAL_URL ?? 'https://test.example.com/AdminPortal/',
      },
    },

    // Regression Tests - Comprehensive coverage
    {
      name: 'myapp-regression',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/regression/**/*.spec.ts',
      timeout: 90_000, // Extended timeout for complex flows
      // Admin Portal default for regression tests
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.MYAPP_ADMINPORTAL_URL ?? 'https://test.example.com/AdminPortal/',
      },
    },

    // Manual Tests - Interactive exploration
    {
      name: 'myapp-manual',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/manual/**/*.spec.ts',
      timeout: 5 * 60_000, // 5 minutes for manual interaction
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env.MYAPP_ADMINPORTAL_URL ?? 'https://test.example.com/AdminPortal/',
        // Always run manual tests in headed mode
        headless: false,
      },
    },
  ],

  /* Global setup and teardown */
  // globalSetup: require.resolve('./global-setup'),
  // globalTeardown: require.resolve('./global-teardown'),
});