import { test, expect } from '../fixture/test-options';

//01 verify the Vortix manufacturer page matches the baseline screenshot
test('verify the Vortix manufacturer page matches the baseline screenshot', async ({ manufacturerHomepage }) => {
  await manufacturerHomepage.disableOverlays();
  await manufacturerHomepage.gotoManufacturerHomepage();
  await manufacturerHomepage.loadLazyImages();
  await expect(manufacturerHomepage.page).toHaveScreenshot('vortix-overview.png', { fullPage: true });
});

//02 verify the Halden Locks manufacturer page matches the baseline screenshot
test('verify the Halden Locks manufacturer page matches the baseline screenshot', async ({ haldenLocksHomepage }) => {
  await haldenLocksHomepage.disableOverlays();
  await haldenLocksHomepage.gotoHaldenLocksHomepage();
  await haldenLocksHomepage.loadLazyImages();
  await expect(haldenLocksHomepage.page).toHaveScreenshot('halden-locks-overview.png', { fullPage: true });
});
