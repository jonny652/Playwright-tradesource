// Visual regression: screenshots each manufacturer overview page and compares it against the
// saved baseline images in tests/visual-baselines/, failing if the rendered layout has changed.
import { test, expect } from '../fixture/test-options';

const manufacturerPages = [
  { name: 'halden-locks-uk', path: '/en/gb/manufacturer/halden-locks-uk/hldtIYD2mz1WnVtvyGn/overview' },
  { name: 'vortix', path: '/en/gb/manufacturer/vortix/vtxA1B2C3D4E5F6G7H8/overview' },
];

//Take a full-page screenshot of each manufacturer's overview page and diff it against its baseline
for (const { name, path } of manufacturerPages) {
  test(`${name} manufacturer overview page matches visual baseline`, async ({ page, basePage }) => {
    // Overlays are switched off because this test is about layout, not the pop-ups
    // (same convention as certificates-api.spec.ts)
    await basePage.disableOverlays();
    await page.goto(path);
    await page.waitForLoadState('networkidle'); // let the async certification-bodies GraphQL fetch settle
    await basePage.waitForLazyImages();

    await expect(page).toHaveScreenshot(`${name}-overview.png`, { fullPage: true });
  });
}
