import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';
import config from '../utils/config';
import { BrowserFactory } from '../utils/browser-factory';

let browser: Browser;
let context: BrowserContext;
export let page: Page;

/**
 * Cucumber Hooks
 * Handles browser setup, teardown, and failure handling
 */

const browserConfig = config.getBrowserConfig();

// Set default timeout for all step definitions (default is 5000ms)
// Use the timeout from config, with a minimum of 30 seconds
const stepTimeout = Math.max(browserConfig.timeout, 30000);
setDefaultTimeout(stepTimeout);

BeforeAll(async function () {
  // Launch browser before all scenarios
  const browserType = browserConfig.browser;

  // Launch browser using factory
  try {
    browser = await BrowserFactory.createBrowser(browserType, {
      headless: browserConfig.headless,
      slowMo: browserConfig.slowMo,
    });
    console.log(`\x1b[32m[SUCCESS]\x1b[0m ${browserType} browser launched successfully`);
  } catch (error) {
    console.error(`\x1b[31m[ERROR]\x1b[0m Failed to launch ${browserType} browser: ${(error as Error).message}`);
    console.error(`\x1b[33m[INFO]\x1b[0m Make sure to run: \x1b[1mnpm run install:browsers\x1b[0m`);
    throw error;
  }
});

Before(async function () {
  // Create a new context and page for each scenario
  context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });
  page = context.pages()[0] || await context.newPage();
  
  // Set default timeout
  page.setDefaultTimeout(browserConfig.timeout);  
});

After(async function (scenario) {
  // Take screenshot on failure
  if (scenario.result?.status === Status.FAILED) {
    if (browserConfig.screenshotOnFailure && page) {
      const screenshot = await page.screenshot({
        path: `screenshots/${scenario.pickle.name}-${Date.now()}.png`,
        fullPage: true,
      });
      this.attach(screenshot, 'image/png');
    }
  }

  // Close context after each scenario
  if (context) {
    await context.close();
  }
});

AfterAll(async function () {
  // Close browser after all scenarios
  if (browser) {
    await browser.close();
  }
});
