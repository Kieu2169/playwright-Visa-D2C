import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../pages/SignUpPage';

test.setTimeout(30000);

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