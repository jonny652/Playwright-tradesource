import { test, expect } from '../fixture/test-options';
import { BasePage } from '../pages/base-page';
import { SignInPage } from '../pages/sign-in-page';

//01 navigate to the vertix manufacturer page
test.beforeEach('assert that we have navigated to the Vortix manufacturer page', async ({ manufacturerHomepage, basePage }) => {
  await manufacturerHomepage.gotoManufacturerHomepage();
  await basePage.handleOverlays();
});
//02 verify the h1 header is as expected
test('verify the h1 header is as expected', async ({manufacturerHomepage}) => {
  await expect(manufacturerHomepage.h1heading).toHaveText('Vortix');
});
//03 verify the h1 paragraph text is as expected
test('verify the h1 paragraph text is as expected', async ({manufacturerHomepage}) => {
  await expect(manufacturerHomepage.h1paragraph).toHaveText('Commercial cleaning equipment, built for daily use');
});
//04 verify the manufacturer website link works as expected
test('verify the manufacturer website link works as expected', async ({manufacturerHomepage}) => {
  await expect(manufacturerHomepage.manufacturerWebsiteLink).toBeVisible();
  await expect(manufacturerHomepage.manufacturerWebsiteLink).toHaveText('Website');
  await expect(manufacturerHomepage.manufacturerWebsiteLink).toHaveAttribute('href', 'https://www.vortix-commercial.example/overview');
});

//05 and 06 test signed-out behaviour, so they run without the saved sign-in session
test.describe('signed out', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  //05 verify that the Contact Manufacturer button is visible and contains the correct text and when clicked, it opens the login modal
  test('verify that the Contact Manufacturer button is visible and contains the correct text', async ({manufacturerHomepage}) => {
    await expect(manufacturerHomepage.contactManufacturerButton).toBeVisible();
    await expect(manufacturerHomepage.contactManufacturerButton).toHaveText('Contact manufacturer');
    await manufacturerHomepage.contactManufacturerButton.click();
    await expect(manufacturerHomepage.loginModal).toBeVisible();
  });

  //06 verify the sign in process works as expected and returns the user to the page they clicked sign in from
  test('verify that the signin process returns the user to the page they started from', async ({basePage, signInPage}) => {
    const startUrl = basePage.getCurrentUrl();
    await basePage.clickSignInButton();
    await signInPage.enterEmailAddress();
    await signInPage.clickNextButton();
    await signInPage.enterPassword();
    await signInPage.signInPasswordButton();
    await expect(basePage.page).toHaveURL(startUrl);
  });
});

//07 verify the user is signed in using the saved session from the setup step
test('verify the user is signed in', async ({basePage}) => {
  await expect(basePage.userMenuButton).toBeVisible();
});