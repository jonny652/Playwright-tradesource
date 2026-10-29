import { defineConfig, devices } from '@playwright/test';

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

/* Visual regression specs live in tests/visual-regression.spec.ts. The functional browser projects ignore them,
   and the visual project runs nothing else. */
const VISUAL_SPECS = /.*visual-regression\.spec\.ts/;

export default defineConfig({
  testDir: './tests',
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

  /* Visual regression baselines: one folder per page, the project (which carries the resolution)
     in the file name, and no {platform} token, so there is exactly one baseline per page and viewport.
     e.g. tests/__screenshots__/home/full-page-visual-desktop-1280x720.png */
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}-{projectName}{ext}',
  /* Compare only: a missing baseline fails instead of being silently created.
     Baselines are (re)generated on purpose with --update-snapshots=all (see the update workflow / docker service). */
  updateSnapshots: 'none',
  expect: {
    toHaveScreenshot: {
      animations: 'disabled',
      caret: 'hide',
      scale: 'css',
      /* Tightened from 0.01: that was loose enough to let a localized change (e.g. a small button,
         ~0.08% of the homepage full-page image) pass without tripping the ratio. 0.0005 sits below
         that so a change of that size now fails the full-page check too. */
      maxDiffPixelRatio: 0.0005,
    },
  },

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
      testMatch: /.*\.setup\.ts/,
    },

    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
      testIgnore: VISUAL_SPECS,
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
      testIgnore: VISUAL_SPECS,
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
      testIgnore: VISUAL_SPECS,
    },

    /* Visual regression: chromium only, fixed environment, signed out (no storageState, no setup dependency).
       The resolution is part of the project name because it ends up in every baseline file name.
       Add a 'visual-mobile-390x844' project later using the same pattern. */
    {
      name: 'visual-desktop-1280x720',
      testMatch: VISUAL_SPECS,
      retries: 0, // a retry would only hide a flaky screenshot
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 1,
        colorScheme: 'light',
        reducedMotion: 'reduce',
        locale: 'en-GB',
        timezoneId: 'GMT',
      },
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
