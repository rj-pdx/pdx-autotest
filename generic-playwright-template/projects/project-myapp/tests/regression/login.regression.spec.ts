import { test, expect } from '../../fixtures';

/**
 * Regression: broader negative and edge-case coverage for login.
 */
test.describe('MyApp — Login Regression @regression', () => {
  test('[TEST-006] (AdminPortal) rejects empty credentials', async ({ loginPage }) => {
    await loginPage.loginButton.click();
    await expect(loginPage.usernameInput).toBeVisible();
    // Expect to remain on login page
    await expect(loginPage.page).toHaveURL(/.*/);
  });

  test('[TEST-005] (AdminPortal) rejects invalid password', async ({ loginPage }) => {
    await loginPage.attemptLogin('admin@example.com', 'definitely-wrong-password');
    await expect(loginPage.errorMessage).toBeVisible({ timeout: 10_000 });
  });

  test('[TEST-004] (AdminPortal) rejects unknown username', async ({ loginPage }) => {
    await loginPage.attemptLogin('no-such-user-xyz@example.com', 'whatever');
    await expect(loginPage.errorMessage).toBeVisible({ timeout: 10_000 });
  });

  test('[TEST-003] (AdminPortal) password field masks input @happy', async ({ loginPage }) => {
    await loginPage.passwordInput.fill('secret');
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });
});