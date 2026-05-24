import { test, expect } from '../../fixtures';

test.describe('MyApp — Dashboard Smoke @smoke', () => {
  test.beforeEach(async ({ loginPage }) => {
    const username = process.env.MYAPP_ADMIN_USER ?? 'admin@example.com';
    const password = process.env.MYAPP_ADMIN_PASS ?? 'admin123';
    await loginPage.login(username, password);
  });

  test('[TEST-007] dashboard renders for authenticated user @happy', async ({ dashboardPage }) => {
    await dashboardPage.assertLoaded();
    await expect(dashboardPage.header).toBeVisible();
  });
});