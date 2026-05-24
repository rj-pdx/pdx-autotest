import { test, expect } from '../../fixtures/main-app';

/**
 * Smoke: minimum critical-path coverage for main MyApp dashboard.
 */
test.describe('MyApp Main App — Dashboard Smoke @smoke', () => {
  test.beforeEach(async ({ loginPage }) => {
    const username = process.env.MYAPP_ADMIN_USER ?? 'admin@example.com';
    const password = process.env.MYAPP_ADMIN_PASS ?? 'admin123';
    await loginPage.login(username, password);
  });

  test('[TEST-037] (MyApp) dashboard renders for authenticated user @happy', async ({ dashboardPage }) => {
    await dashboardPage.assertLoaded();
    await expect(dashboardPage.header).toBeVisible();
  });
});