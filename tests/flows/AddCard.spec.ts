import { test } from '@playwright/test';
import { loginBeforeTest } from '../../utils/testSetup';

test('Add Card flow', async ({ browser }) => {
  const page = await browser.newPage();

  // ✅ LOGIN REUSE
  await loginBeforeTest(page);

  console.log('Login done');

  // 👉 FLOW ADD CARD
  await page.goto('https://visa-d2c.urbox.dev/sg_en/category/dining/beyond-the-menu');

  await page.getByRole('button', { name: 'ADD' }).click();
  await page.getByRole('link', { name: 'Add new card' }).click();

  await page.getByRole('textbox', { name: 'Card number' }).fill('4006 1010 0000 1005');
  await page.getByRole('textbox', { name: 'Expiry date (MM / YY)' }).fill('11/30');

  await page.getByRole('button', { name: 'Continue' }).click();

  await page.getByRole('button', { name: 'Try again' }).click();
});