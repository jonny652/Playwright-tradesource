import fs from 'fs';
import { Page, PageAssertionsToHaveScreenshotOptions, TestInfo, expect } from '@playwright/test';

//Compare a full-page screenshot against its committed baseline, with a clear error if the baseline is missing.
//Baselines are generated via the "update_visual_baselines" GitHub Actions run (Linux), never locally, so local
//Windows runs and CI always compare against the same file - see snapshotPathTemplate in playwright.config.ts.
export async function expectScreenshot(page: Page, testInfo: TestInfo, name: string, options?: PageAssertionsToHaveScreenshotOptions) {
  const snapshotPath = testInfo.snapshotPath(`${name}.png`);

  //An explicit --update-snapshots run (the CI "generate baselines" job) should write the file as normal.
  //Everything else (a plain local/CI run) should fail loudly instead of silently creating a local baseline.
  const isExplicitUpdate = ['all', 'changed', 'missing'].includes(testInfo.config.updateSnapshots);

  if (!isExplicitUpdate && !fs.existsSync(snapshotPath)) {
    throw new Error(
      `Visual regression baseline is missing for "${name}" (project "${testInfo.project.name}") at:\n  ${snapshotPath}\n\n` +
      `Baselines are generated from the GitHub Actions "Playwright Tests" workflow, not locally:\n` +
      `  1. Run that workflow manually from the Actions tab with "update_visual_baselines" ticked.\n` +
      `  2. Download the "visual-baselines" artifact from the run.\n` +
      `  3. Copy "${testInfo.project.name}/${name}.png" into tests/__screenshots__/${testInfo.project.name}/ and commit it.`
    );
  }

  await expect(page).toHaveScreenshot(`${name}.png`, options);
}
