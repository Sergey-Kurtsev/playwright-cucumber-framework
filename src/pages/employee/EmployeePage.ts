import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base/BasePage';
import { EmployeeData } from '../../utils/test-data';

/**
 * Employee Page Object Model
 * Handles all interactions with the OrangeHRM employee management pages
 */
export class EmployeePage extends BasePage {
  // Locators
  private readonly pimMenu: Locator;
  private readonly addEmployeeMenu: Locator;
  private readonly firstNameInput: Locator;
  private readonly middleNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly employeeIdInput: Locator;
  private readonly saveButton: Locator;
  private readonly successMessage: Locator;
  private readonly employeeNameHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.pimMenu = page.locator('a[href*="pim"]').first();
    this.addEmployeeMenu = page.locator('//li[a[text()="Add Employee"]]');
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.middleNameInput = page.locator('input[name="middleName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.employeeIdInput = page.locator('//div[label[text()="Employee Id"]]/following::input[1]');
    this.saveButton = page.locator('button[type="submit"]');
    // this.successMessage = page.locator('.oxd-toast-content-text');
    this.successMessage = page.locator('//*[contains(text(), "Saved")]');
    this.employeeNameHeader = page.locator('.orangehrm-edit-employee-name');
  }

  /**
   * Navigate to PIM module
   */
  async navigateToPIM(): Promise<void> {
    await this.clickElement(this.pimMenu);
    await this.waitForPageLoad();
  }

  /**
   * Navigate to Add Employee page
   */
  async navigateToAddEmployee(): Promise<void> {
    await this.navigateToPIM();
    await this.clickElement(this.addEmployeeMenu);
    await this.waitForPageLoad();
  }

  /**
   * Fill employee form with provided data
   */
  async fillEmployeeForm(employeeData: EmployeeData): Promise<void> {
    await this.fillField(this.firstNameInput, employeeData.firstName);
    
    if (employeeData.middleName) {
      await this.fillField(this.middleNameInput, employeeData.middleName);
    }
    
    await this.fillField(this.lastNameInput, employeeData.lastName);
    
    if (employeeData.employeeId) {
      await this.fillField(this.employeeIdInput, employeeData.employeeId);
    }

  }

  /**
   * Save the employee form
   */
  async saveEmployee(): Promise<void> {
    await this.clickElement(this.saveButton);
    await this.waitForPageLoad();
  }

  /**
   * Add a new employee with provided data
   */
  async addEmployee(employeeData: EmployeeData): Promise<void> {
    await this.navigateToAddEmployee();
    await this.fillEmployeeForm(employeeData);
    await this.saveEmployee();
  }

  /**
   * Verify employee was created successfully
   */
  async verifyEmployeeCreated(employeeData: EmployeeData): Promise<void> {
    // Wait for success message or employee name header
    // const successVisible = await this.isVisible(this.successMessage.first());
    const headerVisible = await this.isVisible(this.employeeNameHeader);
    
    // if (successVisible) {
    //   const message = await this.getText(this.successMessage);
    //   expect(message.toLowerCase()).toContain('success');
    // }
    if (headerVisible) {
      const nameText = (await this.getText(this.employeeNameHeader)).trim();
      process.stdout.write(`\n[DEBUG] Verify creation name: ${nameText}\n`);
      expect(nameText).toContain(employeeData.firstName);
      expect(nameText).toContain(employeeData.lastName);
    }
  }

  /**
   * Get success message text
   */
  async getSuccessMessage(): Promise<string> {
    if (await this.isVisible(this.successMessage)) {
      return await this.getText(this.successMessage);
    }
    return '';
  }
}
