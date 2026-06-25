import { test, expect } from '@playwright/test';
import { logger } from '../../utils/logger';
import { loginBeforeTest } from '../../utils/testSetup';

test.describe(
  'Search and Redeem flow',
  { tag: ['@search', '@redeem', '@p1'] },
  () => {
    const STEP_1_INPUT = process.env.STEP_1_INPUT || 'Login';
    const STEP_2_INPUT = process.env.STEP_2_INPUT || 'Open homepage';
    const STEP_3_INPUT = process.env.STEP_3_INPUT || 'Search';
    const STEP_4_INPUT = process.env.STEP_4_INPUT || 'A High Dining';
    const STEP_5_INPUT = process.env.STEP_5_INPUT || 'Redeem now';

    test('should search and redeem successfully', async ({ page }) => {
      test.setTimeout(60000);

      logger.section('TEST: Search and Redeem flow');

      // STEP 1: LOGIN
      logger.step(1, STEP_1_INPUT);
      await loginBeforeTest(page);
      logger.success('Login successful');

      await test.info().attach('Step 1 - Login', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      // STEP 2: OPEN HOMEPAGE
      logger.step(2, STEP_2_INPUT);
      await page.goto('https://visa-d2c.urbox.dev/sg_en', {
        waitUntil: 'networkidle',
      });
      await expect(page).toHaveURL(/sg_en/);
      logger.success('Homepage opened');

      await test.info().attach('Step 2 - Homepage', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      // STEP 3: CLICK SEARCH ICON
      logger.step(3, STEP_3_INPUT);
      const searchIcon = page.getByRole('img').nth(1);
      await expect(searchIcon).toBeVisible();
      await searchIcon.click();
      logger.success('Search icon clicked');

      await test.info().attach('Step 3 - Search icon', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      // STEP 4: SEARCH INPUT + SELECT
      logger.step(4, `Search keyword: ${STEP_4_INPUT}`);

      const searchBox = page.getByRole('textbox', { name: 'Search' });
      await expect(searchBox).toBeVisible();
      await searchBox.fill(STEP_4_INPUT);

      const suggestion = page.getByText(STEP_4_INPUT, { exact: true });
      await expect(suggestion).toBeVisible();
      await suggestion.click();

      logger.success('Search and select completed');

      await test.info().attach('Step 4 - Search result', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      // STEP 5: REDEEM
      logger.step(5, STEP_5_INPUT);

      const redeemBtn = page.getByRole('button', {
        name: STEP_5_INPUT,
      });

      await expect(redeemBtn).toBeVisible();
      await redeemBtn.click();

      logger.success('Redeem clicked');

      await test.info().attach('Step 5 - Redeem', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      // FINAL VERIFY
      logger.section('FINAL VERIFICATION');

      await expect(page).toHaveURL(/sg_en|visa|urbox/);

      const successPopup = page.locator(
        'text=/success|thành công|redeemed|hoàn tất/i',
      );

      await expect(successPopup.first()).toBeVisible({ timeout: 10000 });

      logger.success('Redeem flow completed successfully');
    });

    test.afterEach(async ({ page }, testInfo) => {
      try {
        await testInfo.attach('FINAL SCREENSHOT', {
          body: await page.screenshot({ fullPage: true }),
          contentType: 'image/png',
        });
      } catch (e) {
        logger.error(`afterEach screenshot error: ${e}`);
      }

      logger.info(`Test status: ${testInfo.status}`);

      if (testInfo.status !== testInfo.expectedStatus) {
        logger.error(`Test failed: ${testInfo.title}`);
      }
    });
  },
);