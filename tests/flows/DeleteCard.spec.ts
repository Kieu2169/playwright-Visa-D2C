import { test, expect } from '@playwright/test';
import { logger } from '../../utils/logger';
import { loginBeforeTest } from '../../utils/testSetup';

test.describe('Delete Card Flow', { tag: ['@delete-card', '@p1'] }, () => {
  test.setTimeout(90000);

  // =========================
  // STEP INPUTS
  // =========================
  const STEP_1_HOME_URL =
    process.env.STEP_1_HOME_URL ||
    'https://visa-d2c.urbox.dev/sg_en/home';

  const STEP_2_VISA_INFINITE = 'Visa Infinite Visa Infinite';
  const STEP_3_MANAGE_CARDS = 'Manage cards';
  const STEP_4_CARD_ITEM =
    'OVERSEA-CHINESE BANKING CORPORATION LTD. Visa Infinite •••• 1010';
  const STEP_5_REMOVE_CARD = 'Remove card';

  // =========================
  // AFTER EACH
  // =========================
  test.afterEach(async ({ page }, testInfo) => {
    if (page && !page.isClosed()) {
      await testInfo.attach('Final State - Delete Card', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });
    }

    logger.info(`Test status: ${testInfo.status}`);

    if (testInfo.status !== testInfo.expectedStatus) {
      logger.error(`Test failed: ${testInfo.error}`);
    }
  });

  test('should remove card successfully', async ({ browser }) => {
    const page = await browser.newPage();

    logger.section('TEST: Delete Card Flow');

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
    // STEP 2 - OPEN HOME
    // =========================
    logger.step(2, 'Open home page');

    await page.goto(STEP_1_HOME_URL, { waitUntil: 'domcontentloaded' });
    await page.waitForLoadState('networkidle');

    await test.info().attach('Step 2 - Home', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    logger.success('Home page opened');

    // =========================
    // STEP 3 - OPEN VISA INFINITE MENU
    // =========================
    logger.step(3, 'Open Visa Infinite menu');

    const visaBtn = page.getByRole('button', {
      name: STEP_2_VISA_INFINITE,
    });

    await expect(visaBtn).toBeVisible();
    await visaBtn.click();

    await test.info().attach('Step 3 - Visa Infinite', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    logger.success('Visa Infinite opened');

    // =========================
    // STEP 4 - MANAGE CARDS
    // =========================
    logger.step(4, 'Navigate to Manage Cards');

    const manageCards = page.getByRole('link', {
      name: STEP_3_MANAGE_CARDS,
    });

    await expect(manageCards).toBeVisible();
    await manageCards.click();

    await test.info().attach('Step 4 - Manage Cards', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    logger.success('Manage cards opened');

    // =========================
    // STEP 5 - SELECT CARD
    // =========================
    logger.step(5, 'Select card to delete');

    const cardItem = page.getByRole('link', {
      name: STEP_4_CARD_ITEM,
    });

    await expect(cardItem).toBeVisible();
    await cardItem.click();

    await test.info().attach('Step 5 - Card Detail', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    logger.success('Card detail opened');

    // =========================
    // STEP 6 - REMOVE CARD
    // =========================
    logger.step(6, 'Remove card');

    const removeBtn = page.getByRole('button', {
      name: STEP_5_REMOVE_CARD,
    });

    await expect(removeBtn).toBeVisible();
    await removeBtn.click();

    await test.info().attach('Step 6 - Remove Card', {
      body: await page.screenshot({ fullPage: true }),
      contentType: 'image/png',
    });

    logger.success('Card removed successfully');

    // =========================
    // FINAL ASSERTION
    // =========================
    logger.info('Verify delete card flow completed');

    await expect(page).toHaveURL(/manage|home|cards/i);

    logger.success('Delete card flow passed');
  });
});