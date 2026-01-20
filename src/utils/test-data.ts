/**
 * Test data management utility
 * Centralized place for test data to avoid hardcoding in tests
 */

export interface EmployeeData {
  firstName: string;
  middleName?: string;
  lastName: string;
  employeeId?: string;
}

export const TestData = {
  validCredentials: {
    username: 'Admin',
    password: 'admin123',
  },
  invalidCredentials: {
    username: 'InvalidUser',
    password: 'InvalidPass',
  },
  sampleEmployee: {
    firstName: 'John',
    middleName: 'Michael',
    lastName: 'Doe',
  } as EmployeeData,
  employeeWithId: {
    firstName: 'Jane',
    lastName: 'Smith',
    employeeId: Date.now().toString().substring(0, 10), // Generate a unique employee ID
  } as EmployeeData,
  errorMessage: {
    loginPage: {
      invalidCredentials: 'Invalid credentials',
    },
  },
};
