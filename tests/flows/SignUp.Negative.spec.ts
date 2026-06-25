import { test, expect } from '@playwright/test';
import { GmailService } from '../../pages/GmailService';
import { RegisterPage } from '../../pages/SignUpPage';
import { logger } from '../../utils/logger';

test.describe(
  'Sign Up Negative Flow',
  {
    tag: ['@signup', '@negative', '@p1'],
  },
  () => {
    const STEP_EMAIL =
      process.env.TEST_EMAIL ||
      'vokieu060921@gmail.com';

    const STEP_PASSWORD =
      process.env.TEST_PASSWORD ||
      'Kieu@12345678';

    const INVALID_OTP = '000000';

    test(
      'Signup - card country mismatch',
      async ({ page }) => {
        const register =
          new RegisterPage(page);

        const gmail =
          new GmailService();

        logger.section(
          'TEST: Card Country Mismatch'
        );

        logger.step(
          1,
          'Open registration page'
        );

        await register.open();

        await test.info().attach(
          'Step 1 - Open Register',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        logger.step(
          2,
          'Register account'
        );

        const startTime =
          Date.now();

        await register.register(
          STEP_EMAIL
        );

        const otp =
          await gmail.getOtp(
            startTime
          );

        await register.verifyOtp(
          otp
        );

        await register.createPassword(
          STEP_PASSWORD
        );

        await register.fillProfile();

        await register.acceptTerms();

        logger.success(
          'Registration completed'
        );

        await test.info().attach(
          'Step 2 - Registration',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        logger.step(
          3,
          'Skip card linking'
        );

        await page
          .getByRole('button', {
            name:
              'Continue without',
          })
          .click();

        logger.step(
          4,
          'Enter mismatched card'
        );

        await page
          .getByRole('textbox', {
            name: 'Card number',
          })
          .fill(
            '4036 8650 0000 0001'
          );

        await page
          .getByRole('textbox', {
            name:
              'Expiry date (MM / YY)',
          })
          .fill('12/34');

        await page
          .getByRole('button', {
            name: 'Continue',
          })
          .click();

        await test.info().attach(
          'Step 4 - Card Country Mismatch',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        logger.step(
          5,
          'Verify mismatch message'
        );

        await expect(
          page.getByText(
            /Card country mismatch/i
          )
        ).toBeVisible();

        logger.success(
          'Country mismatch message displayed'
        );
      }
    );

    test(
      'Signup - invalid OTP',
      async ({ page }) => {
        const register =
          new RegisterPage(page);

        logger.section(
          'TEST: Invalid OTP'
        );

        logger.step(
          1,
          'Open registration page'
        );

        await register.open();

        logger.step(
          2,
          'Register account'
        );

        await register.register(
          STEP_EMAIL
        );

        await test.info().attach(
          'Step 2 - Register Email',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        logger.step(
          3,
          'Submit invalid OTP'
        );

        await register.submitInvalidOtp(
          INVALID_OTP
        );

        await test.info().attach(
          'Step 3 - Invalid OTP',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        logger.step(
          4,
          'Verify error message'
        );

        await expect(
          page.getByText(
            /This code is incorrect\. Please try again\./i
          )
        ).toBeVisible();

        logger.success(
          'OTP validation message displayed'
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