import { test } from '@playwright/test';
import { loginBeforeTest } from '../../utils/testSetup';
import { DeleteAccountPage } from '../../pages/DeleteAccountPage';
import { GmailService } from '../../pages/GmailService';

test.setTimeout(50000);

test('Delete Visa Account', async ({ browser }) => {
  const page = await browser.newPage();

  const deleteAcc = new DeleteAccountPage(page);
  const gmail = new GmailService();

  // ✅ LOGIN REUSE
  await loginBeforeTest(page);

  console.log('Login success');

  // 🧭 DELETE FLOW
  await deleteAcc.open();
  await deleteAcc.goToAccount();
  await deleteAcc.startDeleteFlow();
  await deleteAcc.confirmReason();
  await deleteAcc.confirmFinalDelete();

  const otp = await gmail.getOtp(Date.now());

  await deleteAcc.enterOtp(otp);
});