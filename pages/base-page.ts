// Base page object: locators and actions shared by every page (cookie banner, overlays,
// sign-in button, user menu, navigation). Other page objects extend this class.
import { Locator, Page } from '@playwright/test';

export class BasePage {

//LOCATORS..............................................

  readonly acceptCookiesButton: Locator;
  readonly closeDialogButton: Locator;
  readonly newFeatureCloseButton: Locator;
  readonly textboxSearch: Locator;
  readonly page: Page;
  readonly signInButton: Locator;
  readonly userMenuButton: Locator;


  constructor(page: Page) {
    this.page = page;
    this.acceptCookiesButton = page.getByRole('button', { name: 'Accept all' });
    this.closeDialogButton = page.getByRole('button', { name: 'Close dialog' });
    this.newFeatureCloseButton = page.getByRole('dialog', { name: 'Discover TradeSource Insights' }).getByRole('button', { name: 'Close dialog' });
    this.textboxSearch = page.getByRole('textbox', { name: 'Search products or' });
    this.signInButton = page.getByRole('button' ,  { name: 'Sign in'});
    this.userMenuButton = page.getByTestId('user-menu-button');
  }

//ACTIONS...............................................
  //Return accept cookies button locator
  async clickAcceptCookiesButton() {
    await this.acceptCookiesButton.click();
  }

  //Return close dialog button locator
  async clickCloseDialogButton() {
    await this.closeDialogButton.click();
  }

  //Go to the site's home page
  async navigateTo() {
  await this.page.goto('/');
  }
  //Click the search textbox
  async clickSearchTextbox() {
  await this.textboxSearch.click();
  }
  //Click the "Sign in" button
  async clickSignInButton() {
await this.signInButton.click();
}
  //Auto-dismiss the cookie banner and new feature popup whenever they appear, as they load at random times.
  //The feature popup close button is scoped to its dialog, because other modals (e.g. Contact manufacturer) also have a "Close dialog" button
  async handleOverlays() {
    await this.page.addLocatorHandler(this.acceptCookiesButton, async () => {
      await this.acceptCookiesButton.click();
    });
    await this.page.addLocatorHandler(this.newFeatureCloseButton, async () => {
      await this.newFeatureCloseButton.click();
    });
  }
  //Stop the cookie banner and new feature popup from loading at all, for tests that are not about overlays. Call before navigating
  async disableOverlays() {
    await this.page.context().addCookies([{ name: 'tradesource_overlays', value: 'off', domain: 'localhost', path: '/' }]);
  }
  //Scroll the page one screen at a time to trigger any viewport-based image loading, then scroll back
  //to the top and wait until every <img> has finished loading. Call before taking a screenshot.
  async waitForLazyImages() {
    const viewportHeight = this.page.viewportSize()?.height ?? 720;

    // Force instant scrolling so smooth-scroll CSS doesn't leave us reading a mid-animation scrollY
    await this.page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; });

    let previousScrollY = -1;
    for (let i = 0; i < 50; i++) { // safety cap against an unexpected infinite-scroll page
      const { scrollY, scrollHeight, clientHeight } = await this.page.evaluate(() => ({
        scrollY: window.scrollY,
        scrollHeight: document.body.scrollHeight,
        clientHeight: window.innerHeight,
      }));

      if (scrollY + clientHeight >= scrollHeight) break; // reached the bottom
      if (scrollY === previousScrollY) break;            // no progress made, stop rather than loop forever
      previousScrollY = scrollY;

      await this.page.evaluate((h) => window.scrollBy(0, h), viewportHeight);
      await this.page.waitForTimeout(100); // give this screen's images a moment to start requesting
    }

    await this.page.evaluate(() => window.scrollTo(0, 0));

    // document.fonts.ready guards against a web-font swap shifting text after screenshot,
    // relevant given the tight maxDiffPixelRatio set in playwright.config.ts
    await this.page.evaluate(() => document.fonts.ready);

    // img.complete is true for broken/404 images too, so this can't hang on a bad image
    await this.page.waitForFunction(() =>
      Array.from(document.images).every((img) => img.complete)
    );
  }
  //Return the URL of the page currently loaded
  getCurrentUrl() {
    return this.page.url();
  }

}

