import { Locator, Page} from '@playwright/test';
import { BasePage } from './base-page';

export class SearchResultsPage extends BasePage {

//LOCATORS..............................................
  readonly nbsLogo: Locator;
  readonly manufacturerTab: Locator;
  readonly manufacturerName: Locator;

  constructor(page: Page) {
    super(page);

    this.nbsLogo = page.getByRole('link', { name: 'NBS' });
    this.manufacturerTab = page.getByRole('tab', { name: 'Manufacturer' });
    this.manufacturerName = page.getByRole('heading', { name: 'Manufacturer' });
  }

//ACTIONS...............................................
  //Return nbs logo locator
  async getNbsLogo() {
    return this.nbsLogo;
  }

  async clickManufacturerTab() {
    await this.manufacturerTab.click();
  }
    async getManufacturerName() {   
    await this.manufacturerName.click();
}

}