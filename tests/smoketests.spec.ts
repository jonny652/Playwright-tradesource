import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');
});
//01 navigate to the vertix manufacturer
test('test', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Accept all' }).click();
  await page.getByRole('button', { name: 'Close dialog' }).click();
  await page.getByRole('textbox', { name: 'Search products or' }).click();
  await page.getByRole('textbox', { name: 'Search products or' }).fill('vortix');
  await page.getByRole('textbox', { name: 'Search products or' }).press('Enter');
  await page.getByTestId('tab-manufacturers').click();
  await page.getByTestId('result-tile').click();
  await expect(page).toHaveURL('/en/gb/manufacturer/vortix/vtxA1B2C3D4E5F6G7H8/overview');
});