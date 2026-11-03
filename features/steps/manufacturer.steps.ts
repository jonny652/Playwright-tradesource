import { expect } from '@playwright/test';
import { Given, Then } from './bdd';
import manufacturers from '../../test-data/manufacturers.json';
import { ManufacturerHomepage } from '../../pages/manufacturer-homepage';

let manufacturerHomepage: ManufacturerHomepage;

Given('I am on the {string} manufacturer page', async ({ page, basePage }, manufacturerName: string) => {
  const manufacturer = manufacturers.find((m) => m.name === manufacturerName)!;
  manufacturerHomepage = new ManufacturerHomepage(page, manufacturer);
  await manufacturerHomepage.gotoManufacturerHomepage();
  await basePage.handleOverlays();
});

Then('the page heading should be {string}', async ({}, expectedHeading: string) => {
  await expect(manufacturerHomepage.h1heading).toHaveText(expectedHeading);
});
