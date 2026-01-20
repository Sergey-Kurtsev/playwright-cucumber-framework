import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../../pages/auth/LoginPage';
import { EmployeePage } from '../../pages/employee/EmployeePage';
import { TestData, EmployeeData } from '../../utils/test-data';
import { page } from '../../hooks/hooks';

let loginPage: LoginPage;
let employeePage: EmployeePage;

Given('I am logged in to OrangeHRM', async function () {
  loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.loginWithDefaultCredentials();
  const isLoggedIn = await loginPage.isLoggedIn();
  expect(isLoggedIn).toBe(true);
});

Given('I navigate to the Add Employee page', async function () {
  employeePage = new EmployeePage(page);
  await employeePage.navigateToAddEmployee();
});

When('I fill in the employee form with first name {string}, middle name {string}, and last name {string}', 
  async function (firstName: string, middleName: string, lastName: string) {
    employeePage = new EmployeePage(page);
    const employeeData: EmployeeData = {
      firstName,
      middleName,
      lastName,
    };
    await employeePage.fillEmployeeForm(employeeData);
  }
);

When('I fill in the employee form with first name {string} and last name {string}', 
  async function (firstName: string, lastName: string) {
    employeePage = new EmployeePage(page);
    const employeeData: EmployeeData = {
      firstName,
      lastName,
    };
    await employeePage.fillEmployeeForm(employeeData);
  }
);

When('I add a new employee with required information', async function () {
  employeePage = new EmployeePage(page);
  await employeePage.addEmployee(TestData.sampleEmployee);
});

When('I save the employee form', async function () {
  await employeePage.saveEmployee();
});

Then('The employee should be created successfully', async function () {
  await employeePage.verifyEmployeeCreated(TestData.sampleEmployee);
});

Then('I should see a success message', async function () {
  const successMessage = await employeePage.getSuccessMessage();
  expect(successMessage.length).toBeGreaterThan(0);
});

Then('the employee {string} {string} should be displayed', async function (firstName: string, lastName: string) {
  const employeeData: EmployeeData = { firstName, lastName };
  await employeePage.verifyEmployeeCreated(employeeData);
});
