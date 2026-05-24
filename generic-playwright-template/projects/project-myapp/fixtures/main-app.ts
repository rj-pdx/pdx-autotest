import { test as baseTest, expect } from '@shared/fixtures/base';
import { MainAppLoginPage } from '../pages/main-app-login.page';
import { MainAppDashboardPage } from '../pages/main-app-dashboard.page';
import { MYAPP_USERS, MyAppRole } from '../config';

/**
 * MyApp Main App-specific fixtures.
 * Import { test, expect } from this file for main app specs (not Admin Portal).
 */
export const test = baseTest.extend<{
  loginPage: MainAppLoginPage;
  dashboardPage: MainAppDashboardPage;
  loginAs: (role: MyAppRole) => Promise<void>;
}>({
  loginPage: async ({ page }, use) => {
    const login = new MainAppLoginPage(page);
    await login.goto(); // MainAppLoginPage handles the main app URL
    await use(login);
  },

  dashboardPage: async ({ page }, use) => {
    await use(new MainAppDashboardPage(page));
  },

  loginAs: async ({ loginPage, page }, use) => {
    await use(async (role: MyAppRole) => {
      const { username, password } = MYAPP_USERS[role];

      if (username && password) {
        // Use explicit credentials for main app login
        await loginPage.login(username, password);
        return;
      }

      throw new Error(
        `No credentials for role "${role}" for main MyApp. ` +
        `Please set the appropriate environment variables in .env file.`,
      );
    });
  },
});

/**
 * Optional pause before each test tears down, controlled by `MYAPP_HOLD_MS`.
 * Useful in headed runs to visually verify the final state.
 *   MYAPP_HOLD_MS=2000 npm run test:myapp:smoke -- --headed
 */
test.afterEach(async ({ page }) => {
  const hold = Number(process.env.MYAPP_HOLD_MS ?? 0);
  if (hold > 0) await page.waitForTimeout(hold);
});

export { expect };