import { test, expect } from '../../fixtures/main-app';

/**
 * Smoke: minimum critical-path coverage for main MyApp.
 * Should be fast, deterministic, and run on every commit.
 */
test.describe('MyApp Main App — Smoke @smoke', () => {
  test('[TEST-030] (MyApp) login page loads @happy', async ({ loginPage }) => {
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('[TEST-031] (MyApp) valid user can log in @happy', async ({ loginPage, dashboardPage }) => {
    const username = process.env.MYAPP_ADMIN_USER ?? 'admin@example.com';
    const password = process.env.MYAPP_ADMIN_PASS ?? 'admin123';

    await loginPage.login(username, password);
    await dashboardPage.assertLoaded();
  });
});