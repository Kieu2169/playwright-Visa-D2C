import { Page, expect } from '@playwright/test';

export class DeleteAccountPage {
  constructor(private page: Page) {}
async open() {
  await this.page.goto(
    'https://visa-d2c.urbox.dev/sg_en/category/dining/beyond-the-menu',
    { waitUntil: 'domcontentloaded' }
  );

  await this.page.waitForLoadState('networkidle');
}

  async goToAccount() {
  await this.page.waitForLoadState('networkidle');

  // 🔥 WAIT FOR AUTH UI READY (IMPORTANT)
  const icon = this.page.locator('.icon-wrap').first();

  await icon.waitFor({ state: 'visible', timeout: 20000 });

  await icon.click();

  await this.page.getByText('Account').click();
}

  async startDeleteFlow() {
    await this.page
      .getByRole('link', { name: /Delete Account/i })
      .click();
  }

  async confirmReason() {
    await this.page
      .getByRole('button', { name: /issue with my/i })
      .click();

    await this.page
      .getByRole('button', { name: 'Continue' })
      .click();
  }

  async confirmFinalDelete() {
    await this.page
      .getByRole('button', { name: /I understand/i })
      .click();

    await this.page
      .getByRole('button', { name: /Delete my account/i })
      .click();
  }

  async enterOtp(otp: string) {
    await this.page
      .getByRole('textbox', { name: /OTP digit 1 of/i })
      .fill(otp);

    await this.page
      .getByRole('button', { name: 'Verify' })
      .click();

    // ✅ FIX TIMING ISSUE AFTER VERIFY
    await this.page.waitForLoadState('networkidle');

  }
}