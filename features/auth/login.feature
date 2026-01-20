Feature: User Login
  As a user
  I want to log in to OrangeHRM
  So that I can access the application features

  Background:
    Given I am on the login page

  Scenario: Successful login with valid credentials
    When I enter valid credentials
    Then I should be logged in successfully

  Scenario: Failed login with invalid credentials
    When I enter invalid credentials
    Then I should see an error message
    And I should remain on the login page
