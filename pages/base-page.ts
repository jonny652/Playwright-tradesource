import { Locator, Page } from '@playwright/test';

export class BasePage {

//LOCATORS..............................................

  readonly acceptCookiesButton: Locator;
  readonly closeDialogButton: Locator;
  readonly textboxSearch: Locator;
  readonly page: Page;


  constructor(page: Page) {
    this.page = page;
    this.acceptCookiesButton = page.getByRole('button', { name: 'Accept all' });
    this.closeDialogButton = page.getByRole('button', { name: 'Close dialog' });
    this.textboxSearch = page.getByRole('textbox', { name: 'Search products or' });
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


}

