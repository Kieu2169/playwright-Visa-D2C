import { test, expect } from '@playwright/test';
import { logger } from '../../utils/logger';
import { loginBeforeTest } from '../../utils/testSetup';

test.describe('My Benefits Flow', { tag: ['@my-benefits', '@p1'] }, () => {
  test.setTimeout(60000);

  // =========================
  // STEP INPUTS
  // =========================
  const STEP_1_LOGO = 'logo';
  const STEP_2_OFFER_IMG = 'Hard Rock Cafe Yokohama';
  const STEP_3_SAVE_OFFER = 'Save offer';
  const STEP_4_MENU_ICON = '.icon-wrap';
  const STEP_5_MY_BENEFITS = 'My Benefits';
  const STEP_6_PAST = 'Past';
  const STEP_7_SAVED = 'Saved';
  const STEP_8_EXPIRING = 'Expiring soon';

  const STEP_9_URL_SAVED =
    'https://visa-d2c.urbox.dev/sg_en/mybenefits?tab=saved';

  // =========================
  // AFTER EACH
  // =========================
  test.afterEach(async ({ page }, testInfo) => {
    if (page && !page.isClosed()) {
      await testInfo.attach('Final State - My Benefits', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    }

    logger.info(`Test status: ${testInfo.status}`);

    if (testInfo.status !== testInfo.expectedStatus) {
      logger.error(`Test failed: ${testInfo.error}`);
    }
  });

  test('should save offer and verify My Benefits sections', async ({
    page,
  }) => {
    logger.section('TEST: My Benefits Flow');

    // =========================
    // STEP 1 - LOGIN
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

    await page.goto(
    'https://visa-d2c.urbox.dev/lk_en/benefits/exclusive-fitness-benefits-at-chenot/2022',
    { waitUntil: 'domcontentloaded' }
    );

    await page.waitForLoadState('networkidle');

    // screenshot debug
    await test.info().attach('Step 2 - Offer Detail Loaded', {
    body: await page.screenshot({ fullPage: true }),
    contentType: 'image/png',
    });

    // =========================
    // STEP 3 - SAVE OFFER
    // =========================
    logger.step(3, 'Save offer');

    await page.getByRole('button', { name: STEP_3_SAVE_OFFER }).click();

    await test.info().attach('Step 3 - Save Offer', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    logger.success('Offer saved');

    // =========================
    // STEP 4 - OPEN MENU
    // =========================
    logger.step(4, 'Open menu');

    await page.locator(STEP_4_MENU_ICON).first().click();

    await test.info().attach('Step 4 - Open Menu', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    logger.success('Menu opened');

    // =========================
    // STEP 5 - MY BENEFITS
    // =========================
    logger.step(5, 'Navigate to My Benefits');

    await page.getByRole('link', { name: STEP_5_MY_BENEFITS }).click();

    await expect(page).toHaveURL(/mybenefits/i);

    await test.info().attach('Step 5 - My Benefits', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    logger.success('My Benefits page opened');

    // =========================
    // STEP 6 - PAST TAB
    // =========================
    logger.step(6, 'Open Past tab');

    await page.getByRole('button', { name: STEP_6_PAST }).click();

    await test.info().attach('Step 6 - Past Tab', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    logger.success('Past tab opened');

    // =========================
    // STEP 7 - SAVED TAB
    // =========================
    logger.step(7, 'Open Saved tab');

    await page.getByRole('button', { name: STEP_7_SAVED }).click();

    await expect(page).toHaveURL(/saved/i);

    await test.info().attach('Step 7 - Saved Tab', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    logger.success('Saved tab opened');

    // =========================
    // STEP 8 - OPEN SAVED OFFER DETAIL
    // =========================
    logger.step(8, 'Open saved offer detail');

    await page.getByRole('img', { name: STEP_2_OFFER_IMG }).click();

    await test.info().attach('Step 8 - Offer Detail', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    logger.success('Saved offer opened');

    // =========================
    // STEP 9 - DIRECT NAVIGATION (SYNC CHECK)
    // =========================
    logger.step(9, 'Verify saved tab URL');

    await page.goto(STEP_9_URL_SAVED, { waitUntil: 'networkidle' });

    await expect(page).toHaveURL(/mybenefits.*saved/i);

    await test.info().attach('Step 9 - URL Check', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    logger.success('Saved tab URL verified');

    // =========================
    // STEP 10 - EXPIRING SOON TAB
    // =========================
    logger.step(10, 'Open Expiring soon tab');

    await page.getByRole('button', { name: STEP_8_EXPIRING }).click();

    await test.info().attach('Step 10 - Expiring Soon', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    logger.success('Expiring soon tab verified');

    // toggle again (as original test does)
    await page.getByRole('button', { name: STEP_8_EXPIRING }).click();

    logger.success('My Benefits flow completed successfully');
  });
});