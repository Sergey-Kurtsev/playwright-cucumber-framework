# Playwright + TypeScript + Cucumber Test Automation Framework

A test automation framework for the OrangeHRM demo application using Playwright, TypeScript, and Cucumber (BDD).

## Technology Stack

- **Playwright**: Modern browser automation tool
- **TypeScript**: Type-safe JavaScript
- **Cucumber**: Behavior-Driven Development (BDD)
- **Node.js**: Runtime environment

## Project Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm
- Git

### Installation Steps

1. **Navigate to the project directory:**
   ```bash
   cd Playwright-Cucumber-framework
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Install Playwright Chromium browser:**
   ```bash
   npm run install:chrome
   ```
   This installs Chromium browser required for testing. This is the default browser.

4. **Environment Configuration:**
   The framework uses environment-specific configuration files located in the `environments/` directory. The default environment is `staging`, which is already configured in `environments/staging.env`.
   
   To use a different environment, set the `ENV` environment variable:
   ```bash
   export ENV=production  # or any other environment name
   ```
   
   The framework will automatically load the corresponding `.env` file from the `environments/` directory.

### Environment Variables

The framework loads environment variables from files in the `environments/` directory. The default `staging.env` file contains:

- `BASE_URL`: Base URL of the application
- `USERNAME`: Default username for login
- `PASSWORD`: Default password for login
- `HEADLESS`: Run browser in headless mode (true/false)
- `TIMEOUT`: Default timeout in milliseconds
- `SLOW_MO`: Slow down operations by specified milliseconds
- `SCREENSHOT_ON_FAILURE`: Take screenshots on test failure (true/false)

You can override these values by setting environment variables before running tests, or by creating additional environment files.

## How to Run the Tests

### Basic Test Execution

**Run all tests (headless mode):**
```bash
npm test
```

**Run tests in headed mode (see browser):**
```bash
npm run test:headed
```

**Run tests in debug mode:**
```bash
npm run test:debug
```

### Browser-Specific Execution

**Run tests with Chrome/Chromium:**
```bash
npm run test:chrome
```

**Run tests with Chrome in headed mode:**
```bash
npm run test:chrome:headed
```

### Environment-Specific Execution

**Run tests against staging environment:**
```bash
npm run test:staging
```

**Run tests with Chrome against staging:**
```bash
npm run test:chrome:staging
```

### Custom Configuration

You can also combine environment variables for custom configurations using `npx cross-env`:
```bash
# Run with Firefox in headed mode
npx cross-env BROWSER=firefox HEADLESS=false npm test

# Run with custom timeout
npx cross-env TIMEOUT=60000 npm test

# Run with multiple custom settings
npx cross-env BROWSER=webkit HEADLESS=false TIMEOUT=60000 npm test
```

## Framework Structure

The framework follows a well-organized, scalable architecture:

### Directory Structure

```
Playwright-Cucumber-framework/
├── features/                     # Cucumber feature files (Gherkin syntax)
│   ├── auth/                     # Authentication features
│   │   └── login.feature
│   └── employee/                # Employee management features
│       └── addEmployee.feature
├── src/
│   ├── step-definitions/         # Cucumber step definitions
│   │   ├── auth/                 # Maps Gherkin steps to page actions
│   │   │   └── login.steps.ts
│   │   └── employee/
│   │       └── employee.steps.ts
│   ├── pages/                    # Page Object Model (POM)
│   │   ├── base/
│   │   │   └── BasePage.ts       # Abstract base class with common methods
│   │   ├── auth/
│   │   │   └── LoginPage.ts      # Login page interactions
│   │   └── employee/
│   │       └── EmployeePage.ts   # Employee management interactions
│   ├── utils/                    # Utilities and helpers
│   │   ├── config.ts             # Configuration manager (singleton pattern)
│   │   ├── test-data.ts          # Test data management
│   │   └── browser-factory.ts    # Browser factory for multi-browser support
│   └── hooks/                    # Cucumber hooks
│       └── hooks.ts              # Browser lifecycle management
├── environments/                 # Environment-specific configurations
│   └── staging.env               # Staging environment variables
├── screenshots/                  # Screenshots on test failures
├── reports/                      # Test reports (generated)
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
└── cucumber.config.js            # Cucumber configuration
```

### Key Architectural Patterns

1. **Page Object Model (POM)**: All page interactions are encapsulated in page classes that extend `BasePage`, providing reusable methods and maintaining separation between test logic and page implementation.

2. **BDD with Cucumber**: Tests are written in Gherkin syntax (`.feature` files), making them readable by non-technical stakeholders. Step definitions map these Gherkin steps to actual page object methods.

3. **Configuration Management**: Centralized configuration using a singleton pattern (`ConfigManager`) that loads environment-specific variables from the `environments/` directory.

4. **Browser Factory Pattern**: Supports multiple browsers (Chromium, Firefox, WebKit) through a factory pattern, allowing easy browser switching via environment variables.

5. **Cucumber Hooks**: Manages browser lifecycle:
   - `BeforeAll`: Launches browser once before all scenarios
   - `Before`: Creates a new browser context and page for each scenario
   - `After`: Takes screenshots on failure and closes context
   - `AfterAll`: Closes browser after all scenarios complete

6. **Error Handling**: Automatic screenshot capture on test failures, with screenshots saved to the `screenshots/` directory.

## Assumptions and Simplifications

The following assumptions and simplifications were made during framework development:

1. **Environment Configuration**: The framework assumes environment files are stored in the `environments/` directory with the naming convention `{environment}.env`. If no `ENV` variable is set, it defaults to `staging`.

2. **Browser Management**: A single browser instance is launched before all tests and shared across scenarios. Each scenario gets a new browser context (isolated session) but shares the same browser process for performance.

3. **Test Data**: Test data is managed through utility files and can be extended.

4. **Reporting**: The framework uses Cucumber's built-in pretty formatter for console output.

5. **Parallel Execution**: The current setup runs tests sequentially.

6. **Wait Strategies**: The framework uses explicit waits via Playwright's built-in waiting mechanisms. Wait helper methods are available in BasePage.

7. **Cross-Browser Testing**: While the framework supports multiple browsers, tests are primarily validated on Chromium.

## Test Scenarios

### Login Feature
- ✅ Successful login with valid credentials
- ✅ Failed login with invalid credentials

### Add Employee Feature
- ✅ Add new employee with required information

## Additional Information

### Adding New Tests

1. **Create a Feature File**: Add a new `.feature` file in the `features/` directory using Gherkin syntax
2. **Create Step Definitions**: Add step definitions in `src/step-definitions/` that map Gherkin steps to page object methods
3. **Create Page Objects** (if needed): Add new page classes in `src/pages/` extending `BasePage`

### Troubleshooting

- **Tests fail with "Browser not found"**: Run `npm run install:browsers`
- **TypeScript errors**: Ensure all dependencies are installed with `npm install`
- **Tests timeout**: Increase `TIMEOUT` value in the environment file or check network connectivity

### Reports

Test reports are generated in the `reports/` directory (not implemented)
- **Screenshots**: Automatically captured on test failures in the `screenshots/` directory
- **Console Output**: Cucumber pretty formatter provides detailed console output

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Cucumber Documentation](https://cucumber.io/docs/cucumber/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)