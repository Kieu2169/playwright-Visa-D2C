import { test, expect } from '@playwright/test';
import { logger } from '../../utils/logger';
import { GmailService } from '../../pages/GmailService';
import { ForgotPasswordPage } from '../../pages/ForgotPasswordPage';

test.describe('Forgot Password Flow', {
  tag: ['@forgot-password', '@p1'],
}, () => {
  test.setTimeout(60000);

  const STEP_1_URL =
    process.env.STEP_1_URL ??
    'https://visa-d2c.urbox.dev/sg_en/login';

  const TEST_EMAIL =
    process.env.TEST_EMAIL ??
    'vokieu060921@gmail.com';

  const NEW_PASSWORD =
    process.env.NEW_PASSWORD ??
    'Kieu@012345678';

  test.afterEach(async ({ page }, testInfo) => {
    if (!page.isClosed()) {
      await testInfo.attach('Final State', {
        body: await page.screenshot({
          fullPage: true,
        }),
        contentType: 'image/png',
      });
    }

    logger.info(`Test status: ${testInfo.status}`);

    if (testInfo.status !== testInfo.expectedStatus) {
      logger.error(`Test failed: ${testInfo.error}`);
    }
  });

  test('should reset password successfully', async ({ browser }) => {
    const page = await browser.newPage();

    const forgotPassword =
      new ForgotPasswordPage(page);

    const gmail = new GmailService();

    logger.section('TEST: Forgot Password Flow');

    // STEP 1
    logger.step(1, 'Open login page');

    await forgotPassword.open(STEP_1_URL);

    await test.info().attach('Step 1', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    // STEP 2
    logger.step(2, 'Open forgot password');

    await forgotPassword.openForgotPassword();

    await test.info().attach('Step 2', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    // STEP 3
    logger.step(3, 'Submit email');

    const startTime = Date.now();

    await forgotPassword.submitEmail(TEST_EMAIL);

    await test.info().attach('Step 3', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    // STEP 4
    logger.step(4, 'Enter new password');

    await forgotPassword.enterNewPassword(
      NEW_PASSWORD
    );

    await test.info().attach('Step 4', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    // STEP 5
    logger.step(5, 'Get OTP');

    const otp = await gmail.getOtp(startTime);

    logger.info(`OTP: ${otp}`);

    await forgotPassword.enterOtp(otp);

    await test.info().attach('Step 5', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    // STEP 6
    logger.step(6, 'Verify OTP');

    await forgotPassword.verifyOtp();

    await test.info().attach('Step 6', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    // STEP 7
    logger.step(7, 'Finish');

    await forgotPassword.finish();

    await expect(page).toHaveURL(
      /login|home|visa-d2c|urbox/i
    );

    await test.info().attach('Step 7', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    logger.success(
      'Forgot Password flow completed successfully'
    );
  });
});