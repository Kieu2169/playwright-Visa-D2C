import path from 'path';
import { authenticate } from '@google-cloud/local-auth';

export class GmailService {
  async getOtp(
    startTime: number
  ): Promise<string> {
    const auth = await authenticate({
      scopes: [
        'https://www.googleapis.com/auth/gmail.readonly',
      ],
      keyfilePath: path.join(
        process.cwd(),
        'credentials.json'
      ),
    });

    const token =
      auth.credentials.access_token;

    if (!token) {
      throw new Error(
        'Access token not found'
      );
    }

    for (let i = 0; i < 30; i++) {
      console.log(
        `Checking OTP... ${i + 1}`
      );

      const listResponse = await fetch(
        'https://gmail.googleapis.com/gmail/v1/users/me/messages?q=subject:"Your one-time verification code"&includeSpamTrash=true',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const listData: any =
        await listResponse.json();

      const messages =
        listData.messages || [];

      console.log(
        'Messages found:',
        messages.length
      );

      for (const msg of messages) {
        const messageResponse =
          await fetch(
            `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        const messageData: any =
          await messageResponse.json();

        const emailTime = Number(
          messageData.internalDate
        );

        // bỏ qua email cũ
        if (emailTime < startTime) {
          continue;
        }

        const body =
          JSON.stringify(messageData);

        const otp =
          body.match(/\b\d{6}\b/);

        if (otp) {
          console.log(
            `OTP found: ${otp[0]}`
          );

          return otp[0];
        }
      }

      await new Promise(resolve =>
        setTimeout(resolve, 5000)
      );
    }

    throw new Error('OTP not found');
  }
}