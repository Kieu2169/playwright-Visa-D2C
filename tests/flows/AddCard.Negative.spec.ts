import { test, expect } from '@playwright/test';
import { loginBeforeTest } from '../../utils/testSetup';
import { logger } from '../../utils/logger';

test.describe('Add Card Negative Flow', { tag: ['@add-card', '@negative', '@p1'] }, () => {
  test.setTimeout(60000);

  // =========================
  // STEP INPUTS (deterministic)
  // =========================
  const STEP_1_URL =
    process.env.STEP_1_INPUT ||
    'https://visa-d2c.urbox.dev/sg_en/category/dining/beyond-the-menu';

  const STEP_2_MENU = 'Add new card';
  const STEP_3_CARD_TYPE = 'Visa Infinite';
  const STEP_4_CARD_NUMBER = 'Card number';
  const STEP_5_EXPIRY = 'Expiry date (MM / YY)';
  const STEP_6_CONTINUE = 'Continue';
  const STEP_7_TRY_AGAIN = 'try again';

  const CARD_EXISTING = process.env.CARD_EXISTING || '4006 1010 0000 1006';
  const CARD_MISMATCH = process.env.CARD_MISMATCH || '4036 8650 0000 0110';

  const EXPIRY_VALID = process.env.EXPIRY_VALID || '09/36';
  const EXPIRY_INVALID = process.env.EXPIRY_INVALID || '12/34';

  // =========================
  // AFTER EACH
  // =========================
  test.afterEach(async ({ page }, testInfo) => {
    logger.info(`Status: ${testInfo.status}`);

    if (testInfo.status !== testInfo.expectedStatus) {
      logger.error(`Error: ${testInfo.error}`);
    }

    if (page && !page.isClosed()) {
      await testInfo.attach('Final State', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    }
  });

  test('should show all negative cases in one flow', async ({ browser }) => {
    const page = await browser.newPage();

    // ==================================================
    // STEP 1 - LOGIN
    // ==================================================
    logger.section('STEP 1 - LOGIN');
    await loginBeforeTest(page);

    await expect(page).toHaveURL(/visa-d2c|urbox/i);

    await test.info().attach('Step 1 - Login', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    logger.success('Login success');

    // ==================================================
    // CASE 1 - EXISTING CARD
    // ==================================================
    logger.section('CASE 1 - Existing Card');

    logger.step(1, 'Navigate to category page');
    await page.goto(STEP_1_URL, { waitUntil: 'networkidle' });
    await expect(page).toHaveURL(/visa-d2c|urbox/i);

    await test.info().attach('Case 1 - Step 1', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    logger.step(2, 'Open Add new card form');
    await page.locator('svg.rotate-90').first().locator('..').click();
    await page.getByRole('link', { name: STEP_2_MENU }).first().click();

    await test.info().attach('Case 1 - Step 2', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    logger.step(3, 'Fill existing card data');
    await page.getByRole('textbox', { name: STEP_4_CARD_NUMBER }).fill(CARD_EXISTING);
    await page.getByRole('textbox', { name: STEP_5_EXPIRY }).fill(EXPIRY_INVALID);

    await test.info().attach('Case 1 - Step 3', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    logger.step(4, 'Submit form');
    await page.getByRole('button', { name: STEP_6_CONTINUE }).click();

    await expect(
      page.getByText(/already bound|already registered|card already/i)
    ).toBeVisible({ timeout: 15000 });

    logger.success('CASE 1 PASSED');

    // RESET
    await page.goto(STEP_1_URL, { waitUntil: 'networkidle' });

    // ==================================================
    // CASE 2 - CARD MISMATCH
    // ==================================================
    logger.section('CASE 2 - Card Mismatch');

    logger.step(1, 'Open Add new card form');
    await page.locator('svg.rotate-90').first().locator('..').click();
    await page.getByRole('link', { name: STEP_2_MENU }).first().click();

    await test.info().attach('Case 2 - Step 1', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    logger.step(2, 'Select card type');
    await page.getByRole('button', { name: STEP_3_CARD_TYPE }).click();

    await test.info().attach('Case 2 - Step 2', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    logger.step(3, 'Fill mismatch card data');
    await page.getByRole('textbox', { name: STEP_4_CARD_NUMBER }).fill(CARD_MISMATCH);
    await page.getByRole('textbox', { name: STEP_5_EXPIRY }).fill(EXPIRY_VALID);

    await test.info().attach('Case 2 - Step 3', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    logger.step(4, 'Submit form');
    await page.getByRole('button', { name: STEP_6_CONTINUE }).click();

    await expect(page.getByText(/card country mismatch/i)).toBeVisible({
      timeout: 15000,
    });

    await expect(page.getByRole('button', { name: STEP_7_TRY_AGAIN })).toBeVisible();

    logger.success('CASE 2 PASSED');

    // RESET
    await page.goto(STEP_1_URL, { waitUntil: 'networkidle' });

    // ==================================================
    // CASE 3 - INVALID CARD / EXPIRED
    // ==================================================
    logger.section('CASE 3 - Invalid Card / Expiry');

    logger.step(1, 'Open Add new card form');
    await page.locator('svg.rotate-90').first().locator('..').click();
    await page.getByRole('link', { name: STEP_2_MENU }).first().click();

    await test.info().attach('Case 3 - Step 1', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    logger.step(2, 'Select card type');
    await page.getByRole('button', { name: STEP_3_CARD_TYPE }).click();

    logger.step(3, 'Fill invalid card data');
    await page.getByRole('textbox', { name: STEP_4_CARD_NUMBER })
      .fill('4123 4567 8909 9887');

    await page.getByRole('textbox', { name: STEP_5_EXPIRY })
      .fill('12/21');

    await test.info().attach('Case 3 - Step 3', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    logger.step(4, 'Verify validation errors');

    await expect(
      page.getByText('Please enter a valid card number', { exact: true })
    ).toBeVisible();

    await expect(
      page.getByText('Please enter a valid date', { exact: true })
    ).toBeVisible();

    logger.success('CASE 3 PASSED');
  });
});