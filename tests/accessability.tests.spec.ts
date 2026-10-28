import { test, expect } from '../fixture/test-options';
import { BasePage } from '../pages/base-page';
import { SignInPage } from '../pages/sign-in-page';
import {generateAccessibilityReport} from '../utility/acessability';

//07 report any accessability failures 
test('verify that the accessability plug in produces a html report showing any failures', async ({page}) => {
  await generateAccessibilityReport(page, "vortix-accessibility-report.html");
});

