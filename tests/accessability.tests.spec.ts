// Accessibility check: runs an axe scan against the (default Vortix) manufacturer page and
// publishes any violations to an HTML report. Does not fail the test - see utility/acessability.ts.
import { test, expect } from '../fixture/test-options';
import { BasePage } from '../pages/base-page';
import { SignInPage } from '../pages/sign-in-page';
import {generateAccessibilityReport} from '../utility/acessability';

//07 Generate the axe accessibility HTML report for the current page; passes as long as the report is produced
test('verify that the accessability plug in produces a html report showing any failures', async ({page}) => {
  await generateAccessibilityReport(page, "vortix-accessibility-report.html");
});

