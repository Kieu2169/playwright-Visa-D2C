import { test, expect } from '@playwright/test';
import { loginBeforeTest } from '../../utils/testSetup';
import { logger } from '../../utils/logger';

test.describe(
  'Filter Offers Flow',
  { tag: ['@filter', '@smoke', '@p1'] },
  () => {
    const STEP_1_INPUT =
      'https://visa-d2c.urbox.dev/sg_en/home';

    const STEP_2_INPUT = 'Travel';
    const STEP_3_INPUT = 'Australia';
    const STEP_4_INPUT = 'Dining Events';
    const STEP_5_INPUT =
      'Attractions & Activities';

    test(
      'should filter offers successfully',
      async ({ page }) => {
        test.setTimeout(120000);

        logger.section(
          'TEST: Filter Offers Flow'
        );

        // Step 1: Login
        logger.step(
          1,
          'Login with reusable login flow'
        );

        await loginBeforeTest(page);

        logger.success(
          'Login completed successfully'
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

        // Step 2: Navigate Home
        logger.step(
          2,
          'Navigate to Home page'
        );

        await page.goto(
          STEP_1_INPUT,
          {
            waitUntil: 'networkidle',
          }
        );

        await expect(page).toHaveURL(
          /home/
        );

        logger.success(
          'Home page loaded successfully'
        );

        await test.info().attach(
          'Step 2 - Home Page',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        // Step 3: Open Travel Category
        logger.step(
          3,
          'Open Travel category'
        );

        await page
          .getByRole('link', {
            name: STEP_2_INPUT,
          })
          .first()
          .click();

        logger.success(
          'Travel category opened'
        );

        await test.info().attach(
          'Step 3 - Travel Category',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        // Step 4: Click View More
        logger.step(
          4,
          'Click View More'
        );

        await page
          .getByText('View More')
          .nth(1)
          .click();

        logger.success(
          'Offer list page opened'
        );

        await test.info().attach(
          'Step 4 - View More',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        // Step 5: Open Filter
        logger.step(
          5,
          'Open filter panel'
        );

        await page
          .getByRole('button', {
            name: 'Filter (1)',
          })
          .click();

        logger.success(
          'Filter panel opened'
        );

        await test.info().attach(
          'Step 5 - Open Filter',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        // Step 6: Select Location Filter
        logger.step(
          6,
          `Select location: ${STEP_3_INPUT}`
        );

        await page
          .getByRole('button', {
            name: 'Location',
          })
          .click();

        await page
          .locator('label', {
            has: page.getByText(
              STEP_3_INPUT
            ),
          })
          .click();

        await page
          .getByRole('button', {
            name: 'Show offers and benefits',
          })
          .click();

        logger.success(
          'Location filter applied'
        );

        await test.info().attach(
          'Step 6 - Location Filter',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        // Step 7: Reopen Filter
        logger.step(
          7,
          'Reopen filter panel'
        );

        await page
          .getByRole('button', {
            name: 'Filter (2)',
          })
          .click();

        logger.success(
          'Filter panel reopened'
        );

        await test.info().attach(
          'Step 7 - Reopen Filter',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        // Step 8: Select Dining Filter
        logger.step(
          8,
          `Select dining filter: ${STEP_4_INPUT}`
        );

        await page
          .getByRole('button', {
            name: 'Dining',
          })
          .nth(1)
          .click();

        await page
          .locator(
            `label:has-text("${STEP_4_INPUT}")`
          )
          .click();

        logger.success(
          'Dining filter selected'
        );

        await test.info().attach(
          'Step 8 - Dining Filter',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        // Step 9: Select Lifestyle Filter
        logger.step(
          9,
          `Select lifestyle filter: ${STEP_5_INPUT}`
        );

        await page
          .getByRole('button', {
            name: 'Lifestyle',
          })
          .nth(1)
          .click();

        await page
          .locator(
            `label:has-text("${STEP_5_INPUT}")`
          )
          .click();

        logger.success(
          'Lifestyle filter selected'
        );

        await test.info().attach(
          'Step 9 - Lifestyle Filter',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        // Step 10: Apply Filter
        logger.step(
          10,
          'Apply filters'
        );

        await page
          .getByRole('button', {
            name: 'Show offers and benefits',
          })
          .click();

        logger.success(
          'Filters applied successfully'
        );

        await test.info().attach(
          'Step 10 - Apply Filter',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        // Final Verification
        logger.info(
          'Verifying filter result'
        );

        await expect(
          page
            .getByRole('button', {
              name: /Filter/i,
            })
            .first()
        ).toBeVisible();

        await test.info().attach(
          'Final State - Filter Result',
          {
            body: await page.screenshot({
              fullPage: true,
            }),
            contentType: 'image/png',
          }
        );

        logger.success(
          '✅ Filter offers flow completed successfully'
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