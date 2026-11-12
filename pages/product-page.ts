// Page object for a product detail page (e.g. Vortix Airbar V Hand Dryer). Locators and
// expected text are built from the ProductData passed in, so one class covers every product.
import { Locator, Page } from '@playwright/test';
import { BasePage } from './base-page';

export interface BreadcrumbData {
  text: string;
  href: string;
}

export interface ProductData {
  name: string;
  urlPath: string;
  manufacturerName: string;
  manufacturerHref?: string;
  description?: string;
  imageSrc?: string;
  specs?: [string, string][];
  breadcrumbs?: BreadcrumbData[];
}

export class ProductPage extends BasePage {

//LOCATORS..............................................
  readonly url: string;
  readonly h1Heading: Locator;
  readonly productImage: Locator;
  readonly manufacturerLink: Locator;
  readonly description: Locator;
  readonly specTable: Locator;
  readonly specRows: Locator;
  readonly breadcrumbNav: Locator;
  readonly breadcrumbLinks: Locator;

  constructor(page: Page, product: ProductData) {
    super(page);

    this.url = product.urlPath;
    this.h1Heading = page.getByTestId('product-name');
    this.productImage = page.getByRole('img', { name: product.name });
    this.manufacturerLink = page.locator('[data-cy="productManufacturerLink"]');
    this.description = page.locator('p.product-description');
    this.specTable = page.locator('[data-cy="specTable"]');
    this.specRows = this.specTable.getByRole('row');
    this.breadcrumbNav = page.locator('app-breadcrumbs');
    this.breadcrumbLinks = this.breadcrumbNav.getByRole('link');
  }

//ACTIONS...............................................
  //Navigate directly to this product's detail page
  async gotoProductPage() {
    await this.page.goto(this.url);
  }

  //Return the spec table row whose label (th) matches, so its value (td) can be asserted.
  //The <th scope="row"> has implicit role "rowheader", the <td> value has role "cell" -
  //filtering on the rowheader keeps the label and value assertions independent of each other.
  getSpecRowByLabel(label: string) {
    return this.specRows.filter({ has: this.page.getByRole('rowheader', { name: label, exact: true }) });
  }
}
