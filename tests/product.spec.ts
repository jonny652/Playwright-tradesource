// Functional checks for product detail pages: content (name/image/manufacturer link/description/
// spec rows/breadcrumbs, run once per product in test-data/product.json) plus one click-through
// journey from a manufacturer's Products tab (generic, run once).
import { test, expect } from '../fixture/test-options';
import products from '../test-data/product.json';
import { ProductPage } from '../pages/product-page';
import { ManufacturerHomepage } from '../pages/manufacturer-homepage';
import manufacturers from '../test-data/manufacturers.json';

for (const product of products) {
  test.describe(`${product.name} product page content`, () => {
    let productPage: ProductPage;

    test.beforeEach(async ({ page, basePage }) => {
      productPage = new ProductPage(page, product);
      await productPage.gotoProductPage();
      await basePage.handleOverlays();
    });

    test('verify the h1 heading shows the product name', async () => {
      await expect(productPage.h1Heading).toHaveText(product.name);
    });

    test('verify the product image is visible', async () => {
      await expect(productPage.productImage).toBeVisible();
      if (product.imageSrc) {
        await expect(productPage.productImage).toHaveAttribute('src', product.imageSrc);
      }
    });

    if (product.manufacturerName) {
      test('verify the manufacturer link shows the correct name and href', async () => {
        await expect(productPage.manufacturerLink).toHaveText(product.manufacturerName);
        if (product.manufacturerHref) {
          await expect(productPage.manufacturerLink).toHaveAttribute('href', product.manufacturerHref);
        }
      });
    }

    if (product.description) {
      test('verify the product description text', async () => {
        await expect(productPage.description).toHaveText(product.description);
      });
    }

    if (product.specs?.length) {
      test('verify the specification table rows', async () => {
        await expect(productPage.specRows).toHaveCount(product.specs.length);
        for (const [label, value] of product.specs) {
          await expect(productPage.getSpecRowByLabel(label).getByRole('cell')).toHaveText(value);
        }
      });
    }

    if (product.breadcrumbs?.length) {
      test('verify the breadcrumb trail', async () => {
        await expect(productPage.breadcrumbLinks).toHaveCount(product.breadcrumbs.length);
        for (let i = 0; i < product.breadcrumbs.length; i++) {
          const crumb = productPage.breadcrumbLinks.nth(i);
          await expect(crumb).toHaveText(product.breadcrumbs[i].text);
          await expect(crumb).toHaveAttribute('href', product.breadcrumbs[i].href);
        }
      });
    }
  });
}

//navigating into a product is generic across manufacturers, so it's verified once via a journey
//rather than per product
test.describe('navigating to a product from a manufacturer Products tab (generic journey)', () => {
  test('verify clicking a product tile opens that product\'s page', async ({ page, basePage }) => {
    const manufacturer = manufacturers[0];
    const manufacturerHomepage = new ManufacturerHomepage(page, manufacturer);
    await manufacturerHomepage.gotoManufacturerHomepage();
    await basePage.handleOverlays();

    await manufacturerHomepage.productsTab.click();
    //result-tile/resultTile is shared with manufacturer tiles elsewhere; disambiguate by class
    const firstProductTile = page.locator('a.tile--product').first();
    const expectedName = await firstProductTile.locator('.tile-name').innerText();
    await firstProductTile.click();

    await expect(page).toHaveURL(/\/en\/gb\/product\//);
    await expect(page.getByTestId('product-name')).toHaveText(expectedName);
  });
});
