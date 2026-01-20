import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import config from '../../utils/config';

/**
 * Login Page Object Model
 * Handles all interactions with the OrangeHRM login page
 */
export class LoginPage extends BasePage {
  // Locators
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;
  private readonly dashboardHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.oxd-alert-content-text');
    this.dashboardHeader = page.locator('.oxd-topbar-header-breadcrumb');
  }

  /**
   * Navigate to the login page
   */
  async navigate(): Promise<void> {
    await this.navigateTo(`${this.baseUrl}/auth/login`);
    await this.waitForPageLoad();
  }

  /**
   * Perform login with credentials
   */
  async login(username: string, password: string): Promise<void> {
    await this.fillField(this.usernameInput, username);
    await this.fillField(this.passwordInput, password);
    await this.clickElement(this.loginButton);
    await this.waitForPageLoad();
  }

  /**
   * Fill login form with provided credentials
   */
  async fillLoginForm(username: string, password: string): Promise<void> {
    await this.fillField(this.usernameInput, username);
    await this.fillField(this.passwordInput, password);
  }

  /**
   * Click login button
   */
  async clickLoginButton(): Promise<void> {
    await this.clickElement(this.loginButton);
    await this.waitForPageLoad();
  }

  /**
   * Login with default credentials from config
   */
  async loginWithDefaultCredentials(): Promise<void> {
    const credentials = config.getCredentials();
    await this.login(credentials.username, credentials.password);
  }

  /**
   * Check if user is logged in by verifying dashboard is visible
   */
  async isLoggedIn(): Promise<boolean> {
    try {
      return await this.isVisible(this.dashboardHeader, Math.min(15000, config.getBrowserConfig().timeout));
    } catch {
      return false;
    }
  }

  /**
   * Check if currently on the login page by verifying login form elements are visible
   */
  async isOnLoginPage(): Promise<boolean> {
    try {
      return await this.isVisible(this.usernameInput, Math.min(8000, config.getBrowserConfig().timeout));
    } catch {
      return false;
    }
  }

  /**
   * Get error message text if login fails
   */
  async getErrorMessage(): Promise<string> {
    if (await this.isVisible(this.errorMessage)) {
      return await this.getText(this.errorMessage);
    }
    return '';
  }

  /**
   * Verify error message is displayed
   */
  async verifyErrorMessage(expectedMessage: string): Promise<void> {
    await this.waitForElement(this.errorMessage);
    await this.verifyText(this.errorMessage, expectedMessage);
  }
}
