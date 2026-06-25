import { test, expect } from '@playwright/test';
import { loginBeforeTest } from '../../utils/testSetup';
import { DeleteAccountPage } from '../../pages/DeleteAccountPage';
import { GmailService } from '../../pages/GmailService';
import { logger } from '../../utils/logger';

test.describe(
  'Delete Account Flow',
  { tag: ['@delete-account', '@p1'] },
  () => {
    const STEP_1_INPUT = 'Login';
    const STEP_2_INPUT = 'Open Homepage';
    const STEP_3_INPUT = 'Go To Account';
    const STEP_4_INPUT = 'Start Delete Flow';
    const STEP_5_INPUT = 'Confirm Reason';
    const STEP_6_INPUT = 'Confirm Final Delete';

    test(
      'should delete account successfully',
      async ({ page }) => {
        test.setTimeout(120000);

        const deleteAcc =
          new DeleteAccountPage(page);

        const gmail =
          new GmailService();

        logger.section(
          'TEST: Delete Account Flow'
        );

        // Step 1
        logger.step(
          1,
          STEP_1_INPUT
        );

        await loginBeforeTest(page);

        logger.success(
          'Login completed'
        );

        await test.info().attach(
          'Step 1 - Login',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        // Step 2
        logger.step(
          2,
          STEP_2_INPUT
        );

        await deleteAcc.open();

        logger.success(
          'Homepage opened'
        );

        await test.info().attach(
          'Step 2 - Homepage',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        // Step 3
        logger.step(
          3,
          STEP_3_INPUT
        );

        await deleteAcc.goToAccount();

        logger.success(
          'Account page opened'
        );

        await test.info().attach(
          'Step 3 - Account Page',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        // Step 4
        logger.step(
          4,
          STEP_4_INPUT
        );

        await deleteAcc.startDeleteFlow();

        logger.success(
          'Delete flow started'
        );

        await test.info().attach(
          'Step 4 - Delete Flow',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        // Step 5
        logger.step(
          5,
          STEP_5_INPUT
        );

        await deleteAcc.confirmReason();

        logger.success(
          'Delete reason confirmed'
        );

        await test.info().attach(
          'Step 5 - Confirm Reason',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        // Step 6
        logger.step(
          6,
          STEP_6_INPUT
        );

        await deleteAcc.confirmFinalDelete();

        logger.success(
          'Final delete confirmed'
        );

        await test.info().attach(
          'Step 6 - Confirm Delete',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        // Step 7
        logger.step(
          7,
          'Get OTP from Gmail'
        );

        const otp =
          await gmail.getOtp(
            Date.now()
          );

        expect(
          otp,
          'OTP should exist'
        ).toBeTruthy();

        logger.success(
          `OTP received: ${otp}`
        );

        // Step 8
        logger.step(
          8,
          'Enter OTP'
        );

        await deleteAcc.enterOtp(
          otp
        );

        logger.success(
          'OTP verified'
        );

        await test.info().attach(
          'Step 8 - OTP Verification',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        // Final Verification
        logger.info(
          'Verifying final result'
        );

        await expect(page).toHaveURL(
          /visa-d2c|urbox/i
        );

        await test.info().attach(
          'Final State - Success Verification',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        logger.success(
          '✅ Delete account flow completed successfully'
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