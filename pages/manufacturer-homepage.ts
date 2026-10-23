import { Locator, Page} from '@playwright/test';
import { BasePage } from './base-page';

export class ManufacturerHomepage extends BasePage {

//LOCATORS..............................................
  readonly nbsLogo: Locator;
  readonly h1heading: Locator;
  readonly h1paragraph: Locator;
  readonly manufacturerWebsiteLink: Locator;
  readonly contactManufacturerButton: Locator;
  readonly loginModal: Locator;
  readonly url = '/en/gb/manufacturer/vortix/vtxA1B2C3D4E5F6G7H8/overview';

  constructor(page: Page) {
    super(page);

    this.nbsLogo = page.getByRole('link', { name: 'NBS' });
    this.h1heading = page.getByRole('heading', { name: 'Vortix' });
    this.h1paragraph = page.getByTestId('manufacturer-tagline');
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


  async gotoManufacturerHomepage() {
    await this.page.goto(this.url);
  }

}