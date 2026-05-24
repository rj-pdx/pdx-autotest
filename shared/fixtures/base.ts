import { test as base, expect } from '@playwright/test';

/**
 * Base test fixture with common setup.
 * Extend this in project-specific fixtures.
 */
export const test = base.extend({
  // Add any global fixtures or configurations here
});

export { expect };