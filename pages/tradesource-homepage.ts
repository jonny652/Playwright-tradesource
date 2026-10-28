import { Locator, Page} from '@playwright/test';
import { BasePage } from './base-page';

export class TradesourceHomepage extends BasePage {

//LOCATORS..............................................
  readonly nbsLogo: Locator;
  //The four homepage sections that fill in lazily (when scrolled near) with random content on every load
  readonly lazyRegions: Locator;
  readonly url = '/en/gb';

  constructor(page: Page) {
    super(page);

    this.nbsLogo = page.getByRole('link', { name: 'NBS' });
    this.lazyRegions = page.locator('[data-lazy]');
  }

//ACTIONS...............................................
  //Return nbs logo locator
  async getNbsLogo() {
    return this.nbsLogo;
  }

  async gotoHomepage() {
    await this.page.goto(this.url);
  }

}
