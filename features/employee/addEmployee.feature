Feature: Add Employee
  As an HR administrator
  I want to add a new employee to the system
  So that I can manage employee records

  Background:
    Given I am logged in to OrangeHRM

  Scenario: Add new employee with required information
    Given I navigate to the Add Employee page
    When I add a new employee with required information
    Then The employee should be created successfully