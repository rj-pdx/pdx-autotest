import { test, expect } from '../../fixtures/main-app';

test.describe('MyApp Main App — Navigation Regression @regression', () => {
  test.beforeEach(async ({ loginPage }) => {
    const username = process.env.MYAPP_ADMIN_USER ?? 'admin@example.com';
    const password = process.env.MYAPP_ADMIN_PASS ?? 'admin123';
    await loginPage.login(username, password);
  });

  test('[TEST-036] (MyApp) logout returns user to login page @happy', async ({ dashboardPage, loginPage }) => {
    await dashboardPage.assertLoaded();
    await dashboardPage.logout();
    await expect(loginPage.usernameInput).toBeVisible({ timeout: 10_000 });
  });
});