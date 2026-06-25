import { test, expect } from '@playwright/test';
import { logger } from '../../utils/logger';
import { loginBeforeTest } from '../../utils/testSetup';

test.describe('Offer Detail Flow', { tag: ['@offer-detail', '@p1'] }, () => {
  test.setTimeout(90000);

  // =========================
  // STEP INPUTS
  // =========================
  const STEP_1_URL =
    process.env.STEP_1_URL ||
    'https://visa-d2c.urbox.dev/lk_en/benefits/exclusive-fitness-benefits-at-chenot/2022';

  const STEP_2_SEE_MORE = 'See more';
  const STEP_3_REDEEM_NOW = 'Redeem now';
  const STEP_4_OVERVIEW = 'Overview';
  const STEP_5_COPY_CODE = 'Copy code';

  // =========================
  // AFTER EACH
  // =========================
  test.afterEach(async ({ page }, testInfo) => {
    if (page && !page.isClosed()) {
      await testInfo.attach('Final State - Offer Detail', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    }

    logger.info(`Test status: ${testInfo.status}`);

    if (testInfo.status !== testInfo.expectedStatus) {
      logger.error(`Test failed: ${testInfo.error}`);
    }
  });

  test('should interact with offer detail successfully', async ({ browser }) => {
    const page = await browser.newPage();

    logger.section('TEST: Offer Detail Flow');

    // =========================
    // STEP 1 - LOGIN (reuse)
    // =========================
    logger.step(1, 'Login before test');

    await loginBeforeTest(page);

    await expect(page).toHaveURL(/visa-d2c|urbox/i);

    await test.info().attach('Step 1 - Login', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    logger.success('Login completed');

    // =========================
    // STEP 2 - OPEN OFFER DETAIL
    // =========================
    logger.step(2, 'Open offer detail');

    await page.goto(STEP_1_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    await test.info().attach('Step 2 - Offer Detail Loaded', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    logger.success('Offer detail opened');

    // =========================
    // STEP 3 - SEE MORE
    // =========================
    logger.step(3, 'Click See more');

    const seeMore = page.getByText(STEP_2_SEE_MORE);

    await expect(seeMore.first()).toBeVisible({ timeout: 10000 });
    await seeMore.first().click();

    await test.info().attach('Step 3 - See More', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    logger.success('See more clicked');

    // =========================
    // STEP 4 - REDEEM NOW
    // =========================
    logger.step(4, 'Click Redeem now');

    const redeemBtn = page.getByRole('button', { name: STEP_3_REDEEM_NOW });

    await expect(redeemBtn).toBeVisible({ timeout: 10000 });
    await redeemBtn.click();

    await test.info().attach('Step 4 - Redeem Now', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    logger.success('Redeem clicked');

    // =========================
    // STEP 5 - OVERVIEW
    // =========================
    logger.step(5, 'Open Overview');

    const overviewBtn = page.getByRole('button', { name: STEP_4_OVERVIEW });

    await expect(overviewBtn).toBeVisible();
    await overviewBtn.click();

    await test.info().attach('Step 5 - Overview', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    logger.success('Overview opened');

    // =========================
    // STEP 6 - COPY CODE
    // =========================
    logger.step(6, 'Copy code');

    const copyBtn = page.getByRole('button', { name: STEP_5_COPY_CODE });

    await expect(copyBtn).toBeVisible();
    await copyBtn.click();

    await test.info().attach('Step 6 - Copy Code', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    logger.success('Code copied');

    // =========================
    // FINAL ASSERTION
    // =========================
    logger.info('Verifying offer detail flow completed');

    await expect(page).toHaveURL(/benefits/i);

    logger.success('Offer detail flow completed successfully');
  });
});