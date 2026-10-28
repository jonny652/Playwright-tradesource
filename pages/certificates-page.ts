import { Locator, Page, Route } from '@playwright/test';
import { BasePage } from './base-page';

export class CertificatesPage extends BasePage {

//LOCATORS..............................................
  readonly certificatesTab: Locator;
  readonly resultList: Locator;
  readonly loadingMessage: Locator;
  readonly resultWrapper: Locator;
  readonly certificateTitles: Locator;
  readonly noResultsMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.certificatesTab = page.getByTestId('nav-third-party-certifications');
    this.resultList = page.locator('[data-cy="resultList"]');
    this.loadingMessage = page.locator('[data-cy="loading"]');
    this.resultWrapper = page.locator('[data-cy="searchResultWrapper"]');
    this.certificateTitles = page.locator('[data-cy="searchResultTileTitle"]');
    this.noResultsMessage = page.locator('[data-cy="noResultsGuidance"]');
  }

//ACTIONS...............................................
  async clickCertificatesTab() {
    await this.certificatesTab.click();
  }

  //Intercept only the certificates tiles API request and pass it to the handler, all other API requests continue as normal
  async interceptCertificates(handler: (route: Route) => Promise<void>) {
    await this.page.route('**/api/graphql', async (route) => {
      const [operation] = route.request().postDataJSON() ?? [];
      const isCertificateTiles = operation?.operationName === 'certifications' && operation?.query?.includes('paginatedResponse');
      if (isCertificateTiles) {
        await handler(route);
      } else {
        await route.fallback();
      }
    });
  }

  //Wait until the certificates request has finished, so assertions don't run while the list is still loading
  async waitForCertificatesToLoad() {
    await this.resultList.waitFor({ state: 'visible' });
    await this.loadingMessage.waitFor({ state: 'detached' });
  }

}
