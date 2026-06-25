import { test, expect } from '@playwright/test';
import { loginBeforeTest } from '../../utils/testSetup';
import { logger } from '../../utils/logger';

test.describe(
  'Add Card Flow',
  { tag: ['@add-card', '@smoke', '@p1'] },
  () => {
    // Deterministic step variables
    const STEP_1_INPUT =
      process.env.STEP_1_INPUT ||
      'https://visa-d2c.urbox.dev/sg_en/category/dining/beyond-the-menu';

    const STEP_2_INPUT = process.env.STEP_2_INPUT || 'Add new card';
    const STEP_3_INPUT =
      process.env.STEP_3_INPUT || '4006 1010 0000 1010';
    const STEP_4_INPUT = process.env.STEP_4_INPUT || '11/30';
    const STEP_5_INPUT = process.env.STEP_5_INPUT || 'Continue';

    test('should add card successfully', async ({ browser }) => {
      test.setTimeout(120000);

      const page = await browser.newPage();

      logger.section('TEST: Add Card Flow');

      // Step 1: Login
      logger.step(1, 'Login with reusable login flow');

      await loginBeforeTest(page);

      await expect(page).toHaveURL(/visa-d2c|urbox/i);

      logger.success('Login completed successfully');

      await test.info().attach('Step 1 - Login Success', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      // Step 2: Navigate to category page
      logger.step(2, 'Navigate to Beyond The Menu page');

      await page.goto(STEP_1_INPUT, {
        waitUntil: 'networkidle',
      });

      await expect(page).toHaveURL(/beyond-the-menu/i);

      logger.success('Category page loaded successfully');

      await test.info().attach('Step 2 - Category Page', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      // Step 3: Open account menu
      logger.step(3, 'Open account menu');

      const accountMenu = page
        .locator('svg.rotate-90')
        .first()
        .locator('..');

      await accountMenu.waitFor({
        state: 'visible',
        timeout: 10000,
      });

      await accountMenu.click();

      logger.success('Account menu opened');

      await test.info().attach('Step 3 - Open Account Menu', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      // Step 4: Click Add new card
      logger.step(4, 'Click Add new card');

      const addCardLink = page
        .locator('a', { hasText: STEP_2_INPUT })
        .filter({
          hasNot: page.locator('text=/text-base/'),
        })
        .first();

      await addCardLink.waitFor({
        state: 'visible',
        timeout: 10000,
      });

      await addCardLink.click();

      await page.waitForLoadState('networkidle');

      logger.success('Navigated to Add Card page');

      await test.info().attach('Step 4 - Add Card Page', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      // Step 5: Input card number
      logger.step(5, 'Input card number');

      const cardNumberTextbox = page.getByRole('textbox', {
        name: 'Card number',
      });

      await cardNumberTextbox.waitFor({
        state: 'visible',
        timeout: 10000,
      });

      await cardNumberTextbox.fill(STEP_3_INPUT);

      logger.success(`Entered card number: ${STEP_3_INPUT}`);

      await test.info().attach('Step 5 - Card Number', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      // Step 6: Input expiry date
      logger.step(6, 'Input expiry date');

      const expiryTextbox = page.getByRole('textbox', {
        name: 'Expiry date (MM / YY)',
      });

      await expiryTextbox.waitFor({
        state: 'visible',
        timeout: 10000,
      });

      await expiryTextbox.fill(STEP_4_INPUT);

      logger.success(`Entered expiry date: ${STEP_4_INPUT}`);

      await test.info().attach('Step 6 - Expiry Date', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      // Step 7: Click Continue
      logger.step(7, 'Click Continue button');

      const continueButton = page.getByRole('button', {
        name: STEP_5_INPUT,
      });

      await continueButton.waitFor({
        state: 'visible',
        timeout: 10000,
      });

      await continueButton.click();

      await page.waitForLoadState('networkidle');

      logger.success('Continue button clicked');

      await test.info().attach('Step 7 - Continue', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      // Final Verification
      logger.info('Verifying add card result...');

      await expect(
        page.getByText(/great! your card has been added/i)
      ).toBeVisible({ timeout: 10000 });

      logger.success('URL verification passed');

      await test.info().attach(
        'Final State - Add Card Verification',
        {
          body: await page.screenshot({ fullPage: true }),
          contentType: 'image/png',
        }
      );

      logger.success(
        '✅ Add Card flow completed successfully'
      );
    });

    test.afterEach(async ({ page }, testInfo) => {
      if (!page.isClosed()) {
        await testInfo.attach(
          'Final State - After Test',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );
      }

      logger.info(
        `Test completed with status: ${testInfo.status}`
      );

      if (
        testInfo.status !==
        testInfo.expectedStatus
      ) {
        logger.error(
          `Test failed: ${testInfo.error}`
        );
      }
    });
  }
);