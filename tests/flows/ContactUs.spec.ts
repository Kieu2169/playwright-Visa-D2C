import { test, expect } from '@playwright/test';
import { loginBeforeTest } from '../../utils/testSetup';

test('Contact us flow', async ({ browser }) => {
  const page = await browser.newPage();

  // ✅ reuse login (Visa D2C user)
  await loginBeforeTest(page);

  console.log('Login done');

  // 👉 STEP 1: Open Contact Us
  await page.getByRole('link', { name: 'Contact us' }).click();

  // 👉 STEP 2: Select category
  await page.getByRole('button', { name: 'Select a category' }).click();
  await page.getByRole('button', { name: 'Account Related' }).click();

  // 👉 STEP 3: Specific issue
  await page.getByRole('button', { name: 'Specific issue' }).click();
  await page.getByRole('button', { name: 'Login issues' }).click();

  // 👉 STEP 4: Fill description
  await page
    .getByRole('textbox', { name: /Please describe your issue/i })
    .fill('test Visa');

  // 👉 STEP 5: Select Visa tier
  await page.getByRole('button', { name: 'Select a Visa card tier' }).click();
  await page.getByRole('button', { name: 'Visa Classic' }).click();

  // 👉 STEP 6: Submit form
  await page.getByRole('button', { name: 'Submit' }).click();

  // 👉 STEP 7: Continue
  await page.getByRole('button', { name: 'Continue' }).click();

  // ======================================================
  // 👉 ADMIN PORTAL FLOW (separate login - IMPORTANT)
  // ======================================================

  await page.goto(
    'https://visa-d2c-portal.urbox.dev/login?redirectUrl=%2Fticket-management'
  );

  await page.getByRole('textbox', { name: 'Username' }).fill(
    'visa-main-admin@urbox.vn'
  );

  await page.getByRole('textbox', { name: 'Password' }).fill(
    'UrBox@123'
  );

  await page.getByRole('button', { name: 'Sign In' }).click();

  // 👉 Ticket Management
  await page.getByRole('link', { name: 'Ticket Management' }).click();

  // 👉 open latest ticket (better than fixed timestamp)
  await page.getByRole('cell').first().click();

  // 👉 submit ticket
  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page.getByText('Ticket updated successfully')).toBeVisible({ timeout: 10000 });
});
