// Functional checks for manufacturer pages: content (name/tagline/website link, run once per
// manufacturer in test-data/manufacturers.json) plus sign-in/header behaviour (generic, run once).
import { test, expect } from '../fixture/test-options';
import manufacturers from '../test-data/manufacturers.json';
import { ManufacturerHomepage } from '../pages/manufacturer-homepage';

//Repeat the content checks below for every manufacturer listed in manufacturers.json
for (const manufacturer of manufacturers) {
  test.describe(`${manufacturer.name} manufacturer page content`, () => {
    let manufacturerHomepage: ManufacturerHomepage;

    test.beforeEach(`assert that we have navigated to the ${manufacturer.name} manufacturer page`, async ({ page, basePage }) => {
      manufacturerHomepage = new ManufacturerHomepage(page, manufacturer);
      await manufacturerHomepage.gotoManufacturerHomepage();
      await basePage.handleOverlays();
    });

    //Check the page's main heading shows the manufacturer's name
    test('verify the h1 header is as expected', async () => {
      await expect(manufacturerHomepage.h1heading).toHaveText(manufacturer.name);
    });

    //Check the tagline under the heading matches the expected text
    test('verify the h1 paragraph text is as expected', async () => {
      await expect(manufacturerHomepage.h1paragraph).toHaveText(manufacturer.tagline);
    });

    //Check the "Website" link is visible and points at the manufacturer's own site
    test('verify the manufacturer website link works as expected', async () => {
      await expect(manufacturerHomepage.manufacturerWebsiteLink).toBeVisible();
      await expect(manufacturerHomepage.manufacturerWebsiteLink).toHaveText('Website');
      await expect(manufacturerHomepage.manufacturerWebsiteLink).toHaveAttribute('href', manufacturer.websiteHref);
    });
  });
}

//sign-in/header behaviour is generic across manufacturer pages, so it's verified once rather than per manufacturer row
test.describe('sign-in behaviour (generic, verified against one manufacturer page)', () => {
  test.beforeEach(async ({ manufacturerHomepage, basePage }) => {
    await manufacturerHomepage.gotoManufacturerHomepage();
    await basePage.handleOverlays();
  });

  //test signed-out behaviour, so it runs without the saved sign-in session
  test.describe('signed out', () => {
    test.use({ storageState: { cookies: [], origins: [] } });

    //verify that the Contact Manufacturer button is visible and contains the correct text and when clicked, it opens the login modal
    test('verify that the Contact Manufacturer button is visible and contains the correct text', async ({manufacturerHomepage}) => {
      await expect(manufacturerHomepage.contactManufacturerButton).toBeVisible();
      await expect(manufacturerHomepage.contactManufacturerButton).toHaveText('Contact manufacturer');
      await manufacturerHomepage.contactManufacturerButton.click();
      await expect(manufacturerHomepage.loginModal).toBeVisible();
    });

    //verifry that the manufacturer telephone number is visible and contains the correct text and when clicked, it opens the login modal
    test('verify that the manufacturer telephone number is visible and contains the correct text', async ({manufacturerHomepage}) => {
      await expect(manufacturerHomepage.manufacturerTelephoneNumber).toBeVisible();
      await expect(manufacturerHomepage.verifyManufacturerTelephoneNumber).toHaveText(manufacturer.);
    });


    //verify the sign in process works as expected and returns the user to the page they clicked sign in from
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

  //verify the user is signed in using the saved session from the setup step
  test('verify the user is signed in', async ({basePage}) => {
    await expect(basePage.userMenuButton).toBeVisible();
  });
});
