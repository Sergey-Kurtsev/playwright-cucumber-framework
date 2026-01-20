import { Page, Locator, expect } from '@playwright/test';
import config from '../../utils/config';

/**
 * Base Page Object Model class
 * Provides common functionality for all page objects
 */
export abstract class BasePage {
  protected page: Page;
  protected baseUrl: string;

  constructor(page: Page) {
    this.page = page;
    this.baseUrl = config.getBaseUrl();
  }

  /**
   * Navigate to a specific URL
   */
  protected async navigateTo(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'networkidle' });
  }

  /**
   * Wait for an element to be visible
   */
  protected async waitForElement(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: timeout || config.getBrowserConfig().timeout });
  }

  /**
   * Click on an element with retry logic
   */
  protected async clickElement(locator: Locator, options?: { timeout?: number }): Promise<void> {
    await this.waitForElement(locator, options?.timeout);
    await locator.click();
  }

  /**
   * Fill an input field
   */
  protected async fillField(locator: Locator, value: string, options?: { timeout?: number }): Promise<void> {
    await this.waitForElement(locator, options?.timeout);
    await locator.clear();
    await locator.fill(value);
  }

  /**
   * Get text content from an element
   */
  protected async getText(locator: Locator): Promise<string> {
    await this.waitForElement(locator);
    return await locator.textContent() || '';
  }

  /**
   * Check if an element is visible
   */
  protected async isVisible(locator: Locator, timeout: number = 5000): Promise<boolean> {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Wait for page to load
   */
  protected async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for an element to be hidden
   */
  protected async waitForElementHidden(locator: Locator, timeout?: number): Promise<void> {
    const waitTimeout = timeout || config.getBrowserConfig().timeout;
    await locator.waitFor({ state: 'hidden', timeout: waitTimeout });
  }

  /**
   * Wait for specific URL
   */
  protected async waitForUrl(url: string | RegExp, timeout?: number): Promise<void> {
    const waitTimeout = timeout || config.getBrowserConfig().timeout;
    await this.page.waitForURL(url, { timeout: waitTimeout });
  }

  /**
   * Wait for element count to match expected
   */
  protected async waitForElementCount(locator: Locator, expectedCount: number, timeout?: number): Promise<void> {
    const waitTimeout = timeout || config.getBrowserConfig().timeout;
    await locator.first().waitFor({ timeout: waitTimeout });
    const count = await locator.count();
    if (count !== expectedCount) {
      throw new Error(`Expected ${expectedCount} elements, but found ${count}`);
    }
  }

  /**
   * Take a screenshot
   */
  protected async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `screenshots/${name}-${Date.now()}.png`, fullPage: true });
  }

  /**
   * Get page title
   */
  protected async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Wait for a specific amount of time
   */
  protected async wait(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  /**
   * Verify element contains text
   */
  protected async verifyText(locator: Locator, expectedText: string): Promise<void> {
    await this.waitForElement(locator);
    const actualText = await this.getText(locator);
    expect(actualText).toContain(expectedText);
  }
}
