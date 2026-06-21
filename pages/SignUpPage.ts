import { Page, expect } from '@playwright/test';

export class RegisterPage {
  constructor(private page: Page) {}

  async open() {
    await this.page.goto(
    'https://visa-d2c.urbox.dev/sg_en/login',
    {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    }
  );

    await this.page
      .getByRole('button', { name: 'Accept' })
      .click();
  }

  async register(email: string) {
    await this.page.getByText('sign up here.').click();

    await this.page
      .getByRole('textbox', {
        name: 'Email address',
      })
      .fill(email);

    await this.page
      .getByRole('button', {
        name: 'Continue',
      })
      .click();
  }

  async verifyOtp(otp: string) {
  await this.page
    .getByRole('textbox', { name: 'OTP digit 1 of 6' })
    .fill(otp);

  const verifyBtn = this.page.getByRole('button', { name: 'Verify' });

  await expect(verifyBtn).toBeVisible();
  await expect(verifyBtn).toBeEnabled();

  await verifyBtn.click();


    // ✅ IMPORTANT: wait UI transition after OTP
  await this.page.waitForLoadState('networkidle');

  

  // OPTIONAL: ensure Continue button stable
  const finalContinueBtn = this.page
    .locator('button')
    .filter({ hasText: /Continue/i })
    .first();

  await finalContinueBtn.waitFor({ state: 'visible' });
  await expect(finalContinueBtn).toBeEnabled();

  await finalContinueBtn.click();
  }
 // ✅SUCCESS FLOW CHECK

async expectPasswordPage() {
  await expect(
    this.page.locator('#password')
  ).toBeVisible();
}
// ❌ ERROR FLOW CHECK
async submitInvalidOtp(otp: string) {
  await this.page
    .getByRole('textbox', { name: 'OTP digit 1 of 6' })
    .fill(otp);

  await this.page
    .getByRole('button', { name: 'Verify' })
    .click();
}

  async createPassword(password: string) {
    await this.page
      .locator('#password')
      .fill(password);

    await this.page
      .locator('#confirmPassword')
      .fill(password);

    await this.page
      .getByRole('button', {
        name: 'Continue',
      })
      .click();
  }

  async fillProfile() {
    // await this.page
    //   .getByRole('button', {
    //     name: 'sg Singapore',
    //   })
    //   .click();

    // await this.page
    //   .getByRole('button', {
    //     name: 'au Australia',
    //   })
    //   .click();

    await this.page
      .getByRole('button', {
        name: 'Continue',
      })
      .click();

    await this.page
      .getByRole('textbox', {
        name: 'First name (required)',
      })
      .fill('Kieu');

    await this.page
      .getByRole('textbox', {
        name: 'Last name (required)',
      })
      .fill('Vo');

    await this.page
      .getByRole('button', {
        name: 'Continue',
      })
      .click();
  }

  async acceptTerms() {
    await this.page
      .getByRole('checkbox')
      .first()
      .check();

    await this.page
      .getByRole('checkbox')
      .nth(1)
      .check();

    await this.page
      .getByRole('button', {
        name: 'Continue',
      })
      .click();
  }

  async addCard() {
    await this.page
      .getByRole('button', {
        name: 'Continue without',
      })
      .click();

    await this.page
      .getByRole('textbox', {
        name: 'Card number',
      })
      .fill('4006 1010 0000 1004');

    await this.page
      .getByRole('textbox', {
        name: 'Expiry date (MM / YY)',
      })
      .fill('12/35');

    await this.page
      .getByRole('button', {
        name: 'Continue',
      })
      .click();
  }
}