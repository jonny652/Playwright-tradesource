import { Locator, Page} from '@playwright/test';
import { BasePage } from './base-page';

export class SignInPage extends BasePage {

//LOCATORS..............................................
readonly emailAddress: Locator
readonly nextButton: Locator
readonly password: Locator
readonly signIn: Locator


  constructor(page: Page) {
    super(page);
this.emailAddress = page.getByRole('textbox', { name: 'Email address' });
this.nextButton = page.getByRole('button', { name: 'Next' });
this.password = page.getByRole('textbox', { name: 'Password' });
this.signIn = page.getByRole('button', { name: 'Sign in' });

  }

//ACTIONS...............................................

  async enterEmailAddress() {
    await this.emailAddress.click();
    await this.emailAddress.fill(process.env.EMAIL!);
}
  async clickNextButton() {
    await this.nextButton.click();
    
}
  async enterPassword() {
    await this.password.click();
    await this.password.fill(process.env.PASSWORD!);
}
  async signInPasswordButton() {
    await this.signIn.click();
    
}

}
