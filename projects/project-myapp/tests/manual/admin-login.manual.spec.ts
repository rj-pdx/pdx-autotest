import { test, expect } from '@shared/fixtures/base';
import { MYAPP_URLS } from '../../config';

/**
 * Manual test for exploratory testing and demo purposes.
 * Opens the Admin Portal login page and pauses for manual interaction.
 */
test.describe('Manual Testing', () => {
  test('[TEST-001] open Admin Portal login page for manual interaction', async ({ page }) => {
    console.log('[manual] Admin Portal login page loaded:', MYAPP_URLS.adminPortal);
    await page.goto(MYAPP_URLS.adminPortal);
    
    console.log('[manual] Browser is paused — log in manually, then click Resume in the Inspector.');
    await page.pause();
  });
});