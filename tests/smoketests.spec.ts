import { test, expect } from '@playwright/test';
import { TradesourceHomepage } from '../pages/tradesource-homepage';
import { ManufacturerHomepage } from '../pages/manufacturer-homepage';
import { SearchResultsPage } from '../pages/searchresults-page';
import { BasePage } from '../pages/base-page';

//01 navigate to the vertix manufacturer page
test('assert that we have navigated to the Vortix manufacturer page', async ({ page }) => {
  const basePage = new BasePage(page);
  const searchResultsPage = new SearchResultsPage(page);
  await basePage.navigateTo(page);
  await basePage.clickAcceptCookiesButton();
  await basePage.clickCloseDialogButton();
  await basePage.clickSearchTextbox();
  await basePage.textboxSearch.fill('vortix');
  await basePage.textboxSearch.press('Enter');
  await searchResultsPage.clickManufacturerTab();
  await searchResultsPage.getManufacturerName();
  await expect(page).toHaveURL('/en/gb/manufacturer/vortix/vtxA1B2C3D4E5F6G7H8/overview');
});
//02 verify the h1 header is as expected
test('verify the h1 header is as expected', async ({ page }) => {
 const manufacturerHomepage = new ManufacturerHomepage(page);
  await page.goto('/en/gb/manufacturer/vortix/vtxA1B2C3D4E5F6G7H8/overview');
  await expect(manufacturerHomepage.h1heading).toHaveText('Vortix');
});
//03 verify the h1 paragraph text is as expected
test('verify the h1 paragraph text is as expected', async ({ page }) => {
  const manufacturerHomepage = new ManufacturerHomepage(page);
  await page.goto('/en/gb/manufacturer/vortix/vtxA1B2C3D4E5F6G7H8/overview');
  await expect(manufacturerHomepage.h1paragraph).toHaveText('Commercial cleaning equipment, built for daily use');
});
//04 verify the manufacturer website link works as expected
test('verify the manufacturer website link works as expected', async ({ page }) => {
  const manufacturerHomepage = new ManufacturerHomepage(page);
  await page.goto('/en/gb/manufacturer/vortix/vtxA1B2C3D4E5F6G7H8/overview');
  await expect(manufacturerHomepage.manufacturerWebsiteLink).toHaveAttribute('href', 'https://www.vortix-commercial.example/overview');
});

//05 verify that the Contact Manufacturer button is visible and contains the correct text and when clicked, it opens the login modal
test('verify that the Contact Manufacturer button is visible and contains the correct text', async ({ page }) => {
  const manufacturerHomepage = new ManufacturerHomepage(page);
  await page.goto('/en/gb/manufacturer/vortix/vtxA1B2C3D4E5F6G7H8/overview');
  await expect(manufacturerHomepage.contactManufacturerButton).toBeVisible();
  await expect(manufacturerHomepage.contactManufacturerButton).toHaveText('Contact manufacturer');
  await manufacturerHomepage.contactManufacturerButton.click();
  await expect(page.getByRole('button', { name: 'Sign in to continue' })).toBeVisible();
});

