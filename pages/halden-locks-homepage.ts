import { Page } from '@playwright/test';
import { BasePage } from './base-page';

export class HaldenLocksHomepage extends BasePage {

//LOCATORS..............................................
  readonly url = '/en/gb/manufacturer/halden-locks-uk/hldtIYD2mz1WnVtvyGn/overview';

  constructor(page: Page) {
    super(page);
  }

//ACTIONS...............................................
  async gotoHaldenLocksHomepage() {
    await this.page.goto(this.url);
  }

}
