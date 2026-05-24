import { Locator, Page } from '@playwright/test';

/**
 * Resilient locator builder - tries multiple strategies in order.
 * First visible match wins, providing fallback options for UI framework changes.
 */
export function resilient(...locators: Locator[]): Locator {
  if (locators.length === 0) {
    throw new Error('resilient() requires at least one locator');
  }
  
  return locators.reduce((acc, loc) => acc.or(loc));
}

/**
 * Partial attribute matching for framework-generated names.
 * Useful when full IDs are dynamic but contain stable keywords.
 */
export function byPartialAttr(page: Page, attribute: string, value: string): Locator {
  return page.locator(`[${attribute}*="${value}"]`);
}

/**
 * Framework-friendly name matching (e.g., OutSystems, React, Angular).
 * Matches elements with names/IDs containing the specified text.
 */
export function byOsName(page: Page, name: string): Locator {
  return page.locator(`[name*="${name}"], [id*="${name}"]`);
}

/**
 * Partial ID matching - useful for dynamic ID prefixes/suffixes.
 */
export function byPartialId(page: Page, idPart: string): Locator {
  return page.locator(`[id*="${idPart}"]`);
}

/**
 * Partial aria-label matching.
 */
export function byPartialAriaLabel(page: Page, labelPart: string): Locator {
  return page.locator(`[aria-label*="${labelPart}"]`);
}

/**
 * Partial class name matching.
 */
export function byPartialClass(page: Page, classPart: string): Locator {
  return page.locator(`[class*="${classPart}"]`);
}