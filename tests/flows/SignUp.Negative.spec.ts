import { test, expect } from '@playwright/test';
import { GmailService } from '../../pages/GmailService';
import { RegisterPage } from '../../pages/SignUpPage';

test.setTimeout(30000);
test.describe.configure({ mode: 'serial' });

test('Signup - card country mismatch', async ({ browser }) => {
  const page = await browser.newPage();
  const register = new RegisterPage(page);

  const email = `vokieu060921@gmail.com`;

  await register.open();
  await register.register(email);

  const gmail = new GmailService();
  const otp = await gmail.getOtp(Date.now());

  await register.verifyOtp(otp);

  await register.createPassword('Kieu@12345678');
  await register.fillProfile();
  await register.acceptTerms();

  await page.getByRole('button', { name: 'Continue without' }).click();

  await page
    .getByRole('textbox', { name: 'Card number' })
    .fill('4036 8650 0000 0001');

  await page
    .getByRole('textbox', { name: 'Expiry date (MM / YY)' })
    .fill('12/34');

  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(
    page.getByText(/Card country mismatch/i)
  ).toBeVisible();
});


test('Signup - negative case (invalid OTP)', async ({ browser }) => {
  const page = await browser.newPage();
  const register = new RegisterPage(page);

  const email = `vokieu060921@gmail.com`;

  console.log('Open Visa');
  await register.open();

  console.log('Start register');
  await register.register(email);
  console.log('Enter invalid OTP');

  await register.submitInvalidOtp('000000');

  // OTP error message 
  await expect(
  page.getByText(/This code is incorrect\. Please try again\./i)
).toBeVisible();
});