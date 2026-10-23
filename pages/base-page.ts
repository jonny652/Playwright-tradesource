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
  //Return the URL of the page currently loaded
  getCurrentUrl() {
    return this.page.url();
  }

}

