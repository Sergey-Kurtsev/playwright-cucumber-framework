import { chromium, firefox, webkit, Browser } from '@playwright/test';

export interface BrowserLaunchOptions {
  headless: boolean;
  slowMo: number;
}

export type BrowserType = 'chromium' | 'firefox' | 'webkit';

/**
 * Browser Factory
 * Creates browser instances based on browser type
 */
export class BrowserFactory {
  /**
   * Create and launch a browser based on type
   */
  static async createBrowser(
    browserType: BrowserType,
    options: BrowserLaunchOptions
  ): Promise<Browser> {
    const { headless, slowMo } = options;

    switch (browserType) {
      case 'chromium':
        return await chromium.launch({ headless, slowMo });
      case 'firefox':
        return await firefox.launch({ headless, slowMo });
      case 'webkit':
        return await webkit.launch({ headless, slowMo });
      default:
        throw new Error(
          `Unsupported browser type: ${browserType}. Supported types: chromium, firefox, webkit`
        );
    }
  }

  /**
   * Get browser display name
   */
  static getBrowserName(browserType: BrowserType): string {
    switch (browserType) {
      case 'chromium':
        return 'Chromium';
      case 'firefox':
        return 'Firefox';
      case 'webkit':
        return 'WebKit (Safari)';
      default:
        return browserType;
    }
  }

  /**
   * Validate browser type
   */
  static isValidBrowserType(browserType: string): browserType is BrowserType {
    return ['chromium', 'firefox', 'webkit'].includes(browserType.toLowerCase());
  }
}
