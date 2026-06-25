import { test, expect } from '@playwright/test';
import { loginBeforeTest } from '../../utils/testSetup';
import { ContactUsPage } from '../../pages/ContactUsPage';
import { logger } from '../../utils/logger';

test.describe(
  'Contact Us Flow',
  { tag: ['@contact-us', '@p1'] },
  () => {
    const STEP_1_INPUT = 'Login';
    const STEP_2_INPUT = 'Open Contact Us';
    const STEP_3_INPUT = 'Select Category';
    const STEP_4_INPUT = 'Select Issue';
    const STEP_5_INPUT = 'test Visa';
    const STEP_6_INPUT = 'Select Visa Tier';
    const STEP_7_INPUT = 'Submit Form';
    const STEP_8_INPUT = 'Continue';

    const STEP_9_INPUT = 'Open Admin Portal';
    const STEP_10_INPUT = 'visa-main-admin@urbox.vn';
    const STEP_11_INPUT = 'UrBox@123';
    const STEP_12_INPUT = 'Open Ticket Management';
    const STEP_13_INPUT = 'Open Latest Ticket';
    const STEP_14_INPUT = 'Submit Ticket';

    test('should submit contact us ticket successfully', async ({
      browser,
    }) => {
      test.setTimeout(180000);

      const page = await browser.newPage();
      const contact = new ContactUsPage(page);

      logger.section('TEST: Contact Us Flow');

      // Step 1: Login
      logger.step(1, STEP_1_INPUT);

      await loginBeforeTest(page);

      logger.success('Login completed');

      await test.info().attach('Step 1 - Login', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      // Step 2: Open Contact Us
      logger.step(2, STEP_2_INPUT);

      await contact.openContactUs();

      logger.success('Contact Us page opened');

      await test.info().attach('Step 2 - Open Contact Us', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      // Step 3: Select Category
      logger.step(3, STEP_3_INPUT);

      await contact.selectCategory();

      logger.success('Category selected');

      await test.info().attach('Step 3 - Select Category', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      // Step 4: Select Issue
      logger.step(4, STEP_4_INPUT);

      await contact.selectIssue();

      logger.success('Issue selected');

      await test.info().attach('Step 4 - Select Issue', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      // Step 5: Fill Description
      logger.step(5, `Fill Description: ${STEP_5_INPUT}`);

      await contact.fillDescription(STEP_5_INPUT);

      logger.success('Description entered');

      await test.info().attach('Step 5 - Fill Description', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      // Step 6: Select Visa Tier
      logger.step(6, STEP_6_INPUT);

      await contact.selectVisaTier();

      logger.success('Visa tier selected');

      await test.info().attach('Step 6 - Select Visa Tier', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      // Step 7: Submit Form
      logger.step(7, STEP_7_INPUT);

      await contact.submitForm();

      logger.success('Contact form submitted');

      await test.info().attach('Step 7 - Submit Form', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      // Step 8: Continue
      logger.step(8, STEP_8_INPUT);

      await contact.continue();

      logger.success('Continue completed');

      await test.info().attach('Step 8 - Continue', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      // Step 9: Open Admin Portal
      logger.step(9, STEP_9_INPUT);

      await contact.openAdminPortal();

      logger.success('Admin portal opened');

      await test.info().attach('Step 9 - Open Admin Portal', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      // Step 10: Admin Login
      logger.step(10, 'Admin Login');

      await contact.adminLogin(
        STEP_10_INPUT,
        STEP_11_INPUT
      );

      logger.success('Admin login successful');

      await test.info().attach('Step 10 - Admin Login', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      // Step 11: Open Ticket Management
      logger.step(11, STEP_12_INPUT);

      await contact.openTicketManagement();

      logger.success('Ticket management opened');

      await test.info().attach('Step 11 - Ticket Management', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      // Step 12: Open Latest Ticket
      logger.step(12, STEP_13_INPUT);

      await contact.openLatestTicket();

      logger.success('Latest ticket opened');

      await test.info().attach('Step 12 - Latest Ticket', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      // Step 13: Submit Ticket
      logger.step(13, STEP_14_INPUT);

      await contact.submitTicket();

      logger.success('Ticket submitted');

      await test.info().attach('Step 13 - Submit Ticket', {
        body: await page.screenshot({ fullPage: true }),
        contentType: 'image/png',
      });

      // Final Verification
      logger.info('Verifying final result');

      await contact.expectSuccess();

      await test.info().attach(
        'Final State - Success Verification',
        {
          body: await page.screenshot({ fullPage: true }),
          contentType: 'image/png',
        }
      );

      logger.success(
        '✅ Contact Us flow completed successfully'
      );
    });

    test.afterEach(async ({ page }, testInfo) => {
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
    });
  }
);