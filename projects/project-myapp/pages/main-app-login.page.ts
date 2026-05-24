import { Page, Locator, expect } from '@playwright/test';
import { resilient, byOsName, byPartialClass } from '@shared/utils/locators';
import { MYAPP_URLS } from '../config';

/**
 * Page Object for the main MyApp login screen.
 * 
 * Note: Main app uses different element IDs than Admin Portal:
 * - Main app: #Input_UsernameVal (email field)
 * - Admin Portal: #Input_Username 
 */
export class MainAppLoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly ssoButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Main app specific selectors (different from Admin Portal)
    this.usernameInput = page.locator('#Input_UsernameVal'); // Email field in main app
    this.passwordInput = page.locator('#Input_Password');    // Same as Admin Portal
    this.loginButton   = page.locator('button[type="submit"]');
    this.ssoButton     = page.getByRole('button', { name: /continue with.*sso/i });

    this.errorMessage = resilient(
      page.getByRole('alert'),
      byPartialClass(page, 'feedback-message-error'),
      byPartialClass(page, 'error-message'),
    );
  }

  async goto() {
    await this.page.goto(MYAPP_URLS.app, { waitUntil: 'domcontentloaded' });
  }

  async login(username: string, password: string) {
    await expect(this.usernameInput).toBeVisible({ timeout: 15_000 });
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    // Wait for the post-login redirect so subsequent steps don't race the
    // navigation and check the still-rendered login page.
    await Promise.all([
      this.page.waitForURL((u) => !/\/Login(\?|$)/i.test(u.toString()), { timeout: 15_000 }),
      this.loginButton.click(),
    ]);
  }

  /**
   * Attempt login without expecting successful navigation.
   * Use for negative test cases where login should fail.
   */
  async attemptLogin(username: string, password: string) {
    await expect(this.usernameInput).toBeVisible({ timeout: 15_000 });
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    // Give the server time to process and show any error messages
    await this.page.waitForTimeout(2000);
  }

  /**
   * Use SSO login instead of username/password
   */
  async loginWithSSO() {
    await expect(this.ssoButton).toBeVisible({ timeout: 15_000 });
    await Promise.all([
      this.page.waitForURL((u) => !/\/Login(\?|$)/i.test(u.toString()), { timeout: 15_000 }),
      this.ssoButton.click(),
    ]);
  }
}