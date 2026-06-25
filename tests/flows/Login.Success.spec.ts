import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { logger } from '../../utils/logger';

test.describe(
  'Login Flow',
  { tag: ['@login', '@smoke', '@p1'] },
  () => {
    const STEP_1_INPUT =
      process.env.STEP_1_INPUT ||
      'https://visa-d2c.urbox.dev/sg_en/login';

    const STEP_2_INPUT =
      process.env.STEP_2_INPUT ||
      'vokieu060921@gmail.com';

    const STEP_3_INPUT =
      process.env.STEP_3_INPUT ||
      'Kieu@12345678';

    test(
      'should login successfully with registered account',
      async ({ page }) => {
        test.setTimeout(60000);

        const loginPage =
          new LoginPage(page);

        logger.section(
          'TEST: Login Flow'
        );

        // Step 1: Open Login Page
        logger.step(
          1,
          'Open login page'
        );

        await loginPage.open();

        await expect(page).toHaveURL(
          /login/
        );

        logger.success(
          'Login page opened'
        );

        await test.info().attach(
          'Step 1 - Open Login Page',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        // Step 2: Login
        logger.step(
          2,
          'Login with registered account'
        );

        await loginPage.login(
          STEP_2_INPUT,
          STEP_3_INPUT
        );

        logger.success(
          'Login action completed'
        );

        await test.info().attach(
          'Step 2 - Login',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        // Final Verification
        logger.info(
          'Verifying login result'
        );

        await expect(page).not.toHaveURL(
          /login/
        );

        logger.success(
          'User redirected after login'
        );

        await test.info().attach(
          'Final State - Login Success',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        logger.success(
          '✅ Login flow completed successfully'
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