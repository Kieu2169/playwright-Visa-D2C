import { test, expect } from '@playwright/test';
import { logger } from '../../utils/logger';

test.describe(
  'Login Negative Flow',
  {
    tag: ['@login', '@negative', '@p1'],
  },
  () => {
    test.setTimeout(60000);

    // =========================
    // STEP INPUTS (deterministic)
    // =========================
    const STEP_1_URL =
      process.env.STEP_1_INPUT ||
      'https://visa-d2c.urbox.dev/sg_en/login';

    const STEP_2_EMAIL =
      process.env.TEST_EMAIL || 'vokieu060921@gmail.com';

    const STEP_3_PASSWORD =
      process.env.TEST_PASSWORD || 'kieu@12345678';

    const STEP_4_EMAIL_LABEL = 'Email address';
    const STEP_5_PASSWORD_SELECTOR = '#password';
    const STEP_6_LOGIN_BUTTON = 'Sign in';

    // =========================
    // AFTER EACH
    // =========================
    test.afterEach(async ({ page }, testInfo) => {
      if (page && !page.isClosed()) {
        await testInfo.attach('Final State - After Test', {
          body: await page.screenshot({ fullPage: true }),
          contentType: 'image/png',
        });
      }

      logger.info(`Test completed with status: ${testInfo.status}`);

      if (testInfo.status !== testInfo.expectedStatus) {
        logger.error(`Test failed: ${testInfo.error}`);
      }
    });

    test('Login - invalid credentials should show error', async ({ page }) => {
      logger.section('TEST: Login Invalid Credentials');

      // =========================
      // STEP 1 - OPEN LOGIN PAGE
      // =========================
      logger.step(1, 'Open login page');

      await page.goto(STEP_1_URL, { waitUntil: 'networkidle' });

      await test.info().attach('Step 1 - Open Login', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      logger.success('Login page opened');

      // =========================
      // STEP 2 - ENTER INVALID CREDENTIALS
      // =========================
      logger.step(2, 'Enter invalid credentials');

      const emailTextbox = page.getByRole('textbox', {
        name: STEP_4_EMAIL_LABEL,
      });

      await emailTextbox.waitFor({ state: 'visible', timeout: 10000 });
      await emailTextbox.fill(STEP_2_EMAIL);

      const passwordInput = page.locator(STEP_5_PASSWORD_SELECTOR);
      await passwordInput.waitFor({ state: 'visible', timeout: 10000 });
      await passwordInput.fill(STEP_3_PASSWORD);

      const loginButton = page.getByRole('button', {
        name: STEP_6_LOGIN_BUTTON,
      });

      await loginButton.click();

      await page.waitForLoadState('networkidle');

      await test.info().attach('Step 2 - Submit Login', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      logger.success('Login form submitted');

      // =========================
      // STEP 3 - VERIFY ERROR
      // =========================
      logger.step(3, 'Verify login failed');

      await expect(page).toHaveURL(/login/);

      const errorMsg = page.getByText(
        /invalid|incorrect|wrong|failed|error/i
      );

      await expect(errorMsg).toBeVisible({ timeout: 5000 });

      await test.info().attach('Step 3 - Error State', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      logger.success('Login negative test passed');
    });
  }
);