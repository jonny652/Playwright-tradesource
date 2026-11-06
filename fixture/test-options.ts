// Shared test fixture: extends playwright-bdd's `test` (a superset of @playwright/test's `test`,
// required so BDD step files can also use these fixtures) with one ready-made page object per
// fixture name, so specs/steps can request e.g. `basePage` or `manufacturerHomepage` directly
// instead of constructing page objects themselves.
import { test as base } from 'playwright-bdd';
import manufacturers from '../test-data/manufacturers.json';
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

    //Home page object
    tradesourceHomepage: async ({ page }, use) => {
        await use(new TradesourceHomepage(page));
    },

    //Manufacturer page object, defaulted to the first manufacturer in test-data/manufacturers.json
    manufacturerHomepage: async ({ page }, use) => {
        await use(new ManufacturerHomepage(page, manufacturers[0]));
    },

    //Search results page object
    searchResultsPage: async ({ page }, use) => {
        await use(new SearchResultsPage(page));
    },

    //Base page object, for actions/locators shared across pages (overlays, sign-in button, etc.)
    basePage: async ({ page }, use) => {
        await use(new BasePage(page));

    },

    //Sign-in page object
    signInPage: async ({ page }, use) => {
        await use(new SignInPage(page));
    },

    //Certificates tab page object
    certificatesPage: async ({ page }, use) => {
        await use(new CertificatesPage(page));
    },

});

export { expect } from "@playwright/test";