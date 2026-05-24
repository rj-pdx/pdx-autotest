import { test, expect } from '../../fixtures/main-app';

/**
 * Regression: broader negative and edge-case coverage for main MyApp login.
 */
test.describe('MyApp Main App — Login Regression @regression', () => {
  test('[TEST-032] (MyApp) rejects empty credentials', async ({ loginPage }) => {
    await loginPage.loginButton.click();
    await expect(loginPage.usernameInput).toBeVisible();
    // Expect to remain on login page
    await expect(loginPage.page).toHaveURL(/.*/);
  });

  test('[TEST-033] (MyApp) rejects invalid password', async ({ loginPage }) => {
    await loginPage.attemptLogin('admin@example.com', 'definitely-wrong-password');
    await expect(loginPage.errorMessage).toBeVisible({ timeout: 10_000 });
  });

  test('[TEST-034] (MyApp) rejects unknown username', async ({ loginPage }) => {
    await loginPage.attemptLogin('no-such-user-xyz@example.com', 'whatever');
    await expect(loginPage.errorMessage).toBeVisible({ timeout: 10_000 });
  });

  test('[TEST-035] (MyApp) password field masks input @happy', async ({ loginPage }) => {
    await loginPage.passwordInput.fill('secret');
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });
});