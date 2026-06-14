import { DeleteAccountPage } from '../../pages/DeleteAccountPage';
import { GmailService } from '../../pages/GmailService';

export async function deleteFlow(page) {
  const deleteAcc = new DeleteAccountPage(page);
  const gmail = new GmailService();

  await deleteAcc.goToAccount();
  await deleteAcc.startDeleteFlow();
  await deleteAcc.confirmReason();
  await deleteAcc.confirmFinalDelete();

  const otp = await gmail.getOtp(Date.now());
  await deleteAcc.enterOtp(otp);
}