import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

/**
 * Read environment variables from file.
 * Only loaded when present: .env is gitignored, so on CI the values come from GitHub secrets instead.
 */
import fs from 'fs';
import path from 'path';
const envFile = path.resolve(__dirname, '.env');
if (fs.existsSync(envFile)) process.loadEnvFile(envFile);

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const isCI = !!(globalThis as {
  process?: {
    env?: {
      CI?: string | undefined;
    };
  };
}).process?.env?.CI;

/* Gherkin feature files + step definitions live under features/; generated Playwright specs go to .features-gen/ */
const bddTestDir = defineBddConfig({
  features: 'features/*.feature',
  steps: 'features/steps/*.ts',
});

export default defineConfig({
  /* Keep a separate screenshot baseline per OS and per browser project, since fonts and rendering differ across them */
  snapshotPathTemplate: '{testDir}/visual-baselines/{platform}/{projectName}/{arg}-baseline{ext}',
  /* Auto-generate a baseline the first time a snapshot is missing, locally and on CI */
  updateSnapshots: 'missing',
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      maxDiffPixelRatio: 0.001,
    },
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: isCI,
  /* Retry on CI only */
  retries: isCI ? 2 : 0,
  /* Opt out of parallel tests to avoid overloading the local dev server. */
  workers: 2,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: 'http://localhost:4321',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    /* Sign in once (or re-use a still-valid saved session) before the browser projects run. */
    {
      name: 'setup',
      // Non-BDD projects set testDir explicitly so they don't pick up the generated BDD specs.
      testDir: './tests',
      testMatch: /.*\.setup\.ts/,
    },

    {
      name: 'chromium',
      testDir: './tests',
      use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
    },

    {
      name: 'firefox',
      testDir: './tests',
      use: { ...devices['Desktop Firefox'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
    },

    {
      name: 'webkit',
      testDir: './tests',
      use: { ...devices['Desktop Safari'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
    },

    /* BDD (Gherkin feature file) scenarios. Chromium only for now; copy this pattern for firefox/webkit once ready. */
    {
      name: 'bdd-chromium',
      testDir: bddTestDir,
      use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Start the tradesource-site app under test before running the tests. */
  webServer: {
    command: 'npm run start',
    cwd: './tradesource-site',
    url: 'http://localhost:4321',
    reuseExistingServer: !isCI,
  },
});
