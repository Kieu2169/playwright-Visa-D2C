import { test } from '@playwright/test';
import { loginBeforeTest } from '../../utils/testSetup';

test('Filter offers flow', async ({ browser }) => {
  const page = await browser.newPage();

  // ✅ REUSE LOGIN
  await loginBeforeTest(page);

  console.log('Login done');

  // 👉 STEP 1: go home
  await page.goto('https://visa-d2c.urbox.dev/sg_en/home');

  // 👉 STEP 2: open Travel
  await page.getByRole('link', { name: 'Travel' }).first().click();

  // 👉 STEP 3: View more
  await page.getByText('View More').nth(1).click();

  // 👉 STEP 4: open filter
  await page.getByRole('button', { name: 'Filter (1)' }).click();

  // 👉 STEP 5: Location filter
  await page.getByRole('button', { name: 'Location' }).click();

  await page.locator('label', {has: page.getByText('Australia')}).click();
  await page.getByRole('button', { name: 'Show offers and benefits' }).click();

  // 👉 STEP 6: reopen filter (Filter 2)
  await page.getByRole('button', { name: 'Filter (2)' }).click();

  // 👉 Dining filter
  await page.getByRole('button', { name: 'Dining' }).nth(1).click();
  await page.locator('label:has-text("Dining Events")').click();

  // 👉 Lifestyle filter
  await page.getByRole('button', { name: 'Lifestyle' }).nth(1).click();
  await page.locator('label:has-text("Attractions & Activities")').click();

  // 👉 Apply filter
  await page.getByRole('button', { name: 'Show offers and benefits' }).click();
});