import { test as base } from '@playwright/test';
import { TradesourceHomepage } from '../pages/tradesource-homepage';
import { ManufacturerHomepage } from '../pages/manufacturer-homepage';
import { SearchResultsPage } from '../pages/searchresults-page';

type MyFixtures = {
  tradesourceHomepage: TradesourceHomepage;
  manufacturerHomepage: ManufacturerHomepage;
  searchResultsPage: SearchResultsPage;
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

});

export { expect } from "@playwright/test";