import fs from 'fs';
import { test as setup, expect } from '@playwright/test';
import { ManufacturerHomepage } from '../pages/manufacturer-homepage';
import { SignInPage } from '../pages/sign-in-page';

const authFile = 'playwright/.auth/user.json';

//Sign in once before the test run and save the session, re-using the saved session if it is still valid
setup('authenticate', async ({ browser }, testInfo) => {
  const baseURL = testInfo.project.use.baseURL;

  //Re-use the saved session if the file exists and still signs the user in
  if (fs.existsSync(authFile)) {
    const savedContext = await browser.newContext({ baseURL, storageState: authFile });
    const manufacturerHomepage = new ManufacturerHomepage(await savedContext.newPage());
    await manufacturerHomepage.gotoManufacturerHomepage();
    const signedIn = await manufacturerHomepage.userMenuButton
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
  const manufacturerHomepage = new ManufacturerHomepage(page);
  const signInPage = new SignInPage(page);

  await manufacturerHomepage.gotoManufacturerHomepage();
  await manufacturerHomepage.handleOverlays();
  await manufacturerHomepage.clickSignInButton();
  await signInPage.enterEmailAddress();
  await signInPage.clickNextButton();
  await signInPage.enterPassword();
  await signInPage.signInPasswordButton();
  await expect(manufacturerHomepage.userMenuButton).toBeVisible();

  await context.storageState({ path: authFile });
  await context.close();
});
