import { test, expect } from '../../fixtures';

/**
 * Smoke: minimum critical-path coverage.
 * Should be fast, deterministic, and run on every commit.
 */
test.describe('MyApp — Smoke @smoke', () => {
  test('[TEST-009] (AdminPortal) login page loads @happy', async ({ loginPage }) => {
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('[TEST-008] (AdminPortal) valid user can log in @happy', async ({ loginPage, dashboardPage }) => {
    const username = process.env.MYAPP_ADMIN_USER ?? 'admin@example.com';
    const password = process.env.MYAPP_ADMIN_PASS ?? 'admin123';

    await loginPage.login(username, password);
    await dashboardPage.assertLoaded();
  });
});