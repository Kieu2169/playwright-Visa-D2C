import { test, expect } from '@playwright/test';
import { GmailService } from '../../pages/GmailService';
import { RegisterPage } from '../../pages/SignUpPage';
import { logger } from '../../utils/logger';

test.describe(
  'Sign Up Success Flow',
  { tag: ['@signup', '@smoke', '@p1'] },
  () => {
    const STEP_1_INPUT =
      process.env.TEST_EMAIL ||
      'vokieu060921@gmail.com';

    const STEP_2_INPUT =
      process.env.TEST_PASSWORD ||
      'Kieu@12345678';

    test(
      'should create Visa account successfully',
      async ({ page }) => {
        test.setTimeout(180000);

        const gmail = new GmailService();
        const register =
          new RegisterPage(page);

        logger.section(
          'TEST: Sign Up Success Flow'
        );

        // Step 1: Prepare email
        logger.step(
          1,
          'Prepare registration email'
        );

        const email =
          STEP_1_INPUT;

        logger.success(
          `Email ready: ${email}`
        );

        // Step 2: Open Visa registration page
        logger.step(
          2,
          'Open registration page'
        );

        await register.open();

        logger.success(
          'Registration page opened'
        );

        await test.info().attach(
          'Step 2 - Registration Page',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        // Step 3: Register email
        logger.step(
          3,
          'Register email'
        );

        await register.register(
          email
        );

        logger.success(
          'Registration email submitted'
        );

        await test.info().attach(
          'Step 3 - Register Email',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        // IMPORTANT:
        // Capture timestamp immediately after triggering OTP email
        const startTime =
          Date.now();

        // Step 4: Get OTP
        logger.step(
          4,
          'Get OTP from Gmail'
        );

        const otp =
          await gmail.getOtp(
            startTime
          );

        expect(
          otp,
          'OTP should be received'
        ).toBeTruthy();

        logger.success(
          `OTP received: ${otp}`
        );

        // Step 5: Verify OTP
        logger.step(
          5,
          'Verify OTP'
        );

        await register.verifyOtp(
          otp
        );

        logger.success(
          'OTP verified'
        );

        await test.info().attach(
          'Step 5 - Verify OTP',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        // Step 6: Verify Password Page
        logger.step(
          6,
          'Verify password page'
        );

        await register.expectPasswordPage();

        logger.success(
          'Password page displayed'
        );

        await test.info().attach(
          'Step 6 - Password Page',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        // Step 7: Create Password
        logger.step(
          7,
          'Create password'
        );

        await register.createPassword(
          STEP_2_INPUT
        );

        logger.success(
          'Password created'
        );

        await test.info().attach(
          'Step 7 - Create Password',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        // Step 8: Fill Profile
        logger.step(
          8,
          'Fill profile information'
        );

        await register.fillProfile();

        logger.success(
          'Profile completed'
        );

        await test.info().attach(
          'Step 8 - Fill Profile',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        // Step 9: Accept Terms
        logger.step(
          9,
          'Accept terms and conditions'
        );

        await register.acceptTerms();

        logger.success(
          'Terms accepted'
        );

        await test.info().attach(
          'Step 9 - Accept Terms',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        // Step 10: Add Card
        logger.step(
          10,
          'Add card'
        );

        await register.addCard();

        logger.success(
          'Card added successfully'
        );

        await test.info().attach(
          'Step 10 - Add Card',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        // Final Verification
        logger.info(
          'Verifying registration result'
        );

        await expect(page).not.toHaveURL(
          /register|signup/i
        );

        await test.info().attach(
          'Final State - Registration Success',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        logger.success(
          '✅ Sign Up Success flow completed successfully'
        );
      }
    );

    test.afterEach(
      async ({ page }, testInfo) => {
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
      }
    );
  }
);