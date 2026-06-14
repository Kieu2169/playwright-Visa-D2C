import { RegisterPage } from '../../pages/SignUpPage';
import { GmailService } from '../../pages/GmailService';

export async function signupFlow(page, email, password) {
  const register = new RegisterPage(page);
  const gmail = new GmailService();

  await register.open();
  await register.register(email);

  const otp = await gmail.getOtp(Date.now());
  await register.verifyOtp(otp);
  await register.createPassword(password);

  await register.fillProfile();

  await register.acceptTerms();

  await register.addCard();
  await page.waitForTimeout(2000);
}