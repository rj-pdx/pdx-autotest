import { Page, Locator, expect } from '@playwright/test';
import { resilient, byPartialClass, byPartialAriaLabel } from '@shared/utils/locators';

/**
 * Page Object for the main MyApp dashboard/landing page.
 * Different from Admin Portal dashboard - uses /MyApp/ base URL.
 */
export class MainAppDashboardPage {
  readonly page: Page;
  readonly header: Locator;
  readonly welcomeMessage: Locator;
  readonly userMenu: Locator;
  readonly logoutButton: Locator;
  readonly dashboardLink: Locator;
  readonly profilesLink: Locator;

  constructor(page: Page) {
    this.page = page;

    this.header = resilient(
      page.getByRole('heading', { name: /welcome/i }),
      page.locator('h1, h2').first(),
    );

    this.welcomeMessage = page.locator('h1:has-text("Welcome")');

    // Top navigation links
    this.dashboardLink = page.getByRole('link', { name: 'Dashboard' });
    this.profilesLink = page.getByRole('link', { name: 'Profiles' });

    // User menu in top right (shows user initials or name)
    this.userMenu = resilient(
      page.getByRole('button', { name: /user|profile/i }),
      page.locator('[class*="user"], [class*="profile"]').first(),
    );

    this.logoutButton = resilient(
      page.getByRole('button',    { name: /log\s?out|sign\s?out/i }),
      page.getByRole('link',      { name: /log\s?out|sign\s?out/i }),
      page.getByRole('menuitem',  { name: /log\s?out|sign\s?out/i }),
    );
  }

  async assertLoaded() {
    // Main app stays at /MyApp/ after login (no dashboard path)
    await expect(this.page).toHaveURL(/\/MyApp\//i, { timeout: 15_000 });
    await expect(this.welcomeMessage).toBeVisible({ timeout: 10_000 });
  }

  async logout() {
    // May need to click user menu first to reveal logout option
    if (await this.userMenu.isVisible()) {
      await this.userMenu.click();
    }
    await this.logoutButton.click();
  }

  async navigateToDashboard() {
    await this.dashboardLink.click();
  }

  async navigateToProfiles() {
    await this.profilesLink.click();
  }
}