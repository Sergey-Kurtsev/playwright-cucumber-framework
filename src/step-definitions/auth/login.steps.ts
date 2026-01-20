import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { LoginPage } from '../../pages/auth/LoginPage';
import { TestData } from '../../utils/test-data';
import { page } from '../../hooks/hooks';
let loginPage: LoginPage;

Given('I am on the login page', async function () {
  loginPage = new LoginPage(page);
  await loginPage.navigate();
});

When('I enter valid credentials', async function () {
  const credentials = TestData.validCredentials;
  await loginPage.login(credentials.username, credentials.password);
});

When('I enter invalid credentials', async function () {
  const credentials = TestData.invalidCredentials;
  await loginPage.login(credentials.username, credentials.password);
});

When('I enter username {string} and password {string}', async function (username: string, password: string) {
  const credentials = TestData.validCredentials;
  await loginPage.fillLoginForm(username, password);
});

When('I click the login button', async function () {
  await loginPage.clickLoginButton();
});

Then('I should be logged in successfully', async function () {
  const isLoggedIn = await loginPage.isLoggedIn();
  expect(isLoggedIn).toBe(true);
});

Then('I should see an error message', async function () {
  const errorMessage = await loginPage.getErrorMessage();
  expect(errorMessage.length).toBeGreaterThan(0);
});

Then('I should see error message {string}', async function (expectedMessage: string) {
  await loginPage.verifyErrorMessage(expectedMessage);
});

Then('I should remain on the login page', async function () {
  const isOnLoginPage = await loginPage.isOnLoginPage();
  expect(isOnLoginPage).toBe(true);
});
