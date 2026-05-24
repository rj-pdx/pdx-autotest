import { Page, Locator, expect } from '@playwright/test';
import { resilient, byPartialClass, byPartialAriaLabel } from '@shared/utils/locators';

/**
 * Page Object for the MyApp Admin Portal landing/dashboard.
 * User-facing locators first, partial-attribute fallbacks second.
 */
export class DashboardPage {
  readonly page: Page;
  readonly header: Locator;
  readonly userMenu: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.header = resilient(
      page.getByRole('heading'),
      page.locator('h1, h2'),
    );

    this.userMenu = resilient(
      page.getByRole('button', { name: /account|profile|user|menu/i }),
      byPartialAriaLabel(page, 'user'),
      byPartialClass(page, 'user-menu'),
      byPartialClass(page, 'profile'),
    );

    this.logoutButton = resilient(
      page.getByRole('button',    { name: /log\s?out|sign\s?out/i }),
      page.getByRole('link',      { name: /log\s?out|sign\s?out/i }),
      page.getByRole('menuitem',  { name: /log\s?out|sign\s?out/i }),
    );
  }

  async assertLoaded() {
    await expect(this.page).toHaveURL(/dashboard|home|main|adminportal/i, { timeout: 15_000 });
  }

  async logout() {
    await this.logoutButton.click();
  }
}