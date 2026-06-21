import { test, expect } from '@playwright/test';
import { loginBeforeTest } from '../../utils/testSetup';

test('Search and Redeem flow', async ({ browser }) => {
  const page = await browser.newPage();

  // ✅ LOGIN REUSE (giống Redeem Offer / Add Card)
  await loginBeforeTest(page);

  console.log('Login done');

  // 👉 STEP 1: open page (adjust nếu cần landing page khác)
  await page.goto('https://visa-d2c.urbox.dev/sg_en');

  // 👉 STEP 2: click search icon (image icon)
  await page.getByRole('img').nth(1).click();

  // 👉 STEP 3: search input
  const searchBox = page.getByRole('textbox', { name: 'Search' });
  await searchBox.fill('A High Dining');

  // 👉 STEP 4: select suggestion
  await page.getByText('A High Dining', { exact: true }).click();

  // 👉 STEP 5: handle popup BEFORE click 

  await page.getByRole('button', { name: 'Redeem now' }).click();

});