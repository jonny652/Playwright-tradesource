import { Locator, Page } from '@playwright/test';

export class BasePage {

//LOCATORS..............................................

  readonly acceptCookiesButton: Locator;
  readonly closeDialogButton: Locator;
  readonly textboxSearch: Locator;


  constructor(page: Page) {
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

async navigateTo(page: Page) {
  await page.goto('/');
  }
async clickSearchTextbox() {
  await this.textboxSearch.click();
  }


}

