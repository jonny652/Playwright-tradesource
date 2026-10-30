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

async navigateTo() {
  await this.page.goto('/');
  }
async clickSearchTextbox() {
  await this.textboxSearch.click();
  }
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
  //Return the URL of the page currently loaded
  getCurrentUrl() {
    return this.page.url();
  }
  //Scroll to the bottom of the page, to trigger any below-the-fold lazy-loaded content
  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }
  //Wait for every <img> currently on the page to finish loading, so screenshots don't catch images mid-load
  async waitForAllImagesLoaded() {
    await this.page.waitForFunction(() =>
      Array.from(document.images).every((img) => img.complete && img.naturalWidth > 0)
    );
  }
  //The site's CSS falls back through Segoe UI/Arial, which resolve to different installed fonts on
  //Windows vs the Linux CI runner and shift text wrapping/layout. Force one web font so screenshots
  //render identically on both. Call right after navigating, before scrolling/waiting for images.
  async forceConsistentFontForScreenshots() {
    await this.page.addStyleTag({ url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap' });
    await this.page.addStyleTag({ content: `* { font-family: 'Roboto', sans-serif !important; }` });
    await this.page.evaluate(() => document.fonts.ready);
  }

}

