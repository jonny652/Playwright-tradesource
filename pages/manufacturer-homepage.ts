// Page object for a manufacturer's overview page (e.g. Vortix, Halden Locks UK). Locators and
// text are built from the ManufacturerData passed in, so one class covers every manufacturer.
import { Locator, Page} from '@playwright/test';
import { BasePage } from './base-page';

export interface ManufacturerData {
  name: string;
  urlPath: string;
  tagline: string;
  websiteHref: string;
}

export class ManufacturerHomepage extends BasePage {

//LOCATORS..............................................
  readonly nbsLogo: Locator;
  readonly h1heading: Locator;
  readonly h1paragraph: Locator;
  readonly manufacturerWebsiteLink: Locator;
  readonly contactManufacturerButton: Locator;
  readonly loginModal: Locator;
  readonly url: string;
  readonly manufacturerTelephoneNumber: Locator

  constructor(page: Page, manufacturer: ManufacturerData) {
    super(page);

    this.url = manufacturer.urlPath;
    this.nbsLogo = page.getByRole('link', { name: 'NBS' });
    this.h1heading = page.getByRole('heading', { name: manufacturer.name });
    this.h1paragraph = page.getByTestId('manufacturer-tagline');
    this.manufacturerTelephoneNumber = page.getByTestId('manufacturer-phone');
    this.manufacturerWebsiteLink = page.getByRole('link', { name: 'Website' });
    this.contactManufacturerButton = page.getByRole('button', { name: 'Contact Manufacturer' });
    this.loginModal = page.getByRole('button', { name: 'Sign in to continue' });
  }

//ACTIONS...............................................
  //Return nbs logo locator
  async getNbsLogo() {
    return this.nbsLogo;
  }

  //Return h1 heading locator
  async getH1Heading() {
    return this.h1heading;
  }
  //Return h1 paragraph locator
  async getH1Paragraph() {
    return this.h1paragraph;
  }

  //Return manufacturer website link locator
  async getManufacturerWebsiteLink() {
    return this.manufacturerWebsiteLink;
  }

  //Return contact manufacturer button locator
  async getContactManufacturerButton() {
    return this.contactManufacturerButton;
  }

  //Return login modal locator
  async getLoginModal() {
    return this.loginModal;
  }
  //Verify that the manufacturer website link works as expected
  async verifyManufacturerWebsiteLink() {
    return this.manufacturerWebsiteLink;
  }


  //Navigate directly to this manufacturer's overview page
  async gotoManufacturerHomepage() {
    await this.page.goto(this.url);
  }
  
  //Returns the manufacturer telephone number locator
  async verifyManufacturerTelephoneNumber() {
    return this.manufacturerTelephoneNumber;
  }


}