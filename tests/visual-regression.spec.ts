import { test, expect, settle } from '../fixture/visual-options';

//Visual regression, run by the visual-desktop-1280x720 project only (the functional projects ignore this file).
//Signed out, overlays switched off by the fixture, every screenshot taken after settle().
//Name every screenshot with the array form ['page', 'name.png']: the baseline lands in
//tests/__screenshots__/<page>/<name>-visual-desktop-1280x720.png, and scripts/visual-orphans.mjs relies on this form.

//HOMEPAGE
test.describe('home', { tag: '@visual' }, () => {
  test.beforeEach(async ({ page, tradesourceHomepage }) => {
    await tradesourceHomepage.gotoHomepage();
    await expect(page.getByTestId('logo-home')).toBeVisible();
    await settle(page);
  });

  test('full page', async ({ page, tradesourceHomepage }) => {
    await expect(page).toHaveScreenshot(['home', 'full-page.png'], {
      fullPage: true,
      //The four lazy sections show random content on every load, so mask them.
      //The page height in the screenshot still proves they loaded to their final size.
      mask: [tradesourceHomepage.lazyRegions],
    });
  });

  test('header', async ({ page }) => {
    await expect(page.getByRole('banner')).toHaveScreenshot(['home', 'header.png']);
  });

  test('main navigation', async ({ page }) => {
    await expect(page.getByRole('navigation', { name: 'Main navigation links' })).toHaveScreenshot(['home', 'main-navigation.png']);
  });

  test('footer', async ({ page }) => {
    await expect(page.getByRole('contentinfo')).toHaveScreenshot(['home', 'footer.png']);
  });
});

//VORTIX MANUFACTURER PAGE
test.describe('manufacturer-vortix', { tag: '@visual' }, () => {
  test.beforeEach(async ({ page, manufacturerHomepage }) => {
    await manufacturerHomepage.gotoManufacturerHomepage();
    await expect(manufacturerHomepage.h1heading).toBeVisible();
    await settle(page);
  });

  test('full page', async ({ page }) => {
    await expect(page).toHaveScreenshot(['manufacturer-vortix', 'full-page.png'], { fullPage: true });
  });

  //Signed out, Contact manufacturer opens a sign-in prompt dialog
  test('contact sign-in prompt', async ({ page, manufacturerHomepage }) => {
    await manufacturerHomepage.contactManufacturerButton.click();
    const dialog = page.getByTestId('contact-dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveScreenshot(['manufacturer-vortix', 'contact-sign-in-prompt.png']);
  });
});
