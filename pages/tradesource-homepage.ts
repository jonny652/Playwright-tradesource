import { Locator, Page} from '@playwright/test';
import { BasePage } from './base-page';

export class TradesourceHomepage extends BasePage {

//LOCATORS..............................................
  readonly nbsLogo: Locator;
  //The 4 below-the-fold sections (brands, products, cpd, inspiration) that lazy-load via IntersectionObserver
  //and render randomly-shuffled content on every page load - mask these in screenshots, don't pixel-compare them
  readonly lazyRegions: Locator;

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

  //Wait for all 4 lazy regions to finish rendering their content (class "is-loaded")
  async waitForLazyRegionsLoaded() {
    await this.page.waitForFunction(() =>
      document.querySelectorAll('[data-lazy]').length > 0 &&
      document.querySelectorAll('[data-lazy]:not(.is-loaded)').length === 0
    );
  }

}
