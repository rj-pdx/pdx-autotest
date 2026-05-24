import { Page, Locator, expect } from '@playwright/test';
import { resilient, byOsName, byPartialClass } from '@shared/utils/locators';
import { MYAPP_URLS } from '../config';

/**
 * Page Object for the MyApp Admin Portal login screen.
 *
 * Locator strategy (see docs/locator-strategy.md):
 *   1. User-facing  — getByLabel / getByRole
 *   2. Partial-attr — byOsName / byPartialClass (framework-safe fallbacks)
 * Chained via resilient() so a DOM shift doesn't break the test.
 */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;

    // Framework variable-name inputs — these IDs are stable for this app.
    // Direct locators (no .or() chain) to avoid union-locator ambiguity.
    this.usernameInput = page.locator('#Input_Username');
    this.passwordInput = page.locator('#Input_Password');
    this.loginButton   = page.locator('button[type="submit"]');

    this.errorMessage = resilient(
      page.getByRole('alert'),
      byPartialClass(page, 'feedback-message-error'),
      byPartialClass(page, 'error-message'),
    );
  }

  async goto(target: 'adminPortal' | 'app' = 'adminPortal') {
    // Use the full configured URL so we preserve the application path
    await this.page.goto(MYAPP_URLS[target], { waitUntil: 'domcontentloaded' });
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
}