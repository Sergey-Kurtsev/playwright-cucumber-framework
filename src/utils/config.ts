import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';
import { BrowserType } from './browser-factory';

// Load environment variables from .env file
const env = process.env.ENV || 'staging';
if (!process.env.ENV) {
  console.warn(
    "\x1b[33m\x1b[1m[WARNING]\x1b[0m The ENV environment variable is not set. Defaulting to '\x1b[33mstaging\x1b[0m'."
  );
}
const envFilePath = path.resolve(__dirname, `../../environments/${env}.env`);

// Debug logging
console.log(`\x1b[36m[INFO]\x1b[0m Loading environment: \x1b[1m${env}\x1b[0m`);
console.log(`\x1b[36m[INFO]\x1b[0m Environment file path: \x1b[1m${envFilePath}\x1b[0m`);

// Check if file exists
if (fs.existsSync(envFilePath)) {
  console.log(`\x1b[32m[SUCCESS]\x1b[0m Environment file found`);
  const result = dotenv.config({ path: envFilePath });
  if (result.error) {
    console.error(`\x1b[31m[ERROR]\x1b[0m Failed to load environment file: ${result.error.message}`);
  } else {
    console.log(`\x1b[32m[SUCCESS]\x1b[0m Environment variables loaded`);
  }
} else {
  throw new Error(`\x1b[31m Environment file not found at: ${envFilePath}\x1b[0m`);
}

export interface BrowserConfig {
  browser: BrowserType;
  headless: boolean;
  timeout: number;
  slowMo: number;
  screenshotOnFailure: boolean;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface AppConfig {
  baseUrl: string;
  credentials: Credentials;
  browserConfig: BrowserConfig;
}

class ConfigManager {
  private static instance: ConfigManager;
  private config: AppConfig;

  private constructor() {
    this.config = {
      baseUrl: process.env.BASE_URL!,
      credentials: {
        username: process.env.USERNAME!,
        password: process.env.PASSWORD!,
      } as Credentials,
      browserConfig: {
        browser: (process.env.BROWSER || 'chromium').toLowerCase() as BrowserType,
        headless: process.env.HEADLESS !== 'false',
        timeout: parseInt(process.env.TIMEOUT || '30000', 10),
        slowMo: parseInt(process.env.SLOW_MO || '0', 10),
        screenshotOnFailure: process.env.SCREENSHOT_ON_FAILURE !== 'false',
      },
    };
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  public getConfig(): AppConfig {
    return this.config;
  }

  public getBaseUrl(): string {
    return this.config.baseUrl;
  }

  public getCredentials(): Credentials {
    return this.config.credentials;
  }

  public getBrowserConfig(): BrowserConfig {
    return this.config.browserConfig;
  }
}

export const config = ConfigManager.getInstance().getConfig();
export default ConfigManager.getInstance();
