// Page object for the sign-in flow (email -> next -> password -> sign in). Credentials are
// read from the EMAIL/PASSWORD environment variables rather than hard-coded.
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

  //Click the email field and fill it with the EMAIL env var
  async enterEmailAddress() {
    await this.emailAddress.click();
    await this.emailAddress.fill(process.env.EMAIL!);
}
  //Click "Next" to move from the email step to the password step
  async clickNextButton() {
    await this.nextButton.click();

}
  //Click the password field and fill it with the PASSWORD env var
  async enterPassword() {
    await this.password.click();
    await this.password.fill(process.env.PASSWORD!);
}
  //Click "Sign in" to submit the password and complete sign-in
  async signInPasswordButton() {
    await this.signIn.click();

}

}
