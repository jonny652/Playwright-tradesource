// Playwright "setup" project: runs once before the test projects to produce a signed-in storage
// state file, so individual specs can start already authenticated instead of logging in each time.
import fs from 'fs';
import { test as setup, expect } from '@playwright/test';
import { BasePage } from '../pages/base-page';
import { SignInPage } from '../pages/sign-in-page';

const authFile = 'playwright/.auth/user.json';

//Sign in once before the test run and save the session, re-using the saved session if it is still valid
setup('authenticate', async ({ browser }, testInfo) => {
  const baseURL = testInfo.project.use.baseURL;

  //Re-use the saved session if the file exists and still signs the user in
  if (fs.existsSync(authFile)) {
    const savedContext = await browser.newContext({ baseURL, storageState: authFile });
    const basePage = new BasePage(await savedContext.newPage());
    await basePage.navigateTo();
    const signedIn = await basePage.userMenuButton
      .waitFor({ state: 'visible', timeout: 5000 })
      .then(() => true, () => false);
    await savedContext.close();
    if (signedIn) {
      return;
    }
  }

  //No valid session saved, so sign in and save a new one
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();
  const basePage = new BasePage(page);
  const signInPage = new SignInPage(page);

  await basePage.navigateTo();
  await basePage.handleOverlays();
  await basePage.clickSignInButton();
  await signInPage.enterEmailAddress();
  await signInPage.clickNextButton();
  await signInPage.enterPassword();
  await signInPage.signInPasswordButton();
  await expect(basePage.userMenuButton).toBeVisible();

  await context.storageState({ path: authFile });
  await context.close();
});
