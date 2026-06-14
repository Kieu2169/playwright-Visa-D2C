import { test } from '@playwright/test';
import { Auth } from '../../utils/auth';
import { DeleteAccountPage } from '../../pages/DeleteAccountPage';
import { GmailService } from '../../pages/GmailService';

test.setTimeout(50000);

test('Delete Visa Account', async ({ browser }) => {
  const page = await browser.newPage();

  const auth = new Auth(page);
  const deleteAcc = new DeleteAccountPage(page);
  const gmail = new GmailService();

  // 🔐 LOGIN FIRST (REQUIRED BEFORE DELETE)
  await auth.login(
    'vokieu060921@gmail.com',
    'Kieu@12345678'
  );

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