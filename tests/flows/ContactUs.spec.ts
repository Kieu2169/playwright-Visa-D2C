import { test } from '@playwright/test';
import { loginBeforeTest } from '../../utils/testSetup';
import { ContactUsPage } from '../../pages/ContactUsPage';

test('Contact us flow', async ({ browser }) => {
  const page = await browser.newPage();
  const contact = new ContactUsPage(page);

  // ========================
  // USER FLOW
  // ========================
  await loginBeforeTest(page);
  console.log('Login done');

  await contact.openContactUs();
  await contact.selectCategory();
  await contact.selectIssue();
  await contact.fillDescription('test Visa');
  await contact.selectVisaTier();
  await contact.submitForm();
  await contact.continue();

  // ========================
  // ADMIN FLOW
  // ========================
  await contact.openAdminPortal();
  await contact.adminLogin(
    'visa-main-admin@urbox.vn',
    'UrBox@123'
  );

  await contact.openTicketManagement();
  await contact.openLatestTicket();
  await contact.submitTicket();

  await contact.expectSuccess();
});