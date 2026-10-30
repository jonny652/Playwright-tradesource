import { test } from '../fixture/test-options';
import { expectScreenshot } from '../utility/visual-regression';

//01 and 02 run signed out, with no saved storage state, so localStorage (incl. region) is always fresh
test.describe('signed out', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  //01 verify that the homepage matches its visual baseline
  test('verify that the homepage matches its visual baseline', async ({ tradesourceHomepage, basePage }, testInfo) => {
    await basePage.disableOverlays();
    await tradesourceHomepage.navigateTo();
    await basePage.scrollToBottom();
    await tradesourceHomepage.waitForLazyRegionsLoaded();
    await basePage.waitForAllImagesLoaded();
    await expectScreenshot(tradesourceHomepage.page, testInfo, 'home', {
      fullPage: true,
      mask: [tradesourceHomepage.lazyRegions],
    });
  });

  //02 verify that the Vortix manufacturer page matches its visual baseline
  test('verify that the Vortix manufacturer page matches its visual baseline', async ({ manufacturerHomepage, basePage }, testInfo) => {
    await basePage.disableOverlays();
    await manufacturerHomepage.gotoManufacturerHomepage();
    await basePage.scrollToBottom();
    await basePage.waitForAllImagesLoaded();
    await expectScreenshot(manufacturerHomepage.page, testInfo, 'manufacturer-vortix', { fullPage: true });
  });
});
