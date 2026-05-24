import { test as baseTest, expect } from '@shared/fixtures/base';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { MYAPP_USERS, MyAppRole } from '../config';

/**
 * Quick-login button label per role.
 * The Admin Portal login page may expose "Log in as <Name> (<Role>)" buttons
 * for the test environment; use them as a fallback when explicit
 * credentials for that role are not provided via env vars.
 */
const QUICK_LOGIN_LABELS: Record<MyAppRole, RegExp> = {
  systemAdmin: /Log in as .* \(Admin\)/i,
  manager:     /Log in as .* \(Manager\)/i,
  operator:    /Log in as .* \(Operator\)/i,
  viewer:      /Log in as .* \(Viewer\)/i,
};

/**
 * MyApp Admin Portal-specific fixtures.
 * Import { test, expect } from this file inside Admin Portal specs.
 */
export const test = baseTest.extend<{
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  loginAs: (role: MyAppRole) => Promise<void>;
}>({
  loginPage: async ({ page }, use) => {
    const login = new LoginPage(page);
    await login.goto();
    await use(login);
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  loginAs: async ({ loginPage, page }, use) => {
    await use(async (role: MyAppRole) => {
      const { username, password } = MYAPP_USERS[role];

      if (username && password) {
        // Explicit credentials path — preferred.
        await loginPage.login(username, password);
        return;
      }

      // Fallback: click the per-role "Log in as ..." button on the test env.
      const button = page.getByRole('button', { name: QUICK_LOGIN_LABELS[role] });
      try {
        await button.waitFor({ state: 'visible', timeout: 10_000 });
      } catch {
        throw new Error(
          `No credentials for role "${role}" and quick-login button not found. ` +
          `Set credentials in .env or ensure the Admin Portal exposes the "Log in as ..." button.`,
        );
      }
      await Promise.all([
        page.waitForURL((u) => !/\/Login(\?|$)/i.test(u.toString()), { timeout: 15_000 }),
        button.click(),
      ]);
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