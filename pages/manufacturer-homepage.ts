import { Locator, Page} from '@playwright/test';
import { BasePage } from './base-page';

export class ManufacturerHomepage extends BasePage {

//LOCATORS..............................................
  readonly nbsLogo: Locator;

  constructor(page: Page) {
    super(page);

    this.nbsLogo = page.getByRole('link', { name: 'NBS' });
  }

//ACTIONS...............................................
  //Return nbs logo locator
  async getNbsLogo() {
    return this.nbsLogo;
  }


}