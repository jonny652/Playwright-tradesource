import { test as base } from '@playwright/test';
import { TradesourceHomepage } from '../pages/tradesource-homepage';
import { ManufacturerHomepage } from '../pages/manufacturer-homepage';
import { SearchResultsPage } from '../pages/searchresults-page';
import { BasePage } from '../pages/base-page';
import { SignInPage } from '../pages/sign-in-page';
import { CertificatesPage } from '../pages/certificates-page';

type MyFixtures = {
  tradesourceHomepage: TradesourceHomepage;
  manufacturerHomepage: ManufacturerHomepage;
  searchResultsPage: SearchResultsPage;
  basePage: BasePage
  signInPage: SignInPage
  certificatesPage: CertificatesPage

};

export const test = base.extend<MyFixtures>({


    tradesourceHomepage: async ({ page }, use) => {
        await use(new TradesourceHomepage(page));
    },

    manufacturerHomepage: async ({ page }, use) => {
        await use(new ManufacturerHomepage(page));
    },

    searchResultsPage: async ({ page }, use) => {
        await use(new SearchResultsPage(page));
    },

    basePage: async ({ page }, use) => {
        await use(new BasePage(page));
    
    },

    signInPage: async ({ page }, use) => {
        await use(new SignInPage(page));
    },

    certificatesPage: async ({ page }, use) => {
        await use(new CertificatesPage(page));
    },

});

export { expect } from "@playwright/test";