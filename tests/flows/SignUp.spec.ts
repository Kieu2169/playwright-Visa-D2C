import { test } from '@playwright/test';
import { GmailService } from '../../pages/GmailService';
import { RegisterPage } from '../../pages/SignUpPage';

test.setTimeout(50000);
test('Create Visa Account', async ({ browser }) => {
  const visaPage = await browser.newPage();


  const gmail = new GmailService();
  const register = new RegisterPage(visaPage);


  console.log('Get email');
  const email = 'vokieu060921@gmail.com';

  console.log('Open Visa');
  await register.open();

  console.log('Register email');
  await register.register(email);

  const startTime = Date.now();

  console.log('Get OTP');
  const otp = await gmail.getOtp(startTime);


  console.log('Verify OTP');
  await register.verifyOtp(otp);

  await register.createPassword('Kieu@12345678');

  await register.fillProfile();

  await register.acceptTerms();

  await register.addCard();
});