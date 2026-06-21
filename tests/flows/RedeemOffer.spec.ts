import { test } from '@playwright/test';
import { loginBeforeTest } from '../../utils/testSetup';

test('Redeem Offer flow', async ({ browser }) => {
  const page = await browser.newPage();

  // ✅ LOGIN REUSE (giống Add Card)
  await loginBeforeTest(page);

  console.log('Login done');

  // 👉 FLOW REDEEM OFFER
  await page.goto('https://visa-d2c.urbox.dev/sg_en/benefits/exclusive-stay-benefits-via-hotelscom/2013');

  // Click Sign in 
  const signInBtn = page.getByText('Sign in');
  if (await signInBtn.isVisible().catch(() => false)) {
    await signInBtn.click();
  }

  // Click Redeem now
  await page.getByRole('button', { name: 'Redeem now' }).click();
});