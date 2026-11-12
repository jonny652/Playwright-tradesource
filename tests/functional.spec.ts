// Functional checks for manufacturer pages: content (name/tagline/website link, run once per
// manufacturer in test-data/manufacturers.json) plus sign-in/header behaviour (generic, run once).
import { test, expect } from '../fixture/test-options';
import manufacturers from '../test-data/manufacturers.json';
import { ManufacturerHomepage } from '../pages/manufacturer-homepage';

//Repeat the content checks below for every manufacturer listed in manufacturers.json
for (const manufacturer of manufacturers) {
  test.describe(`${manufacturer.name} manufacturer page content`, () => {
    let manufacturerHomepage: ManufacturerHomepage;

    test.beforeEach(
      `assert that we have navigated to the ${manufacturer.name} manufacturer page`,
      async ({ page, basePage }) => {
        manufacturerHomepage = new ManufacturerHomepage(page, manufacturer);
        await manufacturerHomepage.gotoManufacturerHomepage();
        await basePage.handleOverlays();
      },
    );

    //Check the page's main heading shows the manufacturer's name
    test('verify the h1 header is as expected', async () => {
      await expect(manufacturerHomepage.h1heading).toHaveText(manufacturer.name);
    });

    //Check the tagline under the heading matches the expected text — only for manufacturers whose data includes one
    if (manufacturer.tagline) {
      test('verify the h1 paragraph text is as expected', async () => {
        await expect(manufacturerHomepage.h1paragraph).toHaveText(manufacturer.tagline);
      });
    }

    //Check the "Website" link is visible and points at the manufacturer's own site — only for manufacturers whose data includes a website href
    if (manufacturer.websiteHref) {
      test('verify the manufacturer website link works as expected', async () => {
        await expect(manufacturerHomepage.manufacturerWebsiteLink).toBeVisible();
        await expect(manufacturerHomepage.manufacturerWebsiteLink).toHaveText('Website');
        await expect(manufacturerHomepage.manufacturerWebsiteLink).toHaveAttribute('href', manufacturer.websiteHref);
      });
    }

    //verify that the manufacturer telephone number is visible and contains the correct text — only for manufacturers whose data includes a phone number
    if (manufacturer.manufacturerPhone) {
      test('verify that the manufacturer telephone number is visible and contains the correct text', async () => {
        await expect(manufacturerHomepage.manufacturerTelephoneNumber).toBeVisible();
        await expect(manufacturerHomepage.manufacturerTelephoneNumber).toHaveText(manufacturer.manufacturerPhone);
      });
    }

    //verify each social media icon is visible and has the correct href link — each registered only for manufacturers whose data includes that href
    if (manufacturer.facebookHref) {
      test('verify the Facebook icon is visible and contains the correct href link', async () => {
        await expect(manufacturerHomepage.facebookIcon).toBeVisible();
        await expect(manufacturerHomepage.facebookIcon).toHaveAttribute('href', manufacturer.facebookHref);
      });
    }

    if (manufacturer.LinkedInHref) {
      test('verify the LinkedIn icon is visible and contains the correct href link', async () => {
        await expect(manufacturerHomepage.LinkedInIcon).toBeVisible();
        await expect(manufacturerHomepage.LinkedInIcon).toHaveAttribute('href', manufacturer.LinkedInHref);
      });
    }

    if (manufacturer.YoutubeHref) {
      test('verify the YouTube icon is visible and contains the correct href link', async () => {
        await expect(manufacturerHomepage.YoutubeIcon).toBeVisible();
        await expect(manufacturerHomepage.YoutubeIcon).toHaveAttribute('href', manufacturer.YoutubeHref);
      });
    }

    if (manufacturer.instagramHref) {
      test('verify the Instagram icon is visible and contains the correct href link', async () => {
        await expect(manufacturerHomepage.InstagramIcon).toBeVisible();
        await expect(manufacturerHomepage.InstagramIcon).toHaveAttribute('href', manufacturer.instagramHref);
      });
    }

    //verify the manufacturer overview tab are visible and contains the correct text and has the correct href — only for manufacturers whose data includes an overview tab href
    if (manufacturer.overviewTabHref) {
      test('verify the manufacturer overview tab is visible and contains the correct text and href', async () => {
        await expect(manufacturerHomepage.overviewTab).toBeVisible();
        await expect(manufacturerHomepage.overviewTab).toHaveText('Overview');
        await expect(manufacturerHomepage.overviewTab).toHaveAttribute('href', manufacturer.overviewTabHref);
      });
    }

    //verify the manufacturer products tab are visible and contains the correct text and has the correct href — only for manufacturers whose data includes an overview tab href
    if (manufacturer.productsTabHref) {
      test('verify the manufacturer products tab is visible and contains the correct text and href', async () => {
        await expect(manufacturerHomepage.productsTab).toBeVisible();
        await expect(manufacturerHomepage.productsTab).toHaveText('Products');
        await expect(manufacturerHomepage.productsTab).toHaveAttribute('href', manufacturer.productsTabHref);
      });
    }
        //verify the manufacturer CPD tab is visible and contains the correct text and has the correct href — only for manufacturers whose data includes an overview tab href
    if (manufacturer.cpdTabHref) {
      test('verify the manufacturer CPD tab is visible and contains the correct text and href', async () => {
        await expect(manufacturerHomepage.cpdTab).toBeVisible();
        await expect(manufacturerHomepage.cpdTab).toHaveText('CPD');
        await expect(manufacturerHomepage.cpdTab).toHaveAttribute('href', manufacturer.cpdTabHref);
      });
    }

        //verify the manufacturer certifications tab is visible and contains the correct text and has the correct href — only for manufacturers whose data includes an overview tab href
    if (manufacturer.certificationsTabHref) {
      test('verify the manufacturer certifications tab is visible and contains the correct text and href', async () => {
        await expect(manufacturerHomepage.certificationsTab).toBeVisible();
        await expect(manufacturerHomepage.certificationsTab).toHaveText('Certifications');
        await expect(manufacturerHomepage.certificationsTab).toHaveAttribute('href', manufacturer.certificationsTabHref);
      });
    }

            //verify the manufacturer literature tab is visible and contains the correct text and has the correct href — only for manufacturers whose data includes an overview tab href
    if (manufacturer.literatureTabHref) {
      test('verify the manufacturer literature tab is visible and contains the correct text and href', async () => {
        await expect(manufacturerHomepage.literatureTab).toBeVisible();
        await expect(manufacturerHomepage.literatureTab).toHaveText('Literature');
        await expect(manufacturerHomepage.literatureTab).toHaveAttribute('href', manufacturer.literatureTabHref);
      });
    }

            //verify the manufacturer case studies tab is visible and contains the correct text and has the correct href — only for manufacturers whose data includes an overview tab href
    if (manufacturer.caseStudiesTabHref) {
      test('verify the manufacturer case studies tab is visible and contains the correct text and href', async () => {
        await expect(manufacturerHomepage.caseStudiesTab).toBeVisible();
        await expect(manufacturerHomepage.caseStudiesTab).toHaveText('Case studies');
        await expect(manufacturerHomepage.caseStudiesTab).toHaveAttribute('href', manufacturer.caseStudiesTabHref);
      });
    }

            //verify the manufacturer about us tab is visible and contains the correct text and has the correct href — only for manufacturers whose data includes an overview tab href
    if (manufacturer.aboutUsTabHref) {
      test('verify the manufacturer about us tab is visible and contains the correct text and href', async () => {
        await expect(manufacturerHomepage.aboutUsTab).toBeVisible();
        await expect(manufacturerHomepage.aboutUsTab).toHaveText('About us');
        await expect(manufacturerHomepage.aboutUsTab).toHaveAttribute('href', manufacturer.aboutUsTabHref);
      });
    }

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
    test('verify that the Contact Manufacturer button is visible and contains the correct text', async ({
      manufacturerHomepage,
    }) => {
      await expect(manufacturerHomepage.contactManufacturerButton).toBeVisible();
      await expect(manufacturerHomepage.contactManufacturerButton).toHaveText('Contact manufacturer');
      await manufacturerHomepage.contactManufacturerButton.click();
      await expect(manufacturerHomepage.loginModal).toBeVisible();
    });

    //verify the sign in process works as expected and returns the user to the page they clicked sign in from
    test('verify that the signin process returns the user to the page they started from', async ({
      basePage,
      signInPage,
    }) => {
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
  test('verify the user is signed in', async ({ basePage }) => {
    await expect(basePage.userMenuButton).toBeVisible();
  });
});
