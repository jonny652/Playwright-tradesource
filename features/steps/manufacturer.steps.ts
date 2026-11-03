// Step definitions for features/manufacturer-page.feature.
// Each step's text must match the Gherkin line; {string} captures the quoted value and passes it in as an argument.
import { expect } from '@playwright/test';
import { Given, Then } from './bdd';
import manufacturers from '../../test-data/manufacturers.json';
import { ManufacturerHomepage } from '../../pages/manufacturer-homepage';

// Looks up the manufacturer by name in the JSON (for its URL etc.), opens its page,
// and saves the page object on ctx so later steps can use it.
Given('I am on the {string} manufacturer page', async ({ page, basePage, ctx }, manufacturerName: string) => {
  const manufacturer = manufacturers.find((m) => m.name === manufacturerName);
  if (!manufacturer) throw new Error(`No manufacturer named "${manufacturerName}" in test-data/manufacturers.json`);
  ctx.manufacturerHomepage = new ManufacturerHomepage(page, manufacturer);
  await ctx.manufacturerHomepage.gotoManufacturerHomepage();
  await basePage.handleOverlays();
});

// Checks the h1 on the page opened by the Given step above.
Then('the page heading should be {string}', async ({ ctx }, expectedHeading: string) => {
  if (!ctx.manufacturerHomepage) throw new Error('No manufacturer page open - run the "I am on the ... manufacturer page" step first');
  await expect(ctx.manufacturerHomepage.h1heading).toHaveText(expectedHeading);
});
