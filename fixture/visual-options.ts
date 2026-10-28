import { Page } from '@playwright/test';
import { test as base, expect } from './test-options';

/**
 * Fixtures and helpers for the visual regression spec (tests/visual-regression.spec.ts).
 * Everything here exists to make a screenshot the same on every run, on every machine.
 * It extends the normal `test`, so the page objects (tradesourceHomepage, manufacturerHomepage...) are still available.
 */
export const test = base.extend<{ overlaysOff: void; visualMeta: void }>({
  //Switch the site's cookie banner and "new feature" popup off before any page loads, so nothing can appear mid-screenshot.
  //This reuses BasePage.disableOverlays() (the site's own tradesource_overlays=off cookie), so the cookie is defined in one place only.
  //Automatic fixtures are set up before the test's beforeEach hooks, so the cookie is in place before the first navigation.
  overlaysOff: [async ({ basePage }, use) => {
    await basePage.disableOverlays();
    await use();
  }, { auto: true }],

  //Record the viewport and run time on every test, so they show up in the HTML report next to the diff images
  visualMeta: [async ({}, use, testInfo) => {
    const viewport = testInfo.project.use.viewport;
    testInfo.annotations.push({ type: 'viewport', description: viewport ? `${viewport.width}x${viewport.height}` : 'default' });
    testInfo.annotations.push({ type: 'run-at', description: new Date().toISOString() });
    await use();
  }, { auto: true }],
});

export { expect };

/**
 * Get the page into its final, fully loaded state. Call it after navigating and before every screenshot.
 *
 * The homepage sections (div[data-lazy]) are empty 220px placeholders until an IntersectionObserver sees them
 * within 150px of the viewport, then they are filled and given the class `is-loaded`. A full-page screenshot does
 * not scroll, so without this you would capture empty boxes (and the wrong page height).
 * No fixed sleeps: every wait is tied to a real signal.
 */
export async function settle(page: Page) {
  //1. Load each lazy region in page order, and wait for the site's own "loaded" flag
  const regions = page.locator('[data-lazy]');
  const count = await regions.count();
  for (let i = 0; i < count; i++) {
    await regions.nth(i).scrollIntoViewIfNeeded();
    await expect(regions.nth(i)).toHaveClass(/is-loaded/);
  }

  //2. Force any native lazy images to load (future proofing), then wait for every image and the fonts
  await page.evaluate(async () => {
    document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((img) => {
      img.loading = 'eager';
    });
    await Promise.all(
      [...document.images].map((img) =>
        img.complete ? null : new Promise((resolve) => { img.onload = img.onerror = resolve; }),
      ),
    );
    await document.fonts.ready;
  });

  //3. Fail loudly on a broken image, instead of baking a broken image into a baseline
  const broken = await page.evaluate(() => [...document.images].filter((img) => !img.naturalWidth).map((img) => img.src));
  expect(broken, 'images that failed to load').toEqual([]);

  //4. Back to the top, ready for the screenshot
  await page.evaluate(() => window.scrollTo(0, 0));
}

/**
 * OPTIONAL, stronger alternative to masking: make the site's Math.random predictable so the "random" homepage
 * sections show the same tiles every run and can be compared for real instead of masked.
 * Call it BEFORE page.goto. It only stays deterministic because settle() fills the regions in a fixed order,
 * and only while nothing else on the page calls Math.random in a varying order.
 */
export async function seedRandom(page: Page, seed = 42) {
  await page.addInitScript((initialSeed) => {
    let state = initialSeed;
    Math.random = () => (state = (state * 16807) % 2147483647) / 2147483647;
  }, seed);
}
